import { isGroupColumn } from "../helpers/column-guards";
import type { DatagridCore } from "../index.svelte";
import type { AccessorColumn, ComputedColumn } from "../types";
import type { SortingDirection } from "../types";
import { findColumnById, flattenColumnStructureAndClearGroups } from "../utils.svelte";

/**
 * Applies sorting to the given data based on the sort configurations in the datagrid.
 * The function supports manual sorting and sorting defined in the datagrid's sorting feature.
 * It also uses a Schwartzian transform to precompute the sort values for improved performance.
 *
 * @template TOriginalRow - The type of the rows in the data array.
 *
 * @param {DatagridCore<TOriginalRow>} datagrid - The datagrid instance containing the sorting configuration and lifecycle hooks.
 * @param {TOriginalRow[]} data - The data array to be sorted.
 * 
 * @returns {TOriginalRow[]} - The sorted data array.
 *
 * @remarks
 * - If manual sorting is enabled or no sorting configurations are defined, the data is returned without any changes.
 * - The sorting respects the direction specified in the `sortConfigs` and handles cases for null or undefined values.
 * - The Schwartzian Transform is used for precomputing the values to be sorted, which improves performance when sorting large datasets.
 */
export function applySorting<TOriginalRow>(datagrid: DatagridCore<TOriginalRow>, data: TOriginalRow[]): TOriginalRow[] {
    data = datagrid.lifecycleHooks.executePreSort(data);

    const isManualSortingEnabled = datagrid.features.globalSearch.isManual || datagrid.features.sorting.isManual;
    const noSorting = datagrid.features.sorting.sortConfigs.length === 0;
    if (isManualSortingEnabled || noSorting) return data;

    const sortConfigs = datagrid.features.sorting.sortConfigs
        .map(config => {
            const column = findColumnById(
                flattenColumnStructureAndClearGroups(datagrid._columns),
                config.columnId
            ) as AccessorColumn<TOriginalRow> | ComputedColumn<TOriginalRow>;

            if (!column || isGroupColumn(column) || !column.isSortable()) {
                return null;
            }

            return {
                getValue: (row: TOriginalRow) => column.getValueFn(row),
                direction: config.direction
            };
        })
        .filter(cfg => cfg !== null && cfg.direction !== "intermediate") as {
            getValue: (row: TOriginalRow) => any;
            direction: SortingDirection
        }[];

    // Schwartzian Transform: Precompute sort values
    const decorated = data.map(row => ({
        row,
        values: sortConfigs.map(({ getValue }) => getValue(row))
    }));

    datagrid.processors.data.metrics.measure("Sorting", () => {
        decorated.sort((a, b) => {
            for (let i = 0; i < sortConfigs.length; i++) {
                const config = sortConfigs[i];
                // Check if config exists before using it
                if (!config) continue;
                
                const valA = a.values[i];
                const valB = b.values[i];
                
                if (valA === valB) continue;
                if (valA == null) return config.direction === "descending" ? 1 : -1;
                if (valB == null) return config.direction === "descending" ? -1 : 1;
                
                return config.direction === "descending" ? (valB > valA ? 1 : -1) : (valA > valB ? 1 : -1);
            }
            return 0;
        });
    });

    // Extract sorted data
    return datagrid.lifecycleHooks.executePostSort(decorated.map(d => d.row));
}
