---
title: Basic example
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
	import { TzezarDatagrid } from '$lib/datagrid/tzezar-datagrid.svelte';
	import { inventoryData as data } from '$lib/data/inventory';
	import * as Datagrid from '$lib/datagrid';
	import { columns } from './columns.svelte';

	let datagrid = setContext(
		"datagrid",
		new TzezarDatagrid({
			data: data.splice(0, 100),
			columns,
			options: {
				defaultColumnWidth: '200px',
			}
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
		{#each datagrid.state.processedData as row, rowIndex}
			<Datagrid.Row {rowIndex}>
				{#each datagrid.columns as column, columnIndex}
					<Datagrid.Cell {columnIndex} {rowIndex} {column} {row} />
				{/each}
			</Datagrid.Row>
		{/each}
	{/snippet}
</Datagrid.Datagrid>
```