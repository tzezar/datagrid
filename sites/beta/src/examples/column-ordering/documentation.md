---
title: Column ordering
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

`moveable` specifies whether a column can be reordered.

```ts
{
	moveable: true | false
}
```

## Code

### Column definitions

```ts
import type { BaseColumn } from "$lib/datagrid/types";
import type { InventoryDataRow } from "$lib/data/inventory";

export const columns = [
    {
        id: 'product.name',
        title: 'Name',
        grow: true,
    },
    {
        id: 'quantity',
        title: 'On stock',
        align: 'end',
        grow: true,
    },
    {
        id: 'price',
        title: 'Price',
        moveable: false,
        align: 'end',
        grow: true,
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
	import { topBarOptions } from './top-bar-options';

	let datagrid = setContext(
		`datagrid`,
		new TzezarDatagrid({
			data,
			columns,
			options: {
				pagination: { display: false },
				topbar: topBarOptions
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

export const topBarOptions = {
    display: true,
    displayCopyDataMenu: false,
    displayExportDataMenu: false,
    displayFullscreenToggle: false,
    displayHeadFilterToggle: false,
    settingsMenu: {
        display: true,
        displayFreezingMenu: false,
        displayReorderingMenu: true,
        displayResizingMenu: false,
        displaySortingMenu: false,
        displayVisibilityMenu: false,
        adjustmentMenu: {
            display: false
        }
    }
} satisfies TopBarOptions
```
