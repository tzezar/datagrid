---
title: Column pinning detached example
---

<script>
import ColumnPinningDetachedDatagrid from './column-pinning-detached-datagrid.svelte';
import { inventoryData as data } from '$lib/data/data-storage.svelte';
</script>

# {title}

<ColumnPinningDetachedDatagrid {data} />

