import { isGroupColumn } from "../column-guards";
import type { AccessorColumn, AnyColumn, ComputedColumn, DisplayColumn, GroupColumn } from "../helpers/column-creators";
import type { Datagrid } from "../index.svelte";
import { filterGroupColumns, findColumnById, flattenColumns } from "../utils.svelte";



export class ColumnManager<TOriginalRow> {
    datagrid: Datagrid<TOriginalRow>;
    constructor(datagrid: Datagrid<TOriginalRow>) {
        this.datagrid = datagrid;
    }

    getGroupColumns(): GroupColumn<TOriginalRow>[] {
        return filterGroupColumns(flattenColumns(this.datagrid.columns));
    }

    getFlattenColumns(): AnyColumn<TOriginalRow>[] {
        const flattened: AnyColumn<any>[] = [];
        for (const column of this.datagrid.columns) {
            if (isGroupColumn(column)) {
                flattened.push(column);
                flattened.push(...flattenColumns(column.columns));
            } else {
                flattened.push(column);
            }
        }
        return flattened;
    }

    getActualColumns(): (AccessorColumn<TOriginalRow> | ComputedColumn<TOriginalRow> | DisplayColumn<TOriginalRow>)[] {
        return this.getFlattenColumns().filter(col => col.type !== 'group')
    }

    getColumnWithGroupStructureAbove<TOriginalRow>(
        columnId: string,
    ): GroupColumn<TOriginalRow> | null {
        const column = findColumnById(this.datagrid.columns, columnId);
        if (!column) {
            throw new Error(`Column ${columnId} not found`);
        }

        if (column.parentColumnId === null) {
            return column
        }

        const buildGroupHierarchy = (
            currentColumn: AnyColumn<any> | GroupColumn<TOriginalRow>
        ): GroupColumn<TOriginalRow> | null => {
            if (currentColumn.parentColumnId === null) {
                return null;
            }

            const parentGroup = this.datagrid.columnGrouping.findParentColumnGroup(currentColumn.parentColumnId);
            if (!parentGroup) {
                return null;
            }

            const upperGroup = buildGroupHierarchy(parentGroup);
            const currentGroup = {
                ...parentGroup,
                columns: [currentColumn]
            };

            if (upperGroup) {
                upperGroup.columns = [currentGroup];
                return upperGroup;
            }

            return currentGroup;
        };

        return buildGroupHierarchy(column);
    }


    createHierarchicalColumns(filteredFlatColumns: AnyColumn<TOriginalRow>[]): AnyColumn<TOriginalRow>[] {
        // Make a copy of the filteredFlatColumns to avoid mutating the original
        const copiedColumns = [...filteredFlatColumns];
        const newColumns: AnyColumn<TOriginalRow>[] = [];
        const allFlatColumns = flattenColumns(this.datagrid.columns);
        const processedRootColumns = new Set<string>(); // Track processed root columns
    
        const findInNewColumn = (column: AnyColumn<TOriginalRow>, columns: AnyColumn<TOriginalRow>[]): AnyColumn<TOriginalRow> | null => {
            for (let col of columns) {
                if (col.columnId === column.parentColumnId) {
                    return col;
                }
                if (col.type === 'group' && col.columns) {
                    const found = findInNewColumn(column, col.columns);
                    if (found) {
                        return found;
                    }
                }
            }
            return null;
        };
    
        const buildHierarchy = (column: AnyColumn<TOriginalRow>): AnyColumn<TOriginalRow> => {
            if (column.parentColumnId === null) {
                return { ...column };
            }
    
            const parentColumn = allFlatColumns.find(col => col.columnId === column.parentColumnId);
            if (!parentColumn) {
                throw new Error(`Parent column ${column.parentColumnId} not found`);
            }
    
            let copy = { ...parentColumn };
            copy.columns = [column];
    
            if (copy.parentColumnId) {
                return buildHierarchy(copy);
            }
            return copy;
        };
    
        // Remove duplicate columns and merge them
        const mergedColumns = copiedColumns.filter((col, index, self) =>
            index === self.findIndex((t) => t.columnId === col.columnId)
        );
    
        // Process columns in order, handling parent-child relationships
        for (const column of mergedColumns) {
            const parentColumn = findInNewColumn(column, newColumns);
            
            if (parentColumn) {
                // Add column to existing parent
                parentColumn.columns.push({ ...column });
            } else {
                // Build hierarchy for new root column
                const hierarchicalColumn = buildHierarchy(column);
                
                // Only add root columns that haven't been processed yet
                if (!processedRootColumns.has(hierarchicalColumn.columnId)) {
                    processedRootColumns.add(hierarchicalColumn.columnId);
                    newColumns.push(hierarchicalColumn);
                } else {
                    // If root column exists, find it and merge any new children
                    const existingRoot = newColumns.find(col => col.columnId === hierarchicalColumn.columnId);
                    if (existingRoot && existingRoot.columns && hierarchicalColumn.columns) {
                        existingRoot.columns.push(...hierarchicalColumn.columns);
                    }
                }
            }
        }
    
        return newColumns;
    }




    getColumnsPinnedToLeft(): AnyColumn<TOriginalRow>[] {
        return this.datagrid.columnManager.getActualColumns().filter(col => col.state.pinning.position === 'left' || this.datagrid.grouping.groupByColumns.includes(col.columnId))
    }
    getColumnsPinnedToRight(): AnyColumn<TOriginalRow>[] {
        return this.datagrid.columnManager.getActualColumns().filter(col => col.state.pinning.position === 'right')
    }
    getColumnsPinnedToNone(): AnyColumn<TOriginalRow>[] {
        return this.datagrid.columnManager.getActualColumns().filter(col => col.state.pinning.position === 'none').filter(col => !this.datagrid.grouping.groupByColumns.includes(col.columnId))
    }

    getColumnsInOrder(): AnyColumn<TOriginalRow>[] {
        const cols = [...this.getColumnsPinnedToLeft(), ...this.createHierarchicalColumns(this.getColumnsPinnedToNone()), ...this.createHierarchicalColumns(this.getColumnsPinnedToRight())]
        return cols
    }
}