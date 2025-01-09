import { isGroupColumn } from "../column-guards";
import type { AnyColumn, GroupColumn } from "../column-creation/types";
import type { Datagrid } from "../index.svelte";
import { flattenColumns } from "../utils.svelte";


export class ColumnProcessor<TOriginalRow> {
    datagrid: Datagrid<TOriginalRow>;
    constructor(datagrid: Datagrid<TOriginalRow>) {
        this.datagrid = datagrid;
    }


    transformColumns = (columns: AnyColumn<TOriginalRow>[]): AnyColumn<TOriginalRow>[] => {
        this.assignParentColumnIds(columns);

        const groupByColumns = this.datagrid.grouping.groupByColumns;

        // Completely rework the column transformation
        const groupedColumns: AnyColumn<TOriginalRow>[] = [];
        const nonGroupedColumns: AnyColumn<TOriginalRow>[] = [];

        columns.forEach((column) => {
            // Check if the column's columnId is in the groupByColumns
            if (groupByColumns.includes(column.columnId)) {
                groupedColumns.push(column);
            } else {
                nonGroupedColumns.push(column);
            }
        });

        // Return grouped columns first, followed by non-grouped columns
        return [...groupedColumns, ...nonGroupedColumns];
    };

    assignParentColumnIds(columns: AnyColumn<TOriginalRow>[], parentColumnId: string | null = null) {
        columns.forEach(column => {
            if (isGroupColumn(column)) {
                const groupColumn = column as GroupColumn<TOriginalRow>;
                this.assignParentColumnIds(groupColumn.columns, groupColumn.columnId);
            }
            column.parentColumnId = parentColumnId;
        })
    }


    refreshColumnPinningOffsets() {
        // const columns = flattenColumns(this.datagrid.columns);
        const columns = flattenColumns(this.datagrid.columns);
        const newColumns: AnyColumn<any>[] = [];
        for (let i = 0; i < columns.length; i++) {
            const col = columns[i];
            if (col.state.pinning.position === 'none') {
                col.state.pinning.offset = 0;
            } else {
                col.state.pinning.offset = this.datagrid.columnPinning.calculateOffset(col.columnId, col.state.pinning.position);
            }

            newColumns.push(col);
        }

        const hierarchicalColumns = this.datagrid.processors.column.createHierarchicalColumns(newColumns);
        
        this.datagrid.columns = hierarchicalColumns
    };

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
    
        // Helper function to merge two group columns
        const mergeGroupColumns = (
            existing: GroupColumn<TOriginalRow>,
            incoming: GroupColumn<TOriginalRow>
        ) => {
            existing.columns = existing.columns || [];
            if (incoming.columns) {
                for (const incomingChild of incoming.columns) {
                    const existingChild = findColumnById(incomingChild.columnId, existing.columns);
                    if (!existingChild) {
                        existing.columns.push(deepCopyColumn(incomingChild));
                    } else if (existingChild.type === 'group' && incomingChild.type === 'group') {
                        mergeGroupColumns(existingChild, incomingChild);
                    }
                }
            }
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
            const currentColumn = deepCopyColumn(column);
    
            if (currentColumn.parentColumnId) {
                const parentColumn = allFlatColumns.find(
                    col => col.columnId === currentColumn.parentColumnId
                );
                
                if (!parentColumn) {
                    throw new Error(`Parent column ${currentColumn.parentColumnId} not found`);
                }
    
                const parent = deepCopyColumn(parentColumn) as GroupColumn<TOriginalRow>;
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
                        mergeGroupColumns(existingRoot, hierarchy);
                    }
                } else {
                    result.push(hierarchy);
                }
                
                processedColumns.add(column.columnId);
            }
        }
    
        return result;
    }

}