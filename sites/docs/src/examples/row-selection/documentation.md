---
title: Row selection
date: '2024-10-15'
published: true
---

<script>
  import Datagrid from './datagrid.svelte'
</script>

> To provide more flexibility, I decided against a simple "allow row selection" option. Instead, you can fully customize the row selection behavior with just a few extra lines of code. To make this easier for you, I have prepared some ready-made components.

<Datagrid />

_You may have noticed that the selected rows are defined in two places.
The first variable, `state.selectedRows`, stores detailed information about the selected rows,
while `internal.selectedRowIds` is an optimization.
It uses a SvelteSet internally to store row IDs, ensuring excellent performance even with large datasets._

## Implementation

### Create custom column

```ts
{
	id: 'checkbox',
	title: 'Row selection',
	width: '50px',
	pinned: {
		position: 'left'
	},
	visible: true,
	resizable: false,
	sortable: false,
	exportable: false,
	selectable: false,
	moveable: false
}
```

### Render custom header

Next, we’ll render the header. This is straightforward using Svelte's templating syntax.
Here, I’m using a pre-built component.

```svelte
{#if column.id === 'checkbox'}
	<Datagrid.HeaderWithoutSpacing {column} title={column.title}>
		<Datagrid.HeaderRowSelectionDropdown />
	</Datagrid.HeaderWithoutSpacing>
{/if}
```

### Render custom cell

We also need to display a checkbox for selecting rows.

```svelte
{#if column.id === 'checkbox'}
	<Datagrid.CellWithoutSpacing {...props}>
		<Datagrid.CellRowSelectionCheckbox {row} />
	</Datagrid.CellWithoutSpacing>
{/if}
```

## Code

### Column definitions

```ts
import type { BaseColumn } from '$lib/datagrid/types';
import type { InventoryDataRow } from '$lib/data/inventory';

export const columns = [
	{
		id: 'checkbox',
		title: 'Row selection',
		width: '50px',
		pinned: {
			position: 'left'
		},
		visible: true,
		resizable: false,
		sortable: false,
		exportable: false,
		selectable: false,
		moveable: false
	},
	{
		id: 'product.name',
		title: 'Name',
		grow: true
	},
	{
		id: 'quantity',
		title: 'On stock',
		align: 'end',
		grow: true
	},
	{
		id: 'price',
		title: 'Price',
		moveable: false,
		align: 'end',
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
			data,
			columns
		})
	);
</script>

<Datagrid.Datagrid>
	{#snippet head()}
		{#each datagrid.columns as column (column.id)}
			{#if column.id === 'checkbox'}
				<Datagrid.HeaderWithoutSpacing {column} title={column.title}>
					<Datagrid.HeaderRowSelectionDropdown />
				</Datagrid.HeaderWithoutSpacing>
			{:else}
				<Datagrid.Header {column} />
			{/if}
		{/each}
	{/snippet}
	{#snippet body()}
		{#each datagrid.state.processedData as row, rowIndex}
			<Datagrid.Row {rowIndex}>
				{#each datagrid.columns as column, columnIndex}
					{@const props = { row, rowIndex, column, columnIndex }}
					{#if column.id === 'checkbox'}
						<Datagrid.CellWithoutSpacing {...props}>
							<Datagrid.CellRowSelectionCheckbox {row} />
						</Datagrid.CellWithoutSpacing>
					{:else}
						<Datagrid.Cell
							{...props}
							class={{ data: 'overflow-hidden text-ellipsis text-nowrap' }}
						/>
					{/if}
				{/each}
			</Datagrid.Row>
		{/each}
	{/snippet}
</Datagrid.Datagrid>

<div class="flex max-h-[30vh] flex-col justify-around overflow-auto lg:flex-row">
	<div class="w-full">
		<p>Selected Rows</p>
		<pre>{JSON.stringify(datagrid.state.selectedRows, null, 2)}</pre>
	</div>
	<div class="w-full">
		<p>Selected Row IDs</p>
		<pre>{JSON.stringify(Array.from(datagrid.internal.selectedRowIds), null, 2)}</pre>
	</div>
</div>
```
