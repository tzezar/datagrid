---
title: Minimal example
date: '2024-10-17'
published: true
---

<script>
  import Datagrid from './datagrid.svelte'
</script>

<Datagrid />

## Implementation

### Columns
```ts
import type { BaseColumn } from "$lib/datagrid/types";
import type { InventoryDataRow } from "$lib/data/inventory";

export const columns = [
    {
        id: 'product.name',
        title: 'Product name',
        grow: true,
    },
    {
        id: 'price',
        title: 'Price',
    },
] satisfies BaseColumn<InventoryDataRow>[]
```

### Datagrid

```svelte
<script lang="ts">
	import { setContext } from 'svelte';
	import { columns } from './columns.svelte';
	import { inventoryData as data } from '$lib/data/inventory';

	import { TzezarDatagrid } from '$lib/datagrid/tzezar-datagrid.svelte';
	import { Datagrid } from '$lib/datagrid';

	setContext(
		'datagrid',
		new TzezarDatagrid({
			data,
			columns
		})
	);
</script>

<Datagrid />
```