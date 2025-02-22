---
title: Column filters faceted example
---

<script>
import ColumnFiltersFacetedDatagrid from './column-filters-faceted-datagrid.svelte';
import { inventoryData as data } from '$lib/data/data-storage.svelte';
</script>

# {title}

<ColumnFiltersFacetedDatagrid {data} />
