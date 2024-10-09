import Papa from 'papaparse';
import type { BaseColumn } from '../types';

// Define a type for row data that can be indexed by column ids

export const exportToCSV = <T>(data: T[], columns: BaseColumn<T>[], fileName="data") => {
    const csvData = data.map((row) => {
        const rowData = {};
        columns.forEach((column) => {
            // @ts-expect-error ts(2322)
            rowData[column.id] = row[column.id];
        });
        return rowData;
    });

    const csv = Papa.unparse(csvData);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    if (link.download !== undefined) {
        // feature detection
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', `${fileName}.csv`);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }
};
