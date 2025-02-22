---
title: Pagination
---

<script>
import PaginationDatagrid from './pagination-datagrid.svelte';


import { inventoryData as data } from '$lib/data/data-storage.svelte';
</script>

# {title}

<PaginationDatagrid {data} />



