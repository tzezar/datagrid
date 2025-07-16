import type { GridBasicRow, LeafColumn } from "../types";
import { BaseService } from "./base-service";


/**
 * Service for managing cell editing in the datagrid.
 * 
 * @extends BaseService
 */
export class EditingService extends BaseService {
    /**
 * Updates the value of a specific cell in the grid and triggers necessary actions, such as refreshing the grid or invalidating caches.
 * 
 * @param {GridBasicRow<any>} row The row containing the cell to update.
 * @param {LeafColumn<any>} column The column containing the cell to update.
 * @param {any} value The new value to set for the cell.
 * @param {any} [rowIdentifier='id'] The identifier for the row, defaulting to 'id'.
 * 
 * @fires onCellEdit Emitted after a cell value is updated, providing the new and previous row data and the previous and new cell values.
 */
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

        this.datagrid.events.emit('onCellEdit', { newOriginalRow: row.original, prevOriginalRow, prevValue, newValue: value, column });
    }
}