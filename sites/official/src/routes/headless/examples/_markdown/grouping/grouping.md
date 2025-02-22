---
title: Grouping example
---

<script>
import GroupingDatagrid from './grouping-datagrid.svelte';


import { inventoryData as data } from '$lib/data/data-storage.svelte';
</script>

# {title}

<GroupingDatagrid {data} />



