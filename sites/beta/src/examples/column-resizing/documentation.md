---
title: Column resizing
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

> The most common use case and what you probably want to do is to set `grow` to `true` on first or last column.

_Combination of width, grow and resizable can result in interesting behaviour._

```ts
{
	resizable: true | false;
}
```

`resizable` specifies whether a column can be resized.

## Code

### Column definitions

```ts
import type { BaseColumn } from "$lib/datagrid/types";
import type { InventoryDataRow } from "$lib/data/inventory";

export const columns = [
    {
        id: 'product.name',
        title: 'Name',
        width: '300px',
        
    },
    {
        id: 'quantity',
        title: 'On stock',
        align: 'end',
    },
    {
        id: 'price',
        title: 'Price',
        align: 'end',
        grow: true,
        resizable: false
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
	import { topbar } from './top-bar-options';

	let datagrid = setContext(
		"datagrid",
		new TzezarDatagrid({
			data: data.slice(0, 20),
			columns,
			options: {
				pagination: { display: false },
				topbar
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
		{#each datagrid.data as row, rowIndex}
			<Datagrid.Row {rowIndex}>
				{#each datagrid.columns as column, columnIndex}
					{@const props = { row, rowIndex, column, columnIndex }}
					{#if column.id === 'product.name'}
						<Datagrid.Cell
							{...props}
							class={{ data: 'overflow-hidden text-ellipsis text-nowrap' }}
						/>
					{:else}
						<Datagrid.Cell {...props} />
					{/if}
				{/each}
			</Datagrid.Row>
		{/each}
	{/snippet}
</Datagrid.Datagrid>
```

### Topbar options

```ts
import type { TopBarOptions } from "$lib/datagrid/tzezar-datagrid.svelte";

export const topbar = {
    display: true,
    settingsMenu: {
        display: true,
        displayFreezingMenu: false,
        displayReorderingMenu: false,
        displayResizingMenu: true,
        displaySortingMenu: false,
        displayVisibilityMenu: false,
        adjustmentMenu: {
            display: false
        }
    }
} satisfies TopBarOptions
```
