import type { AccessorColumn, ColumnDef, ComputedColumn } from "../types";
import type { DatagridCore } from "../index.svelte";
import type { ColumnId } from "../types";

/**
 * Represents the state for the Column Faceting feature, which holds numeric and categorical facets 
 * for each column in the datagrid.
 */
export type ColumnFacetingFeatureState = {
    /** Stores the numeric facets (min and max values) for each column */
    _numericFacets: Record<ColumnId, { min: number; max: number }>;

    /** Stores the categorical facets (unique values and their count) for each column */
    _categoricalFacets: Record<ColumnId, { uniqueValuesCount: number; uniqueValues: unknown[] }>;

    /** Flag indicating whether to recalculate facets after filtering */
    recalculateFacetsAfterFiltering: boolean;
};

/** Configuration for the Column Faceting feature, extending the state with optional properties. */
export type ColumnFacetingFeatureConfig = Partial<ColumnFacetingFeatureState>;

/** Interface for the Column Faceting feature state. */
export type IColumnFacetingFeature = ColumnFacetingFeatureState;

/**
 * Class that implements the column faceting feature, responsible for calculating and managing
 * numeric and categorical facets for each column in the datagrid.
 */
export class ColumnFacetingFeature<TOriginalRow = any> implements IColumnFacetingFeature {
    // Reference to the parent DataGrid
    private datagrid: DatagridCore<TOriginalRow>;

    /** Stores numeric facets (min and max values) for each column */
    _numericFacets: Record<ColumnId, { min: number; max: number }> = $state({});

    /** Stores categorical facets (unique values and their count) for each column */
    _categoricalFacets: Record<ColumnId, { uniqueValuesCount: number; uniqueValues: unknown[] }> = $state({});

    /** Flag indicating whether facets should be recalculated after filtering */
    recalculateFacetsAfterFiltering = $state(true);

    /** Indicates whether the facets are calculated from the original or filtered data */
    facetsSource: 'originalData' | 'filteredData' = $state('filteredData');

    /**
     * Constructor for initializing the ColumnFacetingFeature with a reference to the datagrid
     * and optional configuration.
     * @param datagrid - The parent datagrid instance.
     * @param config - Optional configuration to override the default facet feature state.
     */
    constructor(datagrid: DatagridCore<TOriginalRow>, config?: ColumnFacetingFeatureConfig) {
        this.datagrid = datagrid;
        Object.assign(this, config);
    }

    // ==== Getters for facets ====

    /**
     * Retrieves the numeric facet (min and max values) for a specific column.
     * @param columnId - The ID of the column.
     * @returns The numeric facet for the column or `null` if no facet is available.
     */
    getNumericFacet(columnId: string) {
        return this._numericFacets[columnId] ?? null;
    }

    /**
     * Retrieves the categorical facet (unique values and their count) for a specific column.
     * @param columnId - The ID of the column.
     * @returns The categorical facet for the column or `null` if no facet is available.
     */
    getCategoricalFacet(columnId: string) {
        return this._categoricalFacets[columnId] ?? null;
    }

    /**
     * Retrieves all numeric facets for all columns.
     * @returns A shallow copy of the numeric facets object.
     */
    getAllNumericFacets() {
        return { ...this._numericFacets };
    }

    /**
     * Retrieves all categorical facets for all columns.
     * @returns A shallow copy of the categorical facets object.
     */
    getAllCategoricalFacets() {
        return { ...this._categoricalFacets };
    }

    // ==== Facet Calculation ====

    /**
     * Calculates numeric and categorical facets for the provided rows and columns.
     * This method iterates over the rows and columns to compute the facets and updates the
     * `_numericFacets` and `_categoricalFacets` state properties accordingly.
     * @param rows - The array of rows to calculate facets for.
     * @param columns - The array of columns for which facets need to be calculated.
     */
    calculateFacets(rows: TOriginalRow[], columns: ColumnDef<TOriginalRow>[]): void {
        // Reset existing facets before recalculating
        this._numericFacets = {};
        this._categoricalFacets = {};

        // Iterate over each column that is visible and requires facet calculation
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
