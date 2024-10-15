---
title: Column freezing
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


```ts
{
    pinnable?: boolean;
    pinned?: {
        position: 'left' | 'right';
		// offset is calculated automatically. Do not set it manually as it will be overwritten
        offset?: string | null;
	}
}
```
When defining columns, there are two key properties to consider:

`pinnable` – as the name suggests, this defines whether a column can be pinned by default.

`pinned` – this is an object containing two keys: `position` and `offset`.

The `position` specifies on which side of the table the column is pinned to, while the `offset` is a value calculated internally by the functions `getOffsetLeft()` and `getOffsetRight()`, and applied through the `applyOffset()` function whenever the pinned state of the column markanges.



To pin a column by default, you need to specify its `position` during the column definition.

```ts
{
    sortable: false,
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
        width: '200px',

    },
    {
        id: 'location',
        title: 'Location',
        grow: true,
        width: '200px',
        pinned: {
            position: 'left'
        },

    },
    {
        id: 'category',
        title: 'Category',
        pinnable: false,
        width: '1000px',
    },
    {
        id: 'quantity',
        title: 'Quantiy',
        width: '200px',
        pinned: {
            position: 'right'
        },
    },
    {
        id: 'weight',
        title: 'Weight',
        width: '200px',

    }
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
		"datagrid",
		new TzezarDatagrid({
			data: data.slice(0, 50),
			columns,
			options: {
				pagination: { display: false },
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
		{#each datagrid.internal.paginatedData as row, rowIndex}
			<Datagrid.Row {rowIndex}>
				{#each datagrid.columns as column, columnIndex}
					<Datagrid.Cell {column} {row} {columnIndex} {rowIndex} />
				{/each}
			</Datagrid.Row>
		{/each}
	{/snippet}
</Datagrid.Datagrid>
```
