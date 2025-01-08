import { isGroupColumn } from "../column-guards";
import type { AnyColumn, GroupColumn } from "../helpers/column-creators";
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
                col.state.pinning.offset = this.datagrid.columnPinning.getOffset(col.columnId, col.state.pinning.position);
            }

            newColumns.push(col);
        }

        const hierarchicalColumns = this.datagrid.columnManager.createHierarchicalColumns(newColumns);
        
        this.datagrid.columns = hierarchicalColumns
    };

}