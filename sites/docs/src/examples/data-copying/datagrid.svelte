<script lang="ts">
	import { setContext } from 'svelte';
	import { columns } from './columns.svelte';
	import { inventoryData as data } from '$lib/data/inventory';
	import { TzezarDatagrid } from '$lib/datagrid/tzezar-datagrid.svelte';
	import * as Datagrid from '$lib/datagrid';

	let datagrid = setContext(
		`datagrid`,
		new TzezarDatagrid({
			data,
			columns,
			options: {
				topbar: {
					display: true,
					displayCopyDataMenu: true
				}
			}
		})
	);
</script>

<Datagrid.Datagrid>
	{#snippet head()}
		{#each datagrid.columns as column, i (column.id)}
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
		{#each datagrid.internal.paginatedData as row, rowIndex}
			<Datagrid.Row rowId={row.id} {rowIndex}>
				{#each datagrid.columns as column, columnIndex}
					{@const props = { row, rowIndex, column, columnIndex }}
					{#if column.id === 'checkbox'}
						<Datagrid.CellWithoutSpacing {...props}>
							<Datagrid.CellRowSelectionCheckbox {row} />
						</Datagrid.CellWithoutSpacing>
					{:else if column.id === 'product.name'}
						<Datagrid.Cell
							class={{ data: 'overflow-hidden text-ellipsis text-nowrap' }}
							{...props}
						/>
					{:else}
						<Datagrid.Cell {...props} />
					{/if}
				{/each}
			</Datagrid.Row>
		{/each}
	{/snippet}
</Datagrid.Datagrid>
