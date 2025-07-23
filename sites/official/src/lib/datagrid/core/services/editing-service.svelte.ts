import { getNestedValue, setNestedValue } from '../column-creation/utils';
import type { AccessorColumn, GridBasicRow, LeafColumn } from '../types';
import { BaseService } from './base-service';

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
	 * @param {LeafColumn<AccessorColumn>} column The column containing the cell to update.
	 * @param {any} value The new value to set for the cell.
	 * @param {any} [rowIdentifier='id'] The identifier for the row, defaulting to 'id'.
	 *
	 * @fires onCellEdit Emitted after a cell value is updated, providing the new and previous row data and the previous and new cell values.
	 */
	updateCellValue = (
		row: GridBasicRow<any>,
		column: LeafColumn<AccessorColumn<any>>,
		value: any,
		rowIdentifier: any = 'id'
	) => {
		column = column as AccessorColumn<any>; // Ensure column is typed correctly

		const prevValue = getNestedValue(row.original, column.accessorKey);
		const prevOriginalRow = { ...row.original };

		const newOriginalData = [...this.datagrid.originalState.data].map((originalRow) => {
			if (originalRow[rowIdentifier] === row.identifier) {
				return setNestedValue(originalRow, column.accessorKey, value);
			} else {
				return originalRow;
			}
		});

		this.datagrid.originalState = {
			columns: this.datagrid.originalState.columns,
			data: newOriginalData
		};

		this.datagrid.refresh(() => this.datagrid.cacheManager.invalidate('everything'), {
			recalculateAll: true
		});

		this.datagrid.events.emit('onCellEdit', {
			newOriginalRow: row.original,
			prevOriginalRow,
			prevValue,
			newValue: value,
			column
		});
	};
}
