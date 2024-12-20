import { createColumnGroup } from "../helpers/column-creators";
import type { Datagrid } from "../index.svelte";



export class ColumnGrouping<TOriginalRow> {
    private datagrid: Datagrid<TOriginalRow>;

    constructor(datagrid: Datagrid<TOriginalRow>) {
        this.datagrid = datagrid;
    }

    generateRandomColumnId(): string {
        return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    }

    createGroupColumn(header: string, parentColumnId: string | null): void {
        const groupColumn = createColumnGroup({
            header,
            columnId: this.generateRandomColumnId(),
            parentColumnId,
            columns: [],
        });
        this.datagrid.columns.push(groupColumn);
        this.datagrid.refreshColumnPinningOffsets();
    }


    renameGroupColumn(column: any, newHeader: string): void {
        column.header = newHeader;
        this.datagrid.refreshColumnPinningOffsets();
    }

}