import * as XLSX from 'xlsx';
import type { BaseColumn } from '../types';

/**
 * Exports data to an Excel file using the specified columns and a given filename.
 *
 * This function converts the provided data array to an Excel format based on the specified columns
 * and triggers a download of the generated Excel file.
 *
 * @param {T[]} data - The array of data objects to be exported.
 * @param {BaseColumn<T>[]} columns - The array of column definitions that include the id and other properties.
 * @param {string} [fileName='data'] - The name of the file to be downloaded, defaults to 'data'.
 * @template T - The type of data items being processed.
 */
export const exportToExcel = <T>(data: T[], columns: BaseColumn<T>[], fileName: string = 'data'): void => {
    // Prepare the data for Excel conversion
    const rowDataArray = data.map((row) => {
        // Create an object for each row's data
        const rowData: Record<string, unknown> = {};
        columns.forEach((column) => {
            // Ensure the column id exists in the row data
            // @ts-expect-error - Adjust this if type definitions allow
            rowData[column.id] = row[column.id]; 
        });
        return rowData; // Return the constructed row data object
    });

    // Create a worksheet from the prepared data
    const worksheet = XLSX.utils.json_to_sheet(rowDataArray);

    // Create a new workbook and append the worksheet
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');

    // Write the workbook to a file
    XLSX.writeFile(workbook, `${fileName}.xlsx`);
};
