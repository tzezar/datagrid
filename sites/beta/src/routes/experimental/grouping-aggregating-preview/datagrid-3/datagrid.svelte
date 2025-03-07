<script lang="ts">
	import { setContext } from 'svelte';
	import { TzezarDatagrid } from '$lib/datagrid/tzezar-datagrid.svelte';
	import { inventoryData as data } from '$lib/data/inventory';
	import * as Datagrid from '$lib/datagrid';
	import { columns } from '../columns.svelte';
	import DatagridBody from './datagrid-body.svelte';
	import { getNestedValue } from '$lib/datagrid/fns/get-nested-value';

	let datagrid = setContext(
		'datagrid',
		new TzezarDatagrid({
			data: data,
			columns,
			title: 'Variant I',
			state: {
				sortingArray: [
					{ columnId: 'category', direction: 'asc' },
					{ columnId: 'manufacturer', direction: 'asc' }
				],
				grouping: [
					{
						field: 'category',
						aggregations: [
							{ field: 'price', type: 'avg', label: 'Avg Salary' },
							{ field: 'price', type: 'min', label: 'Min Salary' },
							{ field: 'weight', type: 'max', label: 'Max Weight' },
							{ field: 'quantity', type: 'sum', label: 'Sum Quantity' }
						]
					},
					{
						field: 'manufacturer',
						aggregations: [
							{ field: 'price', type: 'avg', label: 'Avg Salary' },
							{ field: 'price', type: 'min', label: 'Min Salary' },
							{ field: 'weight', type: 'max', label: 'Max Weight' },
							{ field: 'quantity', type: 'sum', label: 'Sum Quantity' }
						]
					}
				]
			},
			options: {
				paginate: false,
				pagination: { display: true },
				grouping: true,
				topbar: {
					display: true
				}
			}
		})
	);


</script>

<Datagrid.Datagrid>
	{#snippet body()}
		{#each datagrid.state.groupedData as row, rowIndex}
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
						{:else if row.aggregates?.filter((x) => x.field === column.id)}
							<Datagrid.Cell {column} {columnIndex} {row} {rowIndex}>
								<div class="text-muted-foreground flex flex-col gap-2 text-sm w-full h-full">
									{#each row.aggregates as aggregate, aggregateIndex}
										{#if aggregate.field === column.id}
											<div class="flex gap-2 justify-between h-full">
												<span class="">{aggregate.label}:</span>
												<span>{aggregate.value.toFixed(2)}</span>
											</div>
										{/if}
									{/each}
								</div>
							</Datagrid.Cell>
						{/if}
					{/each}
				</Datagrid.Row>
			{:else}
				<Datagrid.Row {rowIndex}>
					{#each datagrid.columns as column, columnIndex}
						<Datagrid.Cell {column} {columnIndex} {row} {rowIndex}>{row.key}</Datagrid.Cell>
					{/each}
				</Datagrid.Row>
			{/if}
			{#if datagrid.state.expandedRows.includes(row.key)}
				<DatagridBody data={row.items} columns={datagrid.columns}></DatagridBody>
			{/if}
		{/each}
	{/snippet}
</Datagrid.Datagrid>
