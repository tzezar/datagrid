export const code = {
	pagination: `export type Page = number
export type PerPage = number
export type Count = number

export type Pagination = {
    page: Page,
    perPage: PerPage,
    count: Count
}

// state.pagination
pagination: {
	page: 1,
	perPage: 20,
	count: 1
} as Pagination`,
	showPagination: `options: {
	pagination: { display: true }
}`,
	simpleColumn: `{
    id: 'barcode',
    title: 'Barcode',
    pinned: {
        position: 'left'
    }
}`,clientSide: `<script lang="ts">
	import { setContext } from 'svelte';
	import { columns } from './columns.svelte';
	import { inventoryData as data } from '$lib/data/inventory';
	import { TzezarDatagrid } from '$lib/datagrid/tzezar-datagrid.svelte';
	import * as Datagrid from '$lib/datagrid';

	let datagrid = setContext(
		\`datagrid\`,
		new TzezarDatagrid({
			data,
			columns,
            state: {
                pagination: {
                    page: 7,
                    perPage: 50,
                    count: data.length
                }
            },
            options: {
				pagination: { display: true },
				rows: { striped: true },
				topbar: {
					display: false
				}
			}
		})
	);
</script>

<Datagrid.Datagrid>
	{#snippet topBar()}
		<Datagrid.TopBar />
	{/snippet}
	{#snippet head()}
		{#each datagrid.columns as column, i (column.id)}
			<Datagrid.Header {column}>
				{#snippet filter()}
					<Datagrid.ColumnFilter {column} />
				{/snippet}
			</Datagrid.Header>
		{/each}
	{/snippet}
	{#snippet body()}
		{#each datagrid.internal.paginatedData as row, rowIndex}
			<Datagrid.Row {rowIndex}>
				{#each datagrid.columns as column, columnIndex}
					{#if column.id === 'product.name'}
						<Datagrid.Cell
							{column}
							{row}
							{columnIndex}
							{rowIndex}
							class={{ data: 'overflow-hidden text-ellipsis text-nowrap' }}
						/>
					{:else}
						<Datagrid.Cell {column} {row} {columnIndex} {rowIndex} />
					{/if}
				{/each}
			</Datagrid.Row>
		{/each}
	{/snippet}
</Datagrid.Datagrid>
`,variables: `page: datagrid.state.pagination.page,
perPage: datagrid.state.pagination.perPage,
filters: datagrid.state.filters,
sorting: datagrid.state.sortingArray`,
	paginationExample: `<script lang="ts">
	import { setContext } from 'svelte';
	import { columns } from './columns.svelte';
	import { type InventoryDataRow } from '$lib/data/inventory';
	import { TzezarDatagrid, type ConstructorOptions } from '$lib/datagrid/tzezar-datagrid.svelte';
	import * as Datagrid from '$lib/datagrid';
	import { cn } from '$lib/utils';
	import { createQuery } from '@tanstack/svelte-query';
	import { simulateServerRequest } from './simulate-server-request';

	type InitialData = {
		data: InventoryDataRow[];
		count: number;
		perPage: number;
		page: number;
	};

	let { initialData }: { initialData: InitialData } = $props();

	const config: ConstructorOptions = {
		state: {
			pagination: {
				count: initialData.count,
				perPage: initialData.perPage,
				page: initialData.page
			}
		},
		options: {
			pagination: { display: true },
			rows: { striped: true },
			footer: { display: false },
			topbar: {
				display: false,
			}
		}
	};

	let datagrid = setContext(
		\`datagrid\`,
		new TzezarDatagrid({
			mode: 'server',
			title: 'Svelte query',
			data: initialData.data,
			columns,
			onChange: () => $query.refetch(),
			...config
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

	// need to put everything in effect cuz svelte query does not work with $derrived or other,
	// and its not possible (or skill issue - let me know) to update values after refetch
	$effect(() => {
		datagrid.state.status.isError = $query.isError;
		datagrid.state.status.isRefetching = $query.isRefetching;
		datagrid.state.status.isFetching = $query.isFetching;
		datagrid.internal.paginatedData = $query.data?.data;
		datagrid.state.pagination.count = $query.data?.count;
		datagrid.state.pagination.page = $query.data?.page;
		datagrid.state.pagination.perPage = $query.data?.perPage;
	});
</script>
<div>
	<Button onclick={() => (datagrid.state.status.isError = true)}>Simulate error</Button>
	<Button
		onclick={() => {
			datagrid.internal.paginatedData = [];
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
		Refetch</Button
	>
</div>
<Datagrid.Datagrid>
	{#snippet head()}
		{#each datagrid.columns as column, i (column.id)}
			<Datagrid.Header {column}>
				{#snippet filter()}
					<Datagrid.ColumnFilter {column} />
				{/snippet}
			</Datagrid.Header>
		{/each}
	{/snippet}
	{#snippet body()}
		{#each datagrid.internal.paginatedData as row, rowIndex}
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
`,
load: `import { inventoryData } from "$lib/data/inventory"
import { paginateData } from "$lib/datagrid/fns/paginate-data"

export async function load() {
    const page = 1
    const perPage = 10
    const data = paginateData(inventoryData, page, perPage)
    const count = inventoryData.length
    return {
        data,
        count,
        page,
        perPage
    }
}`,
	columns: `import type { BaseColumn } from "$lib/datagrid/types";
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
        moveable: false,
        align: 'end',
        grow: true,
    }

] satisfies BaseColumn<InventoryDataRow>[]`,

	important1: `satisfies BaseColumn<InventoryDataRow>[]`,
	datagrid: `<script lang="ts">
	import { setContext } from 'svelte';
	import { columns } from './columns.svelte';
	import { inventoryData as data } from '$lib/data/inventory';
	import { TzezarDatagrid } from '$lib/datagrid/tzezar-datagrid.svelte';
	import * as Datagrid from '$lib/datagrid';

	let datagrid = setContext(
		\`datagrid\`,
		new TzezarDatagrid({
			title: 'Column freezing',
			data,
			columns,
			options: {...}
		})
	);
</script>

<Datagrid.Datagrid>
	{#snippet topBar()}
		<Datagrid.TopBar />
	{/snippet}
	{#snippet head()}
		{#each datagrid.columns as column, i (column.id)}
			<Datagrid.Header {column}>
				{#snippet filter()}
					<Datagrid.ColumnFilter {column} />
				{/snippet}
			</Datagrid.Header>
		{/each}
	{/snippet}
	{#snippet body()}
		{#each datagrid.internal.paginatedData as row, rowIndex}
			<Datagrid.Row {rowIndex}>
				{#each datagrid.columns as column, columnIndex}
					<Datagrid.Cell {column} {row} {columnIndex} {rowIndex}></Datagrid.Cell>
				{/each}
			</Datagrid.Row>
		{/each}
	{/snippet}
</Datagrid.Datagrid>
`
}
