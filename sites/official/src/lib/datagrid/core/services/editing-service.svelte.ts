import type { GridBasicRow, LeafColumn } from "../types";
import { BaseService } from "./base-service";

export class EditingService extends BaseService {
    updateCellValue = (row: GridBasicRow<any>, column: LeafColumn<any>, value: any, rowIdentifier: any = 'id') => {
        const prevValue = row.original[column.columnId];
        const prevOriginalRow = { ...row.original };        

        
        const newOriginalData = [...this.datagrid.originalState.data].map(originaLRow => {
            if (originaLRow[rowIdentifier] === row.identifier) {
                return { ...originaLRow, [column.columnId]: value };
            } else {
                return originaLRow;
            }
        })

        // TODO: measure performance of both solutions and pick faster one
        // ? We can either update values directly
        // row.original = { ...row.original, [column.columnId]: value };
        // row.identifier = this.datagrid.rowIdGetter(row.original);
        // row.index = this.datagrid.rowIndexGetter(row.original, row.parentIndex, 0);
        // but then we have to write code for update each cache eg filtered, paginated...... 
        // .. to be implemented 
        
        this.datagrid.originalState = {
            columns: this.datagrid.originalState.columns,
            data: newOriginalData
        }

        // or we can just simply refresh the datagrid invalidang everything, this will trigger internal logic
        this.datagrid.refresh(() => this.datagrid.cacheManager.invalidate('everything'), { recalculateAll: true })

        this.datagrid.events.emit('onCellEdit', { newOriginalRow: row.original, prevOriginalRow, prevValue, newValue: value });

    }
}