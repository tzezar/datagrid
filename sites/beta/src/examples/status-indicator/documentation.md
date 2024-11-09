---
title: Status indicator
description: First post.
date: '2024-10-15'
published: true
---

<script>
  import Datagrid from './datagrid.svelte'
</script>

<Datagrid />

## Implementation

There are three loading states:

- isError
- isFetching
- isRefetching

You can set them accessing:

```ts
datagrid.state.status.isError;
datagrid.state.status.isFetching;
datagrid.state.status.isRefetching;
```

Status indicator comes with predefined design. As for now, colors are not customizable. Let me know if you need that feature. But you can change it directly in datagrid component or create own indicator and pass it via snippet

```svelte
{#snippet loadingIndicator()}
	Your nice indicator
{/snippet}
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
	import Button from '$lib/components/ui/button/button.svelte';

	let datagrid = setContext(
		'datagrid',
		new TzezarDatagrid({
			data: data.slice(0, 20),
			columns,
			options: {
				pagination: { display: false },
			}
		})
	);
	datagrid.state.status.isFetching = true;
</script>

<div class='pb-4'>
	<Button
		onclick={() => {
			datagrid.state.status.isFetching = false;
			datagrid.state.status.isError = false;
		}}
	>
		Clear
	</Button>
	<Button
		onclick={() => {
			datagrid.state.status.isError = true;
			datagrid.state.status.isFetching = false;
		}}
	>
		Simulate error
	</Button>
	<Button
		onclick={() => {
			datagrid.state.status.isFetching = true;
			datagrid.state.status.isError = false;
		}}
	>
		Simulate fetch
	</Button>
</div>

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
