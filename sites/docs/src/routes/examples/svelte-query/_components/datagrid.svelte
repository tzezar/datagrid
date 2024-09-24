<script lang="ts">
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
				display: true,
				displayCopyDataMenu: false,
				displayExportDataMenu: false,
				displayFullscreenToggle: true,
				displayHeadFilterToggle: true,
				settingsMenu: {
					display: true
				}
			}
		}
	};

	let datagrid = setContext(
		`datagrid`,
		new TzezarDatagrid({
			mode: 'server',
			title: 'Svelte query',
			data: initialData.data,
			columns,
			onChange: () => $query.refetch(),
			...config
		})
	);
	// this is damn buggy with svelte 5
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
