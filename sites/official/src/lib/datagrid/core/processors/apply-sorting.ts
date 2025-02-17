import { isGroupColumn } from "../helpers/column-guards";
import type { DatagridCore } from "../index.svelte";
import type { AccessorColumn, ComputedColumn } from "../types";
import type { SortingDirection } from "../types";
import { findColumnById, flattenColumnStructureAndClearGroups } from "../utils.svelte";

export function applySorting<TOriginalRow>(datagrid: DatagridCore<TOriginalRow>, data: TOriginalRow[]): TOriginalRow[] {
    data = datagrid.lifecycleHooks.executePreSort(data);

    const isManualSortingEnabled = datagrid.features.globalSearch.isManual;
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
                const valA = a.values[i];
                const valB = b.values[i];

                if (valA === valB) continue;
                if (valA == null) return sortConfigs[i].direction === "descending" ? 1 : -1;
                if (valB == null) return sortConfigs[i].direction === "descending" ? -1 : 1;

                return sortConfigs[i].direction === "descending" ? (valB > valA ? 1 : -1) : (valA > valB ? 1 : -1);
            }
            return 0;
        });
    });

    // Extract sorted data
    return datagrid.lifecycleHooks.executePostSort(decorated.map(d => d.row));
}
