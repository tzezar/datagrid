---
title: Fullscreen mode
date: '2024-10-15'
published: true
---

<script>
  import Datagrid from './datagrid.svelte'
</script>

<Datagrid />

## Implementation

```ts
topbar: {
	display: true,
	displayFullscreenToggle: true,
}
```

## Code

### Column definitions

```ts
import type { BaseColumn } from "$lib/datagrid/types";
import type { InventoryDataRow } from "$lib/data/inventory";
export const columns = [
    {
        id: 'barcode',
        title: 'Barcode',
    },
    {
        id: 'location',
        title: 'Location',
        sortable: false,
    },
    {
        id: 'category',
        title: 'Category',
    },
    {
        id: 'quantity',
        title: 'Quantiy',
    },
    {
        id: 'weight',
        title: 'Weight',
        grow: true

    },
] satisfies BaseColumn<InventoryDataRow>[]
```

### Datagrid component

```svelte
<script lang="ts">
	import { setContext } from 'svelte';
	import { columns } from './columns.svelte';
	import { inventoryData as data } from '$lib/data/inventory';
	import { TzezarDatagrid } from '$lib/datagrid/tzezar-datagrid.svelte';
	import * as Datagrid from '$lib/datagrid';

	let datagrid = setContext(
		'datagrid',
		new TzezarDatagrid({
			data: data.slice(0, 20),
			columns,
			options: {
				pagination: { display: false },
				topbar: {
					display: true,
					displayFullscreenToggle: true,
				}
			},
		})
	);
</script>

<Datagrid.Datagrid>
	{#snippet head()}
		{#each datagrid.columns as column (column.id)}
			<Datagrid.Header {column} />
		{/each}
	{/snippet}
	{#snippet body()}
		{#each datagrid.data as row, rowIndex}
			<Datagrid.Row {rowIndex}>
				{#each datagrid.columns as column, columnIndex}
					<Datagrid.Cell {column} {row} {columnIndex} {rowIndex} />
				{/each}
			</Datagrid.Row>
		{/each}
	{/snippet}
</Datagrid.Datagrid>

```
