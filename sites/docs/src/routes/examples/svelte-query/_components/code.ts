export const code = {
    columns: `import type { BaseColumn } from "$lib/datagrid/types";
import type { InventoryDataRow } from "$lib/data/inventory";

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
        id: 'expand',
        title: 'Row expand',
        width: '50px',
        pinnable: true,
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
        title: 'Product name',
        sortable: true,
        grow: true,
        filterType: 'string',
        filterValue: '',
        pinnable: true,
        pinned: {
            position: 'left'
        }
    },
    {
        id: 'price',
        title: 'Price',
        sortable: true,
        filterType: 'range',
        filterValue: [-99999999999, 9999999999],
        align: 'end'
    },
    {
        id: 'quantity',
        title: 'Quantity',
        sortable: true,
        filterType: 'number',
        filterValue: '',
        align: 'end',

    },
    {
        id: 'category',
        title: 'Category',
        width: '130px',
        filterType: 'select',
        filterValue: '',
        options: [
            { label: 'Everything', value: '' },
            { label: 'Furniture', value: 'furniture' },
            { label: 'Clothing', value: 'clothing' },
            { label: 'Electronics', value: 'electronics' }
        ],
    },
    {
        id: 'expiration_date',
        title: 'Expiration date',
        width: '120px',
    },
    {
        id: 'location',
        title: 'Location',
        width: '200px',
    },
    {
        id: 'manufacturer',
        title: 'Manufacturer',
        width: '200px',
    },
    {
        id: 'actions',
        title: 'Actions',
        width: '110px',
        visible: true,
        resizable: false,
        sortable: false,
        exportable: false,
        selectable: false,
        hideable: false,
        pinned: {
            position: 'right'
        },
        align: 'start'
    }
] satisfies BaseColumn<InventoryDataRow>[]
`,
pagejs: `//page.ts
import { inventoryData } from "$lib/data/inventory"
import { paginateData } from "$lib/datagrid/fns/paginate-data"

export async function load() {

	// provide initial data to datagrid with fetch	
	// in this example we will use workaround for an endpoint

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
 datagrid: `<script lang="ts">
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
				displayCopyDataMenu: true,
				displayExportDataMenu: false,
				displayFullscreenToggle: false,
				displayHeadFilterToggle: true,
				settingsMenu: {
					display: true
				}
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
</Datagrid.Datagrid>`
}