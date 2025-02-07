import { isGroupColumn } from "../helpers/column-guards";
import type { AnyColumn, GroupColumn } from "../types";
import type { DatagridCore } from "../index.svelte";
import { flattenColumnStructureAndClearGroups } from "../utils.svelte";
import type { ColumnId } from "../types";


export class ColumnProcessor<TOriginalRow> {
    datagrid: DatagridCore<TOriginalRow>;
    constructor(datagrid: DatagridCore<TOriginalRow>) {
        this.datagrid = datagrid;
    }

    initializeColumns = (columns: AnyColumn<any>[]): AnyColumn<any>[] => {
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

    assignParentColumnIds(columns: AnyColumn<TOriginalRow>[], parentColumnId: ColumnId | null = null) {
        columns.forEach(column => {
            if (isGroupColumn(column)) {
                const groupColumn = column as GroupColumn<TOriginalRow>;
                this.assignParentColumnIds(groupColumn.columns, groupColumn.columnId);
            }
            column.parentColumnId = parentColumnId;
        })
        return columns;
    }

    placeGroupColumnsInFront = (columns: AnyColumn<any>[]): AnyColumn<any>[] => {
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

    refreshColumnPinningOffsets(columns?: AnyColumn<any>[]) {
        if (!columns) columns = flattenColumnStructureAndClearGroups(this.datagrid._columns);

        const newColumns: AnyColumn<any>[] = [];
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




    createColumnHierarchy<TOriginalRow>(partialFlatColumns: AnyColumn<TOriginalRow>[]): AnyColumn<TOriginalRow>[] {
        const results: AnyColumn<TOriginalRow>[] = [];

        // handle root columns first
        partialFlatColumns.forEach(col => {
            if (col.parentColumnId === null) {
                results.push(col);
            }
        });
        partialFlatColumns = partialFlatColumns.filter(col => col.parentColumnId !== null)


        const findGroupColumnInResults = (columns: AnyColumn<TOriginalRow>[], column: AnyColumn<TOriginalRow>): GroupColumn<TOriginalRow> | null => {
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

}