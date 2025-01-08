import { isGroupColumn } from "../column-guards";
import type { AccessorColumn, AnyColumn, ComputedColumn, DisplayColumn, GroupColumn } from "../helpers/column-creators";
import type { Datagrid } from "../index.svelte";
import type { LeafColumn, PinningPosition } from "../types";
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

    getLeafColumns(): LeafColumn<TOriginalRow>[] {
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
        const allFlatColumns = flattenColumns(this.datagrid.columns);
        
        // Helper function to find a column by ID in a hierarchical structure
        const findColumnById = (
            columnId: string,
            columns: AnyColumn<TOriginalRow>[]
        ): AnyColumn<TOriginalRow> | null => {
            for (const col of columns) {
                if (col.columnId === columnId) return col;
                if (col.type === 'group' && col.columns) {
                    const found = findColumnById(columnId, col.columns);
                    if (found) return found;
                }
            }
            return null;
        };
    
        // Helper function to create a deep copy of a column
        const deepCopyColumn = (column: AnyColumn<TOriginalRow>): AnyColumn<TOriginalRow> => {
            const copy = { ...column };
            if (copy.type === 'group' && copy.columns) {
                copy.columns = copy.columns.map(col => deepCopyColumn(col));
            }
            return copy;
        };
    
        // Build the complete hierarchy for a column
        const buildCompleteHierarchy = (
            column: AnyColumn<TOriginalRow>,
            processed: Set<string>
        ): AnyColumn<TOriginalRow> => {
            if (processed.has(column.columnId)) {
                return deepCopyColumn(column);
            }
            
            processed.add(column.columnId);
            let currentColumn = deepCopyColumn(column);
    
            if (currentColumn.parentColumnId) {
                const parentColumn = allFlatColumns.find(
                    col => col.columnId === currentColumn.parentColumnId
                );
                
                if (!parentColumn) {
                    throw new Error(`Parent column ${currentColumn.parentColumnId} not found`);
                }
    
                const parent = deepCopyColumn(parentColumn);
                parent.columns = [currentColumn];
                return buildCompleteHierarchy(parent, processed);
            }
    
            return currentColumn;
        };
    
        // Process columns and build final hierarchy
        const result: AnyColumn<TOriginalRow>[] = [];
        const processedColumns = new Set<string>();
    
        // First pass: build initial hierarchies
        for (const column of filteredFlatColumns) {
            if (!processedColumns.has(column.columnId)) {
                const hierarchy = buildCompleteHierarchy(column, new Set());
                
                // Check if we already have this root in our result
                const existingRoot = result.find(col => col.columnId === hierarchy.columnId);
                
                if (existingRoot) {
                    // Merge the hierarchies
                    if (existingRoot.type === 'group' && hierarchy.type === 'group') {
                        existingRoot.columns = existingRoot.columns || [];
                        const newChild = hierarchy.columns?.[0];
                        if (newChild && !findColumnById(newChild.columnId, existingRoot.columns)) {
                            existingRoot.columns.push(newChild);
                        }
                    }
                } else {
                    result.push(hierarchy);
                }
                
                processedColumns.add(column.columnId);
            }
        }
    
        return result;
    }




    getColumnsPinnedToLeft(): AnyColumn<TOriginalRow>[] {
        // return this.datagrid.columnManager.getLeafColumns().filter(col => col.state.pinning.position === 'left' || this.datagrid.grouping.groupByColumns.includes(col.columnId))
        // return this.datagrid.columnManager.getLeafColumns().filter(col => col.state.pinning.position === 'left')
        let a =  flattenColumns(this.datagrid.columns).filter(col => col.state.pinning.position === 'left' || this.datagrid.grouping.groupByColumns.includes(col.columnId))
        return a
    }
    getColumnsPinnedToRight(): AnyColumn<TOriginalRow>[] {
        return this.datagrid.columnManager.getLeafColumns().filter(col => col.state.pinning.position === 'right')
    }
    getColumnsPinnedToNone(): AnyColumn<TOriginalRow>[] {
        return this.datagrid.columnManager.getLeafColumns().filter(col => col.state.pinning.position === 'none').filter(col => !this.datagrid.grouping.groupByColumns.includes(col.columnId))
    }


    getColumnsInOrder(): AnyColumn<TOriginalRow>[] {
        const cols = [...this.getColumnsPinnedToLeft(), ...this.createHierarchicalColumns(this.getColumnsPinnedToNone()), ...this.createHierarchicalColumns(this.getColumnsPinnedToRight())]
        // const cols = [...this.getColumnsPinnedToLeft()]
        return cols
    }





    handlers = {
        changeColumnPinningPosition: (columnId: string, position: PinningPosition) => {
            let column = findColumnById(this.datagrid.columns, columnId);
            if (!column) throw new Error(`Column ${columnId} not found`);
            this.datagrid.columnPinning.changeColumnPinningPosition(column, position);
            this.datagrid.processors.column.refreshColumnPinningOffsets();
        }
    }




}