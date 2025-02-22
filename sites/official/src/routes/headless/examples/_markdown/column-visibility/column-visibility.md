---
title: Column visibility example
---

<script>
import ColumnVisibilityDatagrid from './column-visibility-datagrid.svelte';
import { inventoryData as data } from '$lib/data/data-storage.svelte';
</script>

# {title}

<ColumnVisibilityDatagrid {data} />



