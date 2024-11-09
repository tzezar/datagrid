import { inventoryData } from "$lib/data/inventory";
import { filterData } from "$lib/datagrid/fns/filter-data";
import { paginateData } from "$lib/datagrid/fns/paginate-data";
import { sortData } from "$lib/datagrid/fns/sort-data";
import type { Filter, Sorting } from "$lib/datagrid/types";

export const simulateServerRequest = async ({
    page,
    perPage,
    filters,
    sorting
}: {
    page: number;
    perPage: number;
    filters: Filter[];
    sorting: Sorting[];
}) => {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    const filteredData = filterData([...inventoryData], filters);
    const count = filteredData.length;
    const sortedData = sortData([...filteredData], sorting);
    const paginatedData = paginateData([...sortedData], page, perPage);
    return {
        data: paginatedData,
        count,
        perPage,
        page
    };
};