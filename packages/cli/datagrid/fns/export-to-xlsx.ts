import * as XLSX from 'xlsx';
import type { BaseColumn } from '../types';


export const exportToExcel = <T>(data: T[], columns: BaseColumn<T>[], fileName: string = 'data') => {
    const worksheet = XLSX.utils.json_to_sheet(
        data.map((row) => {
            const rowData = {};
            columns.forEach((column) => {
                // @ts-expect-error TODO
                rowData[column.id] = row[column.id];
            });
            return rowData;
        })
    );

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');

    XLSX.writeFile(workbook, `${fileName}.xlsx`);
};
