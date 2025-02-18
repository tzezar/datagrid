---
title: Pagination
---

<script>
import PaginationDatagrid from '../_datagrids/pagination/pagination-datagrid.svelte';


import { inventoryData as data } from '$lib/data/data-storage.svelte';
</script>

# {title}

<PaginationDatagrid {data} />



