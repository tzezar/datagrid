---
title: Column pinning example
---

<script>
import ColumnPinningDatagrid from './column-pinning-datagrid.svelte';

import { inventoryData as data } from '$lib/data/data-storage.svelte';
</script>

# {title}

<ColumnPinningDatagrid {data} />


