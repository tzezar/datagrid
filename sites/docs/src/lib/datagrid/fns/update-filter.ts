import type { ColumnId, FilterType, FilterValue } from "../types";
import type { TzezarDatagrid } from "../tzezar-datagrid.svelte";
export const updateFilter = (
    columnId: ColumnId,
    value: FilterValue,
    type: FilterType,
    datagrid: TzezarDatagrid<unknown>
) => {
    const tempFilters = [...datagrid.state.filters];
    const filterIndex = tempFilters.findIndex(f => f.columnId === columnId);

    if (filterIndex !== -1) {
        // Update existing filter
        tempFilters[filterIndex] = { columnId: columnId, value, type };
    } else {
        // Add new filter
        tempFilters.push({ columnId: columnId, value, type });
    }

    // Remove filters with no value
    const filteredFilters = tempFilters.filter(f => {
        if (f.value === "") return false;
        if (Array.isArray(f.value) && f.value.length === 2) return !(f.value[0] === -99999999999 && f.value[1] === 9999999999);
        return true;
    });
    datagrid.updateFilters(filteredFilters)
};