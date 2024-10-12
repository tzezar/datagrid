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
				rows: { striped: true },
				topbar: {
					display: false,
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
			{#if column.id === 'checkbox'}
				<Datagrid.HeaderWithoutSpacing {column} title={column.title}>
					{#snippet custom()}
						<Datagrid.HeaderRowSelectionDropdown />
					{/snippet}
				</Datagrid.HeaderWithoutSpacing>
			{:else}
				<Datagrid.Header {column}></Datagrid.Header>
			{/if}
		{/each}
	{/snippet}
	{#snippet body()}
		{#each datagrid.internal.paginatedData as row, rowIndex}
			<Datagrid.Row {rowIndex}>
				{#each datagrid.columns as column, columnIndex}
					{#if column.id === 'checkbox'}
						<Datagrid.CellWithoutSpacing {row} {column} {columnIndex} {rowIndex}>
							{#snippet custom()}
								<Datagrid.CellRowSelectionCheckbox {row} />
							{/snippet}
						</Datagrid.CellWithoutSpacing>
					{:else}
						<Datagrid.Cell {row} {column} {columnIndex} {rowIndex} class={{data: 'text-ellipsis text-nowrap overflow-hidden'}}/>
					{/if}
				{/each}
			</Datagrid.Row>
		{/each}
	{/snippet}
</Datagrid.Datagrid>
<div class='flex flex-col lg:flex-row justify-around max-h-[30vh] overflow-auto'>
		<div class="w-full">
			<p>Selected Rows</p>
			<pre>{JSON.stringify(datagrid.state.selectedRows, null, 2)}</pre>
		</div>
		<div class="w-full">

			<p>Selected Row IDs</p>
			<pre>{JSON.stringify(Array.from(datagrid.internal.selectedRowIds), null, 2)}</pre>
		</div>
</div>