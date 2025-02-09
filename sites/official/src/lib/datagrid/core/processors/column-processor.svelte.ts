import { isGroupColumn } from "../helpers/column-guards";
import type { ColumnDef, GroupColumn } from "../types";
import type { DatagridCore } from "../index.svelte";
import type { ColumnId } from "../types";
import { flattenColumnStructureAndClearGroups } from "../utils.svelte";


export class ColumnProcessor<TOriginalRow> {
    datagrid: DatagridCore<TOriginalRow>;
    constructor(datagrid: DatagridCore<TOriginalRow>) {
        this.datagrid = datagrid;
    }

    initializeColumns = (columns: ColumnDef<any>[]): ColumnDef<any>[] => {
        columns = this.datagrid.lifecycleHooks.executePreProcessColumns(columns);

        columns = this.placeGroupColumnsInFront(columns);
        // ? Might be better to move this to column creation fns
        columns.forEach(col => {
            return {
                isGroupColumn: () => col.type === 'group',
                ...col,
            }
        })

        columns = this.datagrid.lifecycleHooks.executePostProcessColumns(columns);

        return columns
    };

    assignParentColumnIds(columns: ColumnDef<TOriginalRow>[], parentColumnId: ColumnId | null = null) {
        columns.forEach(column => {
            if (isGroupColumn(column)) {
                const groupColumn = column as GroupColumn<TOriginalRow>;
                this.assignParentColumnIds(groupColumn.columns, groupColumn.columnId);
            }
            column.parentColumnId = parentColumnId;
        })
        return columns;
    }

    placeGroupColumnsInFront = (columns: ColumnDef<any>[]): ColumnDef<any>[] => {
        const groupByColumns = this.datagrid.features.grouping.activeGroups;
        const groupedColumns: ColumnDef<TOriginalRow>[] = [];
        const nonGroupedColumns: ColumnDef<TOriginalRow>[] = [];
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

    refreshColumnPinningOffsets(columns?: ColumnDef<any>[]) {
        if (!columns) columns = flattenColumnStructureAndClearGroups(this.datagrid._columns);

        const newColumns: ColumnDef<any>[] = [];
        for (let i = 0; i < columns.length; i++) {
            const col = columns[i];
            if (col.state.pinning.position === 'none') {
                col.state.pinning.offset = 0;
            } else {
                col.state.pinning.offset = this.datagrid.features.columnPinning.calculateOffset(columns, col.columnId, col.state.pinning.position);
            }

            newColumns.push(col);
        }

        const hierarchicalColumns = this.datagrid.processors.column.createColumnHierarchy(newColumns);

        this.datagrid._columns = hierarchicalColumns
    };




    createColumnHierarchy<TOriginalRow>(partialFlatColumns: ColumnDef<TOriginalRow>[]): ColumnDef<TOriginalRow>[] {
        const results: ColumnDef<TOriginalRow>[] = [];

        // handle root columns first
        partialFlatColumns.forEach(col => {
            if (col.parentColumnId === null) {
                results.push(col);
            }
        });
        partialFlatColumns = partialFlatColumns.filter(col => col.parentColumnId !== null)


        const findGroupColumnInResults = (columns: ColumnDef<TOriginalRow>[], column: ColumnDef<TOriginalRow>): GroupColumn<TOriginalRow> | null => {
            for (const col of columns) {
                if (col.columnId === column.parentColumnId) return col as GroupColumn<TOriginalRow>;
                if (col.type === 'group' && col.columns) {
                    const found = findGroupColumnInResults(col.columns, column);
                    if (found) return found;
                }
            }
            return null;
        };

        while (partialFlatColumns.length > 0) {
            const column = partialFlatColumns.shift()!;
            if (column.parentColumnId === null) {
                results.push(column);
                continue;
            }
            let parentColumn = findGroupColumnInResults(results, column);
            if (parentColumn === null) {
                // Check next column
                partialFlatColumns.push(column);
                continue;
            } else {
                parentColumn = parentColumn as GroupColumn<TOriginalRow>;
                parentColumn.columns.push(column);
            }
        }

        return results
    }


     calculateColSpan(col: ColumnDef<TOriginalRow>): number {
        if (col.state.visible === false) return 0;

        if (isGroupColumn(col)) {
            const visibleChildrenSpan = col.columns.reduce((sum, child) => 
                sum + this.calculateColSpan(child), 0);
            
            return visibleChildrenSpan === 0 ? 0 : visibleChildrenSpan;
        }

        return 1;
    }

    getMaxDepth(cols: ColumnDef<TOriginalRow>[]): number {
        return cols.reduce((max, col) => {
            if (isGroupColumn(col)) {
                return Math.max(max, this.getMaxDepth(col.columns) + 1);
            }
            return max;
        }, 0);
    }

    generateHeaderRows(cols: ColumnDef<TOriginalRow>[]): ColumnDef<TOriginalRow>[][] {
        const depth = this.getMaxDepth(cols);
        const rows: (ColumnDef<TOriginalRow> & { 
            colSpan?: number; 
            colStart?: number; 
            rowSpan?: number;
            rowStart?: number; // Add rowStart property
        })[][] = Array(depth + 1).fill(null).map(() => []);
    
        const processColumn = (col: ColumnDef<TOriginalRow>, level: number, colStart: number): number => {
            const colSpan = this.calculateColSpan(col);
            if (colSpan === 0) return colStart;
    
            let rowSpan = 1;
            let rowStart = level;

            if (!isGroupColumn(col)) {
                if (col.state.pinning?.position) {
                    rowSpan = depth + 1;
                    rowStart = 0; // Always start from the top for pinned columns
                } else {
                    rowSpan = depth - level + 1;
                }
            }
    
            rows[level].push({
                ...col,
                colSpan,
                colStart,
                rowSpan,
                rowStart
            });
    
            if (isGroupColumn(col)) {
                let currentStart = colStart;
                col.columns.forEach((child) => {
                    currentStart = processColumn(child, level + 1, currentStart);
                });
                return colStart + colSpan;
            }
    
            return colStart + 1;
        };
    
        let currentStart = 0;
        cols.forEach((col) => {
            currentStart = processColumn(col, 0, currentStart);
        });
    
        return rows;
    }
    
    
}