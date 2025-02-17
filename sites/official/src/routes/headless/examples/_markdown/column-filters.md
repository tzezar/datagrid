---
title: Column filters example
---

<script>
import ColumnFiltersDatagrid from '../_datagrids/column-filters/column-filters-datagrid.svelte';

import { inventoryData as data } from '$lib/data/data-storage.svelte';
</script>

# {title}

<ColumnFiltersDatagrid {data} />
