---
title: Sorting
description: First post.
date: '2024-10-15'
published: true
---

<script>
  import Datagrid from './datagrid.svelte'
</script>

Sorting columns is an important feature when working with data. The Datagrid supports sorting by multiple columns.
<Datagrid />



## Implementation
Sorting can be enabled/disabled globally via datagrid options

```ts
options: {
	sortable: false;
}
```

and sorting for particullar column can be overwritten with setting in column definition

```ts
{
    sortable: false,
}
```

## Code

### Column definitions

```ts
import type { BaseColumn } from '$lib/datagrid/types';
import type { InventoryDataRow } from '$lib/data/inventory';
export const columns = [
	{
		id: 'barcode',
		title: 'Barcode'
	},
	{
		id: 'location',
		title: 'Location',
		sortable: false
	},
	{
		id: 'category',
		title: 'Category'
	},
	{
		id: 'quantity',
		title: 'Quantiy'
	},
	{
		id: 'weight',
		title: 'Weight',
		grow: true
	}
] satisfies BaseColumn<InventoryDataRow>[];
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
			data: data.slice(0, 40),
			columns
		})
	);
</script>

<Datagrid.Datagrid>
	{#snippet head()}
		{#each datagrid.columns as column, i (column.id)}
			<Datagrid.Header {column} />
		{/each}
	{/snippet}
	{#snippet body()}
		{#each datagrid.state.processedData as row, rowIndex}
			<Datagrid.Row {rowIndex}>
				{#each datagrid.columns as column, columnIndex}
					{@const props = { row, rowIndex, column, columnIndex }}
					<Datagrid.Cell {...props} />
				{/each}
			</Datagrid.Row>
		{/each}
	{/snippet}
</Datagrid.Datagrid>

<pre>{JSON.stringify(datagrid.state.sortingArray, null, 2)}</pre>
```
