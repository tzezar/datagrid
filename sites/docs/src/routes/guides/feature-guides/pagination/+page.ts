import { inventoryData } from "$lib/data/inventory"
import { paginateData } from "$lib/datagrid/fns/paginate-data"

export async function load() {
    const page = 1
    const perPage = 10
    const data = paginateData(inventoryData, page, perPage)
    const count = inventoryData.length
    return {
        data,
        count,
        page,
        perPage
    }
}