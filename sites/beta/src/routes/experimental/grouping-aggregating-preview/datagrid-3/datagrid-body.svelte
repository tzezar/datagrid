<script lang="ts">
	import * as Datagrid from '$lib/datagrid';
	import { getNestedValue } from '$lib/datagrid/fns/get-nested-value';
	let { data, columns }: any = $props();


	

	$effect(() => {
		console.log($state.snapshot(data));
	});

	let expandedRows: string[] = $state([]);
</script>

{#each data as row, rowIndex}
	{#if row.groupBy}
		<Datagrid.Row {rowIndex}>
			{#each columns as column, columnIndex}
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
							expandedRows = expandedRows.includes(row.key)
								? expandedRows.filter((x) => x !== row.key)
								: [...expandedRows, row.key];
						}}
					>
						{#if expandedRows.includes(row.key)}
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
			{#each columns.filter((x) => x.grouped === true) as column, columnIndex}
				<Datagrid.Cell {column} {rowIndex} {row} {columnIndex}>&nbsp;</Datagrid.Cell>
			{/each}
			{#each columns.filter((x) => x.grouped !== true) as column, columnIndex}
				<Datagrid.Cell {column} {rowIndex} {row} {columnIndex}
					>{getNestedValue(row, column.id)}</Datagrid.Cell
				>
			{/each}
		</Datagrid.Row>
	{/if}

	{#if expandedRows.includes(row.key)}
		<svelte:self data={row.items} {columns} />
	{/if}
{/each}
