---
title: Context menu
date: '2024-10-15'
published: true
---

<script>
  import Datagrid from './datagrid.svelte'
</script>

> To provide more flexibility, I decided against a simple "context menu cell" option. Instead, you can fully customize the your cell behavior with just a few extra lines of code.

<Datagrid />

## Implementation

### Make custom cell

It is basically default cell, but with added builder from shadcn-svelte. More explictly - from melt-ui. Datagrid will support headless mode and because of that context menu is not implement into cell as default.

> For shadcn-svelte users I prepared a component

> I advise build own one. It may seem complicated, but you can simply copy and paste it. Even better, grab the latest version directly from your codebase, as I might forget to update this example in the future. To prevent error described above I will just show you what to add to custom context menu cell.

```svelte
<script lang="ts">
	let { builder }: { builder?: any } = $props();
</script>

{#if column.visible !== false}
	<div use:builder.action {...builder}>...rest</div>
{/if}
```

### Render it

```svelte
{#each datagrid.columns as column, columnIndex}
	{@const props = { row, rowIndex, column, columnIndex }}
	<ContextMenu.Root>
		<ContextMenu.Trigger asChild let:builder>
			<CellWithContextMenu
				{builder}
				{...props}
				class={{ data: 'overflow-hidden text-ellipsis text-nowrap' }}
			/>
		</ContextMenu.Trigger>
		<ContextMenu.Content>
			<ContextMenu.Item>{getNestedValue(row, column.id)}</ContextMenu.Item>
		</ContextMenu.Content>
	</ContextMenu.Root>
{/each}
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
	import * as ContextMenu from '$lib/components/ui/context-menu';
	import { getNestedValue } from '$lib/datagrid/fns/get-nested-value';
	import CellWithContextMenu from '$lib/datagrid/shadcn/cell-with-context-menu.svelte';

	let datagrid = setContext(
		"datagrid",
		new TzezarDatagrid({
			data: data.slice(0, 20),
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
		{#each datagrid.data as row, rowIndex}
			<Datagrid.Row {rowIndex}>
				{#each datagrid.columns as column, columnIndex}
					{@const props = { row, rowIndex, column, columnIndex }}
					<ContextMenu.Root>
						<ContextMenu.Trigger asChild let:builder>
							<CellWithContextMenu
								{builder}
								{...props}
								class={{ data: 'overflow-hidden text-ellipsis text-nowrap' }}
							/>
						</ContextMenu.Trigger>
						<ContextMenu.Content>
							<ContextMenu.Item>Is not it awesome?</ContextMenu.Item>
							<ContextMenu.Item>Cell content: {getNestedValue(row, column.id)}</ContextMenu.Item>
						</ContextMenu.Content>
					</ContextMenu.Root>
				{/each}
			</Datagrid.Row>
		{/each}
	{/snippet}
</Datagrid.Datagrid>
```
