import type { AccessorColumn, AnyColumn, ComputedColumn } from "../helpers/column-creators";
import type { Datagrid } from "../index.svelte";
import { getCellValue } from "../utils.svelte";

export class ColumnFaceting<TOriginalRow> {
    datagrid: Datagrid<TOriginalRow>;
    numericFacets: Record<string, { min: number, max: number }> = $state({});
    categoricalFacets: Record<string, { 
        uniqueValuesCount: number, 
        uniqueValues: any[] 
    }> = $state({});

    constructor(datagrid: Datagrid<TOriginalRow>) {
        this.datagrid = datagrid
    }

    calculateFacets(rows: TOriginalRow[], columns: AnyColumn<TOriginalRow>[]) { 
        let timeStart = performance.now();
        // Reset existing facets
        this.numericFacets = {};
        this.categoricalFacets = {};

        for (let column of columns) {
            if (['accessor', 'computed'].includes(column.type) === false) continue;
            column = column as AccessorColumn<TOriginalRow> | ComputedColumn<TOriginalRow>;
            // if (!column.options.faceting) continue;

            const columnId = column.columnId;
            const values = rows.map(row => column.getValueFn(row));

            if (column._meta.filterType === 'number' || column._meta.filterType === 'range') {
                const numericValues = values.filter(val => typeof val === 'number');
                
                if (numericValues.length > 0) {
                    this.numericFacets[columnId] = {
                        min: Math.min(...numericValues),
                        max: Math.max(...numericValues)
                    };
                }
            }

            if (column._meta.filterType === 'select' || column._meta.filterType === 'text') {
                const uniqueValues = Array.from(new Set(values));
                
                this.categoricalFacets[columnId] = {
                    uniqueValuesCount: uniqueValues.length,
                    uniqueValues: uniqueValues
                };
            }
        }
        console.log(`Faceting took ${performance.now() - timeStart}ms`)
    }

    // Getters for facets
    getNumericFacet(columnId: string) {
        return this.numericFacets[columnId];
    }

    getCategoricalFacet(columnId: string) {
        return this.categoricalFacets[columnId];
    }

    // Optional: Get all numeric or categorical facets
    getAllNumericFacets() {
        return this.numericFacets;
    }

    getAllCategoricalFacets() {
        return this.categoricalFacets;
    }
}