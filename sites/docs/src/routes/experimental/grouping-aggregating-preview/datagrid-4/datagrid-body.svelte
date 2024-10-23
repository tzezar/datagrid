<script lang="ts">
	import * as Datagrid from '$lib/datagrid';
	import { getNestedValue } from '$lib/datagrid/fns/get-nested-value';
	import { paginateData } from '$lib/datagrid/fns/paginate-data';
	import { TzezarDatagrid } from '$lib/datagrid/tzezar-datagrid.svelte';
	import { setContext } from 'svelte';
	let { data = [], columns }: any = $props();

	let datagrid = setContext(
		'datagrid',
		new TzezarDatagrid({
			data: data?.items || data || [],
			columns,
			state: {
				groupedData: data,
				pagination: {
					perPage: 4,
					page: 1,
					count: 0
				}
			},
			options: {
				paginate: true,
				pagination: { display: true },
				grouping: false,
				topbar: {
					display: false
				}
			}
		})
	);

	$effect(() => {
		datagrid.state.processedData = paginateData(
			data,
			datagrid.state.pagination.page,
			datagrid.state.pagination.perPage
		);
	});

	const cellIsAggregated = (row, column) => {
		return row.aggregates?.filter((x) => x.field === column.id);
	};

	const epandRow = (row) => {
		datagrid.state.expandedRows = datagrid.state.expandedRows.includes(row.key)
			? datagrid.state.expandedRows.filter((x) => x !== row.key)
			: [...datagrid.state.expandedRows, row.key];
	};
	const columnIsGrouped = (columns) => {
		return columns.filter((x) => x.grouped === true);
	};
	const columnIsNotGrouped = (columns) => {
		return columns.filter((x) => x.grouped !== true);
	};
</script>

<Datagrid.Datagrid class={{wrapper: 'w-full'}}>
	{#snippet head()}{/snippet}

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
								onclick={() => epandRow(row)}
							>
								{#if datagrid.state.expandedRows.includes(row.key)}
									-
								{:else}
									+
								{/if}
							</Datagrid.Cell>
						{:else if cellIsAggregated(row, column)}
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
					{#each columnIsGrouped(columns) as column, columnIndex}
						<Datagrid.Cell {column} {rowIndex} {row} {columnIndex}>&nbsp;</Datagrid.Cell>
					{/each}
					{#each columnIsNotGrouped(columns) as column, columnIndex}
						<Datagrid.Cell {column} {rowIndex} {row} {columnIndex}
							>{getNestedValue(row, column.id)}</Datagrid.Cell
						>
					{/each}
				</Datagrid.Row>
			{/if}

			{#if datagrid.state.expandedRows.includes(row.key)}
				<svelte:self data={row.items} {columns} />
			{/if}
		{/each}
	{/snippet}
</Datagrid.Datagrid>
