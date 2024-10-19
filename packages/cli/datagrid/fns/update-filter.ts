import type { ColumnId, FilterType, FilterValue } from "../types";
import type { TzezarDatagrid } from "../tzezar-datagrid.svelte";

/**
 * Updates the filter for a specified column in the datagrid.
 * 
 * @param {ColumnId} columnId - The ID of the column to update the filter for.
 * @param {FilterValue} value - The new filter value.
 * @param {FilterType} type - The type of the filter being applied.
 * @param {TzezarDatagrid<unknown>} datagrid - The datagrid instance containing the current state.
 */
export const updateFilter = (
    columnId: ColumnId,
    value: FilterValue,
    type: FilterType,
    datagrid: TzezarDatagrid<unknown>
) => {
    // Create a copy of the current filters
    const tempFilters = [...datagrid.state.filters];
    
    // Find the index of the existing filter for the specified column
    const filterIndex = tempFilters.findIndex(f => f.columnId === columnId);

    if (filterIndex !== -1) {
        // Update existing filter
        tempFilters[filterIndex] = { columnId: columnId, value, type };
    } else {
        // Add new filter
        tempFilters.push({ columnId: columnId, value, type });
    }

    // Remove filters that have no value or are considered empty
    const filteredFilters = tempFilters.filter(f => {
        // Exclude filters with empty values
        if (f.value === "") return false;

        // Exclude filters with specific empty array values
        if (Array.isArray(f.value) && f.value.length === 2) {
            return !(f.value[0] === -99999999999 && f.value[1] === 9999999999);
        }

        // Include all other filters
        return true;
    });

    datagrid.updateFilters(filteredFilters);
};
