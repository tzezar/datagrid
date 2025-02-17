---
title: Column pinning example
---

<script>
import ColumnPinningDatagrid from '../_datagrids/column-pinning/column-pinning-datagrid.svelte';

import { inventoryData as data } from '$lib/data/data-storage.svelte';
</script>

# {title}

<ColumnPinningDatagrid {data} />


