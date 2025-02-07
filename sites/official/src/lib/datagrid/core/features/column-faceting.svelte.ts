import type { AccessorColumn, AnyColumn, ComputedColumn } from "../types";
import type { DatagridCore } from "../index.svelte";
import type { ColumnId } from "../types";

export type ColumnFacetingFeatureState = {
    _numericFacets: Record<ColumnId, { min: number; max: number }>;
    _categoricalFacets: Record<ColumnId, { uniqueValuesCount: number; uniqueValues: unknown[] }>;
}
export type ColumnFacetingFeatureConfig = Partial<ColumnFacetingFeatureState>;
export type IColumnFacetingFeature = ColumnFacetingFeatureState

export class ColumnFacetingFeature<TOriginalRow = any> implements IColumnFacetingFeature {
    // Reference to the parent DataGrid
    private datagrid: DatagridCore<TOriginalRow>;

    // Stores numeric facets (min and max values) for each column
    _numericFacets: Record<ColumnId, { min: number; max: number }> = $state({});

    // Stores categorical facets (unique values and their count) for each column
    _categoricalFacets: Record<ColumnId, { uniqueValuesCount: number; uniqueValues: unknown[] }> = $state({});

    constructor(datagrid: DatagridCore<TOriginalRow>, config?: ColumnFacetingFeatureConfig) {
        this.datagrid = datagrid;
        Object.assign(this, config);
    }

    // ==== Getters for facets ====

    /**
     * Retrieves numeric facet information for a specific column.
     * @param columnId - The ID of the column.
     * @returns The numeric facet (min and max) or `null` if not available.
     */
    getNumericFacet(columnId: string) {
        return this._numericFacets[columnId] ?? null;
    }

    /**
     * Retrieves categorical facet information for a specific column.
     * @param columnId - The ID of the column.
     * @returns The categorical facet (unique values and count) or `null` if not available.
     */
    getCategoricalFacet(columnId: string) {
        return this._categoricalFacets[columnId] ?? null;
    }

    /**
     * Retrieves all numeric facets.
     * @returns A shallow copy of the numeric facets object.
     */
    getAllNumericFacets() {
        return { ...this._numericFacets };
    }

    /**
     * Retrieves all categorical facets.
     * @returns A shallow copy of the categorical facets object.
     */
    getAllCategoricalFacets() {
        return { ...this._categoricalFacets };
    }

    // ==== Facet Calculation ====

    /**
     * Calculates numeric and categorical facets for the provided rows and columns.
     * @param rows - Array of original row data.
     * @param columns - Array of columns to calculate facets for.
     */
    calculateFacets(rows: TOriginalRow[], columns: AnyColumn<TOriginalRow>[]): void {
        // Reset existing facets before recalculating
        this._numericFacets = {};
        this._categoricalFacets = {};

        for (const column of columns) {
            // Skip columns that are not accessor or computed columns
            if (!['accessor', 'computed'].includes(column.type)) continue;

            const columnId = column.columnId;
            const valueGetter = (column as AccessorColumn<TOriginalRow> | ComputedColumn<TOriginalRow>).getValueFn;

            // Retrieve all values for the column
            const values = rows.map(row => valueGetter(row));

            switch (column._meta.filterType) {
                case 'number':
                case 'range': {
                    // Calculate numeric facets (min and max)
                    const numericValues = values.filter((val): val is number => typeof val === 'number');
                    if (numericValues.length > 0) {
                        this._numericFacets[columnId] = {
                            min: Math.min(...numericValues),
                            max: Math.max(...numericValues),
                        };
                    }
                    break;
                }
                case 'select':
                case 'text': {
                    // Calculate categorical facets (unique values and their count)
                    const uniqueValues = Array.from(new Set(values));
                    this._categoricalFacets[columnId] = {
                        uniqueValuesCount: uniqueValues.length,
                        uniqueValues,
                    };
                    break;
                }
                default:
                    // Unsupported filter types are ignored
                    break;
            }
        }
    }
}
