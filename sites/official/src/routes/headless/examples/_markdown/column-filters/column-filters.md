---
title: Column filters example
---

<script>
import ColumnFiltersDatagrid from './column-filters-datagrid.svelte';

import { inventoryData as data } from '$lib/data/data-storage.svelte';
</script>

# {title}

<ColumnFiltersDatagrid {data} />
