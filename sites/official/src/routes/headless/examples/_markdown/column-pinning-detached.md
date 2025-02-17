---
title: Column pinning detached example
---

<script>
import ColumnPinningDetachedDatagrid from '../_datagrids/column-pinning-detached/column-pinning-detached-datagrid.svelte';
import { inventoryData as data } from '$lib/data/data-storage.svelte';
</script>

# {title}

<ColumnPinningDetachedDatagrid {data} />

