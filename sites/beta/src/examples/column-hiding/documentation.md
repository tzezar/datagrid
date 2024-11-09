---
title: Column hiding
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

Two properties control the visibility of columns:

`hideable` – specifies whether a column can be hidden.

`visible` – represents the current visibility state of the column.

```ts
{
    hideable: 'true' | 'false',
    visible: 'true' | 'false',
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
        visible: false,
        grow: true,
    },

    {
        id: 'location',
        title: 'Location',
        hideable: false,
        grow: true,
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
	import { topBarOptions } from './top-bar-options';

	let datagrid = setContext(
		"datagrid",
		new TzezarDatagrid({
			data: data.slice(0, 20),
			columns,
			options: {
				paginate: false,
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
### Topbar options

```ts
import type { TopBarOptions } from "$lib/datagrid/tzezar-datagrid.svelte";

export const topBarOptions = {
    display: true,
    settingsMenu: {
        display: true,
        displayFreezingMenu: false,
        displayReorderingMenu: false,
        displayResizingMenu: false,
        displaySortingMenu: false,
        displayVisibilityMenu: true,
        adjustmentMenu: {
            display: false,
            displaySpacingMenu: false,
            displayTextSizeMenu: false
        }
    }
} satisfies TopBarOptions
```
