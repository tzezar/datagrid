import type { AccessorColumn, AnyColumn, ComputedColumn } from "../column-creation/types";
import type { DataGrid } from "../index.svelte";
import type { ColumnId } from "../types";

export class ColumnFacetingFeature<TOriginalRow> {
    private datagrid: DataGrid<TOriginalRow>;
    private numericFacets: Record<ColumnId<any>, { min: number; max: number }> = {};
    private categoricalFacets: Record<ColumnId<any>, { uniqueValuesCount: number; uniqueValues: unknown[] }> = {};

    constructor(datagrid: DataGrid<TOriginalRow>) {
        this.datagrid = datagrid;
    }

    // Getters for numeric and categorical facets
    getNumericFacet(columnId: string) {
        return this.numericFacets[columnId] ?? null;
    }

    getCategoricalFacet(columnId: string) {
        return this.categoricalFacets[columnId] ?? null;
    }

    // Get all numeric or categorical facets
    getAllNumericFacets() {
        return { ...this.numericFacets };
    }

    getAllCategoricalFacets() {
        return { ...this.categoricalFacets };
    }

    /**
     * Calculates facets for the provided rows and columns.
     * @param rows - Array of original row data.
     * @param columns - Array of columns to calculate facets for.
     */
    calculateFacets(rows: TOriginalRow[], columns: AnyColumn<TOriginalRow>[]): void {
        // Reset existing facets
        this.numericFacets = {};
        this.categoricalFacets = {};

        for (const column of columns) {
            // Skip columns that aren't accessor or computed
            if (!['accessor', 'computed'].includes(column.type)) continue;

            const columnId = column.columnId;
            const valueGetter = (column as AccessorColumn<TOriginalRow> | ComputedColumn<TOriginalRow>).getValueFn;

            const values = rows.map(row => valueGetter(row));

            switch (column._meta.filterType) {
                case 'number':
                case 'range': {
                    const numericValues = values.filter((val): val is number => typeof val === 'number');
                    if (numericValues.length > 0) {
                        this.numericFacets[columnId] = {
                            min: Math.min(...numericValues),
                            max: Math.max(...numericValues),
                        };
                    }
                    break;
                }
                case 'select':
                case 'text': {
                    const uniqueValues = Array.from(new Set(values));
                    this.categoricalFacets[columnId] = {
                        uniqueValuesCount: uniqueValues.length,
                        uniqueValues,
                    };
                    break;
                }
                default:
                    // No facet calculation for unsupported filter types
                    break;
            }
        }
    }
}
