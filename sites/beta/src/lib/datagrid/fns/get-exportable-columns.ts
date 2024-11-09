import type { BaseColumn } from "../types";

/**
 * Filters the columns to get only those that are exportable.
 *
 * @param {BaseColumn<T>[]} columns - The array of columns to filter.
 * @returns {BaseColumn<T>[]} - An array of columns that are exportable.
 */
export const getExportableColumns = <T>(columns: BaseColumn<T>[]): BaseColumn<T>[] => {
    return columns.filter(({ exportable }) => exportable !== false);
};
