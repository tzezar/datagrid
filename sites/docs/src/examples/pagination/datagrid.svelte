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
			{
				index: 1,
				product: { name: 'Sprouts - Onion' },
				quantity: 972,
				price: 261.51,
				expiration_date: '7/14/2023',
				manufacturer: 'Feedspan',
				category: 'furniture',
				location: 'Apt 1819',
				barcode: 3056519006086,
				weight: 25.6,
				supplier: 'Tazz',
				id: 'a0473d74-06e7-4dd0-8bb3-a17f16c94180'
			},
			{
				index: 2,
				product: { name: 'Beer - True North Lager' },
				quantity: 38,
				price: 191.32,
				expiration_date: '7/17/2023',
				manufacturer: 'Brainlounge',
				category: 'furniture',
				location: 'Suite 11',
				barcode: 6861816867653,
				weight: 52.5,
				supplier: 'Riffwire',
				id: '98b23333-7813-4bb9-a2c6-ce584f9d6711'
			},
			{
				index: 3,
				product: { name: 'Milk - Condensed' },
				quantity: 714,
				price: 826.1,
				expiration_date: '6/9/2022',
				manufacturer: 'Vimbo',
				category: 'furniture',
				location: 'Apt 767',
				barcode: 4697486394862,
				weight: 22.1,
				supplier: 'Skyba',
				id: 'b997a5ae-76a4-4c7c-9718-6e3a2af879a2'
			},
			{
				index: 4,
				product: { name: 'Brandy Cherry - Mcguinness' },
				quantity: 212,
				price: 555.07,
				expiration_date: '2/26/2022',
				manufacturer: 'Brainlounge',
				category: 'electronics',
				location: 'Suite 47',
				barcode: 1507651383044,
				weight: 49.5,
				supplier: 'Photobug',
				id: 'd17b560d-fa24-47ac-bf06-75a52bf5dc1c'
			},
			{
				index: 5,
				product: { name: 'Olive - Spread Tapenade' },
				quantity: 509,
				price: 506.45,
				expiration_date: '3/5/2022',
				manufacturer: 'Gabtune',
				category: 'furniture',
				location: 'Room 1868',
				barcode: 3050521118264,
				weight: 23.5,
				supplier: 'Gigashots',
				id: 'f015ee1b-82b7-42da-8e06-08a967ae0b74'
			},
			{
				index: 6,
				product: { name: 'Tea - Black Currant' },
				quantity: 848,
				price: 750.65,
				expiration_date: '11/1/2022',
				manufacturer: 'Skaboo',
				category: 'clothing',
				location: 'Room 1846',
				barcode: 7247654023537,
				weight: 88.6,
				supplier: 'Skippad',
				id: '6e8412df-08cc-4929-888a-5ad5223719e1'
			},
			{
				index: 7,
				product: { name: 'Coconut Milk - Unsweetened' },
				quantity: 149,
				price: 658.56,
				expiration_date: '8/5/2022',
				manufacturer: 'Jaloo',
				category: 'electronics',
				location: 'PO Box 75154',
				barcode: 6687435198303,
				weight: 89.0,
				supplier: 'Realbridge',
				id: '682c2c54-cd94-45d0-8a16-24dc8ee8dbc1'
			},
			{
				index: 8,
				product: { name: 'Nut - Walnut, Pieces' },
				quantity: 147,
				price: 763.42,
				expiration_date: '9/7/2023',
				manufacturer: 'Kimia',
				category: 'furniture',
				location: 'PO Box 39137',
				barcode: 2530797670037,
				weight: 8.3,
				supplier: 'Kazio',
				id: '3d39ee8b-507c-4b56-81c8-cdee7f30f25c'
			},
			{
				index: 9,
				product: { name: 'Apple - Northern Spy' },
				quantity: 950,
				price: 81.35,
				expiration_date: '12/12/2023',
				manufacturer: 'Linkbridge',
				category: 'clothing',
				location: 'Room 1284',
				barcode: 7524918686628,
				weight: 33.9,
				supplier: 'Twiyo',
				id: 'ac5d77a8-091b-4ac9-9cbe-3695bef8f38f'
			},
			{
				index: 10,
				product: { name: 'Orange - Canned, Mandarin' },
				quantity: 200,
				price: 939.59,
				expiration_date: '7/28/2022',
				manufacturer: 'Feedbug',
				category: 'furniture',
				location: '18th Floor',
				barcode: 3209383758542,
				weight: 4.0,
				supplier: 'Skyvu',
				id: 'e0e8f379-cff3-4ed1-b9ad-1d037bfd3794'
			}
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
