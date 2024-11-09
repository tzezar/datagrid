import Papa from 'papaparse';
import type { BaseColumn } from '../types';

/**
 * Exports data to a CSV file using the specified columns and a given filename.
 *
 * This function maps the provided data array to a CSV format based on the specified columns.
 * It then triggers a download of the generated CSV file.
 *
 * @param {T[]} data - The array of data objects to be exported.
 * @param {BaseColumn<T>[]} columns - The array of column definitions that include the id and other properties.
 * @param {string} [fileName='data'] - The name of the file to be downloaded, defaults to 'data'.
 * @template T - The type of data items being processed.
 */
export const exportToCSV = <T>(data: T[], columns: BaseColumn<T>[], fileName: string = "data"): void => {
    // Prepare the data for CSV conversion
    const csvData = data.map((row) => {
        // Create an object for each row's data
        const rowData: Record<string, unknown> = {};
        columns.forEach((column) => {
            // Ensure the column id exists in the row data
            // @ts-expect-error ts(2322) - Adjust this if type definitions allow
            rowData[column.id] = row[column.id]; 
        });
        return rowData; // Return the constructed row data object
    });

    // Convert the data array to CSV format
    const csv = Papa.unparse(csvData);
    
    // Create a Blob from the CSV data
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a'); // Create an anchor element for download
    
    if (link.download !== undefined) {
        // Feature detection for download capability
        const url = URL.createObjectURL(blob); // Create a URL for the Blob
        link.setAttribute('href', url); // Set the href to the Blob URL
        link.setAttribute('download', `${fileName}.csv`); // Set the download attribute with filename
        link.style.visibility = 'hidden'; // Hide the link element
        document.body.appendChild(link); // Append link to the body
        link.click(); // Trigger the download
        document.body.removeChild(link); // Remove the link from the DOM
    }
};
