import Papa from 'papaparse';
import * as XLSX from 'xlsx';
import { XMLBuilder } from 'fast-xml-parser';
import type { DataGrid } from "../index.svelte";
import type { AnyColumn } from "../column-creation/types";

export class ExportingFeature<T> {
    private datagrid: DataGrid<T>;
    fileName: string = $state('table');

    constructor(datagrid: DataGrid<T>) {
        this.datagrid = datagrid;
    }

    /**
     * Exports data to JSON format and triggers download
     */
    exportToJSON(): void {
        const jsonData = this.prepareData();
        const blob = new Blob([JSON.stringify(jsonData, null, 2)], { type: 'application/json' });
        this.downloadFile(blob, `${this.fileName}.json`);
    }

    /**
     * Exports data to CSV format using PapaParse
     */
    exportToCSV(): void {
        const csvData = this.prepareData();
        const csv = Papa.unparse(csvData);
        const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
        this.downloadFile(blob, `${this.fileName}.csv`);
    }

    /**
     * Exports data to Excel format using XLSX
     */
    exportToExcel(): void {
        const rowDataArray = this.prepareData();
        const worksheet = XLSX.utils.json_to_sheet(rowDataArray);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');
        XLSX.writeFile(workbook, `${this.fileName}.xlsx`);
    }

    /**
     * Exports data to XML format using fast-xml-parser
     */
    exportToXML(): void {
        const builder = new XMLBuilder({
            ignoreAttributes: false,
            format: true,
            indentBy: '  '
        });

        const xmlData = {
            export: {
                title: this.fileName,
                rows: { row: this.prepareData() }
            }
        };

        const xml = builder.build(xmlData);
        const blob = new Blob([xml], { type: 'application/xml;charset=utf-8;' });
        this.downloadFile(blob, `${this.fileName}.xml`);
    }

    /**
     * Prepares data for export by mapping rows and columns
     */
    private prepareData(): Record<string, unknown>[] {
        return this.datagrid.initial.data.map(row => {
            const rowData: Record<string, unknown> = {};
            this.datagrid.columnManager.getLeafColumns().forEach((column: AnyColumn<T>) => {
                rowData[column.columnId as string] = row[column.columnId as keyof T];
            });
            return rowData;
        });
    }

    /**
     * Helper method to handle file downloads
     */
    private downloadFile(blob: Blob, filename: string): void {
        const link = document.createElement('a');
        if (link.download !== undefined) {
            const url = URL.createObjectURL(blob);
            link.setAttribute('href', url);
            link.setAttribute('download', filename);
            link.style.visibility = 'hidden';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        } else {
            console.error('Download not supported in this browser.');
        }
    }
}