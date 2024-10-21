<script lang="ts">
	import { setContext } from 'svelte';
	import { TzezarDatagrid } from '$lib/datagrid/tzezar-datagrid.svelte';
	import { inventoryData as data } from '$lib/data/inventory';
	import * as Datagrid from '$lib/datagrid';
	import { columns } from '../columns.svelte';
	import { getNestedValue } from '$lib/datagrid/fns/get-nested-value';
	import DatagridSub from './datagrid-sub.svelte';



	let datagrid = setContext(
		'datagrid',
		new TzezarDatagrid({
			data,
			columns,
			title: 'Variant II - Pagination',
			state: {
				grouping: ['category', 'manufacturer'],
				sortingArray: [
					{ columnId: 'category', direction: 'asc' },
					{ columnId: 'manufacturer', direction: 'asc' }
				]
			},
			options: {
				paginate: true,
				grouping: true,
				topbar: {
					display: true
				}
			}
		})
	);

	

	console.log($state.snapshot(datagrid.state.processedData));
</script>

<Datagrid.Datagrid>
	{#snippet head()}
		{#each datagrid.columns as column (column.id)}
			<Datagrid.Header {column} />
		{/each}
	{/snippet}
	<!-- {#snippet body()}
		<DatagridSub data={datagrid.state.processedData} columns={datagrid.columns} />
	{/snippet} -->
	{#snippet body()}
		{#each datagrid.state.processedData as row, rowIndex}
			{#if row.groupBy}
				<Datagrid.Row {rowIndex}>
					{#each datagrid.columns as column, columnIndex}
						{#if column.id === row.groupBy}
							<Datagrid.Cell {column} {columnIndex} {row} {rowIndex}>{row.key}</Datagrid.Cell>
						{:else if column.id === 'expand'}
							<Datagrid.Cell
								class={{ cell: 'cursor-pointer' }}
								{column}
								{columnIndex}
								{row}
								{rowIndex}
								onclick={() => {
									datagrid.state.expandedRows = datagrid.state.expandedRows.includes(row.key)
										? datagrid.state.expandedRows.filter((x) => x !== row.key)
										: [...datagrid.state.expandedRows, row.key];
								}}
							>
								{#if datagrid.state.expandedRows.includes(row.key)}
									-
								{:else}
									+
								{/if}
							</Datagrid.Cell>
						{:else}
							<Datagrid.Cell {column} {columnIndex} {row} {rowIndex}></Datagrid.Cell>
						{/if}
					{/each}
				</Datagrid.Row>
			{:else}
				<Datagrid.Row {rowIndex}>
					{#each datagrid.columns.filter((x) => x.grouped === true) as column, columnIndex}
						<Datagrid.Cell {column} {rowIndex} {row} {columnIndex}>&nbsp;</Datagrid.Cell>
					{/each}
					{#each datagrid.columns.filter((x) => x.grouped !== true) as column, columnIndex}
						<Datagrid.Cell {column} {rowIndex} {row} {columnIndex}
							>{getNestedValue(row, column.id)}</Datagrid.Cell
						>
					{/each}
				</Datagrid.Row>
			{/if}

			{#if datagrid.state.expandedRows.includes(row.key)}
				<!-- <svelte:self data={row.items} {columns} /> -->
				<DatagridSub data={row.items} columns={datagrid.columns}  />
			{/if}
		{/each}
	{/snippet}
</Datagrid.Datagrid>
