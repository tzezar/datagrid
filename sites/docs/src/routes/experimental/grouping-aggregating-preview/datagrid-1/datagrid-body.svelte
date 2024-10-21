<script lang="ts">
	import * as Datagrid from '$lib/datagrid';
	import { getNestedValue } from '$lib/datagrid/fns/get-nested-value';
	let { data, columns }: any = $props();


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
                        class={{cell:'cursor-pointer'}}
						{column} {columnIndex} {row} {rowIndex}
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
				{:else}
					<Datagrid.Cell {column} {columnIndex} {row} {rowIndex}></Datagrid.Cell>
				{/if}
			{/each}
		</Datagrid.Row>
	{:else}
		<Datagrid.Row {rowIndex}>
			{#each columns.filter((x) => x.grouped === true) as column, columnIndex}
				<Datagrid.Cell {column} {rowIndex} {row} {columnIndex}>&nbsp;</Datagrid.Cell>
			{/each}
			{#each columns.filter((x) => x.grouped !== true) as column, columnIndex}
				<Datagrid.Cell {column} {rowIndex} {row} {columnIndex}>{getNestedValue(row, column.id)}</Datagrid.Cell>
			{/each}
		</Datagrid.Row>
	{/if}

	{#if expandedRows.includes(row.key)}
		<svelte:self data={row.items} {columns} />
	{/if}
{/each}
