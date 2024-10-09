import Papa from 'papaparse';
import type { BaseColumn } from '../types';

// Function to copy both columns and data to the clipboard
export const copyToClipboard = <T>(data: T[], columns: BaseColumn<T>[]): void => {


    // Prepare CSV content using PapaParse's unparse function
    const csv = Papa.unparse({
        fields: columns.map(col => col.title), // Use the title for column headers
        data: data.map(row =>
            columns.map(col => (row as Record<string, unknown>)[col.id as string]) // Map each column id to the row's data
        ),
    }, {
        header: true, // Include column headers in the output
    });

    // Copy CSV to clipboard
    navigator.clipboard.writeText(csv)
        .then(() => {
            console.log('Rows and columns copied to clipboard successfully!');
        })
        .catch(err => {
            console.error('Failed to copy rows and columns to clipboard: ', err);
        });
};
