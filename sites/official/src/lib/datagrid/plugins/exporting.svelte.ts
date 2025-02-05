import Papa from 'papaparse';
import * as XLSX from 'xlsx';
import { XMLBuilder } from 'fast-xml-parser';
import type { LeafColumn } from '$lib/datagrid/core/types';
import type { DatagridCore } from '$lib/datagrid/core/index.svelte';


export type ExportMethods = 'toExcel' | 'toCSV' | 'toJSON' | 'toXML';

export type ExportingPluginConfig = {
    fileName?: string;
    
    enableExporting?: boolean;
    exportMethods?: ExportMethods[];
}

export class ExportingPlugin<T = any> {
    datagrid: DatagridCore<T>;

    exportMethods: ExportMethods[] = ['toExcel', 'toCSV', 'toJSON', 'toXML'];

    enableExporting: boolean = $state(true);

    fileName: string = $state('table');

    constructor(datagrid: DatagridCore<T>, config?: ExportingPluginConfig) {
        this.datagrid = datagrid;

        this.enableExporting = config?.enableExporting ?? this.enableExporting;
        this.fileName = config?.fileName ?? this.fileName;
        this.exportMethods = config?.exportMethods ?? this.exportMethods;
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
            this.datagrid.columnManager.getLeafColumns().forEach((column: LeafColumn<T>) => {
                if (column.type === 'accessor') {
                    rowData[column.columnId as string] = column.getValueFn(row)
                } else if (column.type === 'computed') {
                    rowData[column.columnId as string] = column.getValueFn(row)
                }
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