import type { AccessorColumn, AnyColumn, ComputedColumn } from "../types";
import type { DataGrid } from "../index.svelte";
import type { ColumnId } from "../types";

/**
 * Handles facet calculations for numeric and categorical data in a data grid.
 * Provides utilities for retrieving and calculating facets for columns.
 */
export class ColumnFacetingFeature<TOriginalRow> {
    // Reference to the parent DataGrid
    private datagrid: DataGrid<TOriginalRow>;

    // Stores numeric facets (min and max values) for each column
    private numericFacets: Record<ColumnId, { min: number; max: number }> = $state({});

    // Stores categorical facets (unique values and their count) for each column
    private categoricalFacets: Record<ColumnId, { uniqueValuesCount: number; uniqueValues: unknown[] }> = $state({});

    /**
     * Initializes the faceting feature for the given data grid.
     * @param datagrid - The DataGrid instance this feature is associated with.
     */
    constructor(datagrid: DataGrid<TOriginalRow>) {
        this.datagrid = datagrid;
    }

    // ==== Getters for facets ====

    /**
     * Retrieves numeric facet information for a specific column.
     * @param columnId - The ID of the column.
     * @returns The numeric facet (min and max) or `null` if not available.
     */
    getNumericFacet(columnId: string) {
        return this.numericFacets[columnId] ?? null;
    }

    /**
     * Retrieves categorical facet information for a specific column.
     * @param columnId - The ID of the column.
     * @returns The categorical facet (unique values and count) or `null` if not available.
     */
    getCategoricalFacet(columnId: string) {
        return this.categoricalFacets[columnId] ?? null;
    }

    /**
     * Retrieves all numeric facets.
     * @returns A shallow copy of the numeric facets object.
     */
    getAllNumericFacets() {
        return { ...this.numericFacets };
    }

    /**
     * Retrieves all categorical facets.
     * @returns A shallow copy of the categorical facets object.
     */
    getAllCategoricalFacets() {
        return { ...this.categoricalFacets };
    }

    // ==== Facet Calculation ====

    /**
     * Calculates numeric and categorical facets for the provided rows and columns.
     * @param rows - Array of original row data.
     * @param columns - Array of columns to calculate facets for.
     */
    calculateFacets(rows: TOriginalRow[], columns: AnyColumn<TOriginalRow>[]): void {
        // Reset existing facets before recalculating
        this.numericFacets = {};
        this.categoricalFacets = {};

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
                        this.numericFacets[columnId] = {
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
                    this.categoricalFacets[columnId] = {
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
