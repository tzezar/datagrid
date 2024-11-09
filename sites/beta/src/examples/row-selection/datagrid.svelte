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
