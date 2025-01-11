import { isGroupColumn } from "../helpers/column-guards";
import type { AnyColumn, GroupColumn } from "../column-creation/types";
import type { DataGrid } from "../index.svelte";
import { flattenColumns } from "../utils.svelte";


export class ColumnProcessor<TOriginalRow> {
    datagrid: DataGrid<TOriginalRow>;
    constructor(datagrid: DataGrid<TOriginalRow>) {
        this.datagrid = datagrid;
    }

    placeGroupColumnsFirst = (columns: AnyColumn<any>[]): AnyColumn<any>[] => {
        const groupByColumns = this.datagrid.features.grouping.groupByColumns;
        const groupedColumns: AnyColumn<TOriginalRow>[] = [];
        const nonGroupedColumns: AnyColumn<TOriginalRow>[] = [];
        columns.forEach((column) => {
            if (groupByColumns.includes(column.columnId)) {
                groupedColumns.push(column);
            } else {
                nonGroupedColumns.push(column);
            }
        });

        // Return grouped columns first, followed by non-grouped columns
        return [...groupedColumns, ...nonGroupedColumns];
    }

    transformColumns = (columns: AnyColumn<any>[]): AnyColumn<any>[] => {
        const newCols = this.placeGroupColumnsFirst(this.assignParentColumnIds(columns));
        newCols.forEach(col => {
            return {
                isGroupColumn: () => col.type === 'group',
                ...col,
            }
        })
        // this.datagrid.lifecycleHooks.executePreProcessColumns(newCols);
        
        return newCols
    };

    assignParentColumnIds(columns: AnyColumn<TOriginalRow>[], parentColumnId: string | null = null) {
        columns.forEach(column => {
            if (isGroupColumn(column)) {
                const groupColumn = column as GroupColumn<TOriginalRow>;
                this.assignParentColumnIds(groupColumn.columns, groupColumn.columnId);
            }
            column.parentColumnId = parentColumnId;
        })
        return columns;
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
                col.state.pinning.offset = this.datagrid.features.columnPinning.calculateOffset(col.columnId, col.state.pinning.position);
            }

            newColumns.push(col);
        }

        const hierarchicalColumns = this.datagrid.processors.column.createColumnHierarchy(newColumns);

        this.datagrid.columns = hierarchicalColumns
    };




    createColumnHierarchy<TOriginalRow>(flatColumns: AnyColumn<TOriginalRow>[]): AnyColumn<TOriginalRow>[] {
        // ! this raise error because there can be filtered flat columns
        
        // Hierarchy can be multiple levels deep, so we need to traverse the hierarchy and build the final result
    
        const results: AnyColumn<TOriginalRow>[] = [];
        const pendingColumns: AnyColumn<TOriginalRow>[] = [...flatColumns];
    
        const findParentColumnInResults = (columns: AnyColumn<TOriginalRow>[], column: AnyColumn<TOriginalRow>): AnyColumn<TOriginalRow> | null => {
            for (const col of columns) {
                if (col.columnId === column.parentColumnId) return col;
                if (col.type === 'group' && col.columns) {
                    const found = findParentColumnInResults(col.columns, column);
                    if (found) return found;
                }
            }
            return null;
        };
    
        let index = 0
    
        while (pendingColumns.length > 0) {
            index++
            if (index > 1000) throw new Error('Infinite loop detected in createColumnHierarchy');
            const column = pendingColumns.shift()!;
    
            if (column.parentColumnId === null) {
                console.log('column', column);
                results.push(column);
                continue;
            }
            let parentColumn = findParentColumnInResults(results, column);
            if (parentColumn === null) {
                // Check next column
                pendingColumns.push(column);
                continue;
            } else {
                parentColumn = parentColumn as GroupColumn<TOriginalRow>;
                parentColumn.columns.push(column);
            }
        }
    
    
        return results
    }
  



    // createColumnHierarchy<TOriginalRow>(flatColumns: AnyColumn<TOriginalRow>[]): AnyColumn<TOriginalRow>[] {
    //     const results: AnyColumn<TOriginalRow>[] = [];
    //     const pendingColumns: AnyColumn<TOriginalRow>[] = [...flatColumns];
    
    //     const findParentColumnInResults = (columns: AnyColumn<TOriginalRow>[], column: AnyColumn<TOriginalRow>): GroupColumn<TOriginalRow> | null => {
    //         for (const col of columns) {
    //             if (col.columnId === column.parentColumnId) return col.type === 'group' ? col as GroupColumn<TOriginalRow> : null;
    //             if (col.type === 'group' && col.columns) {
    //                 const found = findParentColumnInResults(col.columns, column);
    //                 if (found) return found;
    //             }
    //         }
    //         return null;
    //     };
    
    //     const unresolvedColumns = new Set(pendingColumns.map(c => c.columnId));
    //     let iterations = 0;
    
    //     while (pendingColumns.length > 0) {
    //         iterations++;
    //         if (iterations > flatColumns.length * 100) {
    //             throw new Error('Infinite loop detected in createColumnHierarchy');
    //         }
    
    //         const column = pendingColumns.shift()!;
    
    //         if (!column.parentColumnId) {
    //             results.push(column);
    //             unresolvedColumns.delete(column.columnId);
    //             continue;
    //         }
    
    //         const parentColumn = findParentColumnInResults(results, column);
    //         if (parentColumn) {
    //             parentColumn.columns.push(column);
    //             unresolvedColumns.delete(column.columnId);
    //         } else {
    //             pendingColumns.push(column); // Defer processing
    //         }
    //     }
    
    //     if (unresolvedColumns.size > 0) {
    //         console.warn('Some columns could not be resolved:', unresolvedColumns);
    //     }
    
    //     return results;
    // }
    

}