---
title: Column ordering example
---

<script>
import ColumnOrderingDatagrid from './column-ordering-datagrid.svelte';
import { inventoryData as data } from '$lib/data/data-storage.svelte';
</script>

# {title}

<ColumnOrderingDatagrid {data} />
