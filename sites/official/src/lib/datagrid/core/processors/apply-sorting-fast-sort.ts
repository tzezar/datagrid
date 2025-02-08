import { inPlaceSort } from "fast-sort";
import { isGroupColumn } from "../helpers/column-guards";
import type { DatagridCore } from "../index.svelte";
import type { AccessorColumn, ComputedColumn } from "../types";
import { findColumnById, flattenColumnStructureAndClearGroups } from "../utils.svelte";

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
                desc: config.desc
            };
        })
        .filter(Boolean) as { getValue: (row: TOriginalRow) => any; desc: boolean }[];

    // Decorate each row with its precomputed sort keys.
    const decorated = data.map(row => ({
        row,
        keys: sortConfigs.map(cfg => cfg.getValue(row))
    }));

    // Create fast‑sort instructions that operate on the decorated keys.
    // (Precompute the instruction array once, using the key index.)
    const instructions = sortConfigs.map((cfg, i) =>
        cfg.desc
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
