---
title: Pagination
description: First post.
date: '2024-10-15'
published: true
---

<script>
  import Datagrid from './datagrid.svelte'
  import DatagridPaginationClientSide from './datagrid-pagination-client-side.svelte'

  export let data
</script>

## Client side pagination

<DatagridPaginationClientSide />

## Implementation

> pagination is enabled by default

`pagination` can be enabled/disabled by setting:

```ts
options: {
	paginate: true | false,
}
```

Pagination component can be enabled/disabled by setting:

```ts
options: {
	pagination: {
		display: true | false;
	}
}
```

Initial pagination state can be set like this:

```ts
state: {
	pagination: {
		page: 7,
		perPage: 30,
		count: 1000
	}
}
```

Pagination state can be accessed like this:

```ts
datagrid.state.pagination;
```

## Code

### Column definitions

```ts
import type { BaseColumn } from '$lib/datagrid/types';
import type { InventoryDataRow } from '$lib/data/inventory';

export const columns = [
	{
		id: 'product.name',
		title: 'Name',
		width: '300px'
	},
	{
		id: 'quantity',
		title: 'On stock',
		align: 'end'
	},
	{
		id: 'price',
		title: 'Price',
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
			columns,
			state: {
				pagination: {
					page: 7,
					perPage: 50,
					count: data.length
				}
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

---

## Server side pagination

<Datagrid />

## Implementation with @tanstack-query

If you want to implement server side pagination it is important to set internal pagination logic to false and to set `mode` to `server`

```ts
{
mode: "server",
options: {
	paginate: false
}
```

```ts
options: {
	pagination: {
		display: true | false;
	}
}
```

Initial pagination state can be set like this:

```ts
state: {
	pagination: {
		page: 7,
		perPage: 30,
		count: 1000
	}
}
```

Pagination state can be accessed like this:

```ts
datagrid.state.pagination;
```

## Code

### Getting data SSR

```ts
import { inventoryData } from "$lib/data/inventory"
import { paginateData } from "$lib/datagrid/fns/paginate-data"

export async function load({fetch}) {

	const response = await fetch('API_URL').then(await r=> r.json())
	
	// handle error here with try catch

	return {
        data,
        count,
        page,
        perPage
    }
}
```

### Datagrid component

```svelte
<script lang="ts">
	import { onMount, setContext } from 'svelte';
	import { columns } from './columns.svelte';
	import { TzezarDatagrid } from '$lib/datagrid/tzezar-datagrid.svelte';
	import * as Datagrid from '$lib/datagrid';
	import { cn } from '$lib/utils';
	import { createQuery } from '@tanstack/svelte-query';
	import { simulateServerRequest } from './simulate-server-request';
	import Button from '$lib/components/ui/button/button.svelte';

	// you will get that from your load() function or you can fetch it onMount()
	let initialData = {
		data: [
			// ... rows
		],
		page: 1,
		perPage: 10,
		count: 10
	};

	let datagrid = setContext(
		'datagrid',
		new TzezarDatagrid({
			mode: 'server',
			data: initialData.data,
			columns,
			// on any internal change you can refetch data, or you can bind to internal state
			// directly and the launch refetch
			onChange: () => $query.refetch(),
			// with SSR you can set default pagination state here
			state: {
				pagination: {
					count: initialData.count,
					perPage: initialData.perPage,
					page: initialData.page
				}
			}
		})
	);

	// this is buggy with svelte 5
	// query keys are not reactive, not sure if could be fixed with eg writable store as they suggest
	let query = createQuery({
		queryKey: ['inventory', datagrid.state.pagination.page],
		queryFn: async () => {
			return await simulateServerRequest({
				page: datagrid.state.pagination.page,
				perPage: datagrid.state.pagination.perPage,
				filters: datagrid.state.filters,
				sorting: datagrid.state.sortingArray
			});
		},
		initialData,
		refetchOnMount: false
	});

	// workaround for @tanstack-query still on svelte 4
	$effect(() => {
		datagrid.state.status.isError = $query.isError;
		datagrid.state.status.isRefetching = $query.isRefetching;
		datagrid.state.status.isFetching = $query.isFetching;
		datagrid.state.pagination.count = $query.data?.count;
		datagrid.state.pagination.page = $query.data?.page;
		datagrid.state.pagination.perPage = $query.data?.perPage;
	});

	$effect(() => {
		datagrid.data = $query.data?.data;
	});
</script>

<div class="pb-4">
	<Button onclick={() => (datagrid.state.status.isError = true)}>Simulate error</Button>
	<Button
		onclick={() => {
			datagrid.data = [];
			datagrid.state.status.isError = false;
		}}
	>
		Simulate no data</Button
	>
	<Button
		onclick={() => {
			$query.refetch();
		}}
	>
		Refetch
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
					<Datagrid.Cell
						{row}
						{column}
						{columnIndex}
						{rowIndex}
						class={{
							cell: cn(row['quantity'] < 200 && 'text-red-500')
						}}
					/>
				{/each}
			</Datagrid.Row>
		{/each}
	{/snippet}
</Datagrid.Datagrid>
```
