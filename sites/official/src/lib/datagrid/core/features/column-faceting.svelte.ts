import type { AccessorColumn, ColumnDef, ComputedColumn } from "../types";
import type { DatagridCore } from "../index.svelte";
import type { ColumnId } from "../types";

export type ColumnFacetingFeatureState = {
    _numericFacets: Record<ColumnId, { min: number; max: number }>;
    _categoricalFacets: Record<ColumnId, { uniqueValuesCount: number; uniqueValues: unknown[] }>;
    recalculateFacetsAfterFiltering: boolean
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

    recalculateFacetsAfterFiltering = $state(true)
    facetsSource: 'originalData' | 'filteredData' = $state('filteredData')

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
    calculateFacets(rows: TOriginalRow[], columns: ColumnDef<TOriginalRow>[]): void {
        // Reset existing facets before recalculating
        this._numericFacets = {};
        this._categoricalFacets = {};


        // Iterate over each column
        for (const column of columns.filter(col => col.state.visible === true && col.type !== 'group' && col.options.calculateFacets === true)) {
            // Skip columns that are not accessor or computed columns
            if (!['accessor', 'computed'].includes(column.type)) continue;

            const columnId = column.columnId;
            const valueGetter = (column as AccessorColumn<TOriginalRow> | ComputedColumn<TOriginalRow>).getValueFn;

            // Initialize variables for facet calculation
            let numericMin: number | null = null;
            let numericMax: number | null = null;
            const valueCountMap: Record<string, number> = {};

            // Iterate over rows directly to process values without creating an array
            for (const row of rows) {
                const value = valueGetter(row);

                // Handle numeric values
                if (typeof value === 'number') {
                    if (numericMin === null || value < numericMin) numericMin = value;
                    if (numericMax === null || value > numericMax) numericMax = value;
                }

                // Handle categorical values (e.g., text or select)
                else {
                    const valueStr = String(value); // Ensure string comparison
                    valueCountMap[valueStr] = (valueCountMap[valueStr] || 0) + 1;
                }
            }

            // Save numeric facets if applicable
            if (numericMin !== null && numericMax !== null) {
                this._numericFacets[columnId] = {
                    min: numericMin,
                    max: numericMax,
                };
            }

            // Save categorical facets if applicable
            if (Object.keys(valueCountMap).length > 0) {
                const uniqueValues = Object.keys(valueCountMap);
                this._categoricalFacets[columnId] = {
                    uniqueValuesCount: uniqueValues.length,
                    uniqueValues,
                };
            }
        }

    }

}
