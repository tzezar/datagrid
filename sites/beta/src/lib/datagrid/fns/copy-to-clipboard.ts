import Papa from 'papaparse';
import type { BaseColumn } from '../types';

/**
 * Function to copy both columns and data to the clipboard in CSV format.
 *
 * This function prepares the CSV content by using PapaParse's `unparse` function.
 * It includes both column titles and the associated row data.
 *
 * @param {T[]} data - The array of data objects to be copied.
 * @param {BaseColumn<T>[]} columns - The array of column definitions, including titles and ids.
 * @template T - The type of data items being processed.
 */
export const copyToClipboard = <T>(data: T[], columns: BaseColumn<T>[]): void => {
    // Prepare the CSV content using PapaParse's unparse function
    const csv = Papa.unparse({
        fields: columns.map(col => col.title), // Use the title for column headers
        data: data.map(row => 
            columns.map(col => (row as Record<string, unknown>)[col.id as string]) // Map each column id to the corresponding row's data
        ),
    }, {
        header: true, // Include column headers in the output
    });

    // Attempt to copy the CSV to the clipboard
    navigator.clipboard.writeText(csv)
        .then(() => {
            console.log('Rows and columns copied to clipboard successfully!'); // Log success message
        })
        .catch(err => {
            console.error('Failed to copy rows and columns to clipboard: ', err); // Log error message
        });
};
