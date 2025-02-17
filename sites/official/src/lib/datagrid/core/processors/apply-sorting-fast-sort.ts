import { inPlaceSort } from "fast-sort";
import { isGroupColumn } from "../helpers/column-guards";
import type { DatagridCore } from "../index.svelte";
import type { AccessorColumn, ComputedColumn, SortingDirection } from "../types";
import { findColumnById, flattenColumnStructureAndClearGroups } from "../utils.svelte";


/**
 * Applies sorting to the given data based on the sort configurations in the datagrid using the fast-sort library.
 * It supports both manual sorting and sorting as defined by the datagrid's sorting feature.
 * This implementation also optimizes sorting performance by using precomputed sort keys and a Schwartzian transform.
 *
 * @template TOriginalRow - The type of the rows in the data array.
 *
 * @param {DatagridCore<TOriginalRow>} datagrid - The datagrid instance containing the sorting configuration, lifecycle hooks, and feature flags.
 * @param {TOriginalRow[]} data - The data array to be sorted.
 * 
 * @returns {TOriginalRow[]} - The sorted data array.
 *
 * @remarks
 * - If manual sorting is enabled or if there are no sorting configurations, the data is returned without any changes.
 * - Sorting is applied based on the direction specified in the `sortConfigs`, handling ascending or descending order.
 * - The Schwartzian Transform is used to precompute the sort keys, which improves performance when sorting large datasets.
 * - The sorting operation uses the fast-sort library's in-place sort mechanism, which efficiently sorts the data by comparing precomputed keys.
 */
export function applySorting<TOriginalRow>(datagrid: DatagridCore<TOriginalRow>, data: TOriginalRow[]): TOriginalRow[] {
    data = datagrid.lifecycleHooks.executePreSort(data);

    const isManualSortingEnabled = datagrid.features.globalSearch.isManual;
    const noSorting = datagrid.features.sorting.sortConfigs.length === 0;
    if (isManualSortingEnabled || noSorting) return data;

    // Build sortConfigs and precompute keys.
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
        .filter(Boolean) as { getValue: (row: TOriginalRow) => any; direction: SortingDirection }[];

    // Decorate each row with its precomputed sort keys.
    const decorated = data.map(row => ({
        row,
        keys: sortConfigs.map(cfg => cfg.getValue(row))
    }));

    // Create fast-sort instructions that operate on the decorated keys.
    // (Precompute the instruction array once, using the key index.)
    const instructions = sortConfigs
        .filter(cfg => cfg.direction !== "intermediate") // Ignore intermediate state for sorting
        .map((cfg, i) =>
            cfg.direction === "descending"
                ? { desc: (d: { keys: any[] }) => d.keys[i] }
                : { asc: (d: { keys: any[] }) => d.keys[i] }
        );

    datagrid.processors.data.metrics.measure("Sorting", () => {
        // Use fast-sort to sort the decorated array.
        // fast-sort’s inPlaceSort now only compares precomputed keys.
        inPlaceSort(decorated).by(instructions as any);
    });

    // Undecorate.
    const sortedData = decorated.map(d => d.row);
    return datagrid.lifecycleHooks.executePostSort(sortedData);
}
