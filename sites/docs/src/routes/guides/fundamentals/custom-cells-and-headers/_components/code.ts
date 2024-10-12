export const code = {
	grid: `<script lang="ts">
	import { setContext } from 'svelte';
	import { columns } from './columns.svelte';
	import { inventoryData as data } from '$lib/data/inventory';
	import { TzezarDatagrid } from '$lib/datagrid/tzezar-datagrid.svelte';
	import * as Datagrid from '$lib/datagrid';
	import { cn } from '$lib/utils';
	import { getNestedValue } from '$lib/datagrid/fns/get-nested-value';

	let datagrid = setContext(
		\`datagrid\`,
		new TzezarDatagrid({
			data,
			columns,
			options: {
				rows: { striped: true },
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
			{#if column.id === 'customCell'}
				<Datagrid.HeaderWithoutSpacing {column} title={column.title}>
					{#snippet custom()}
						<div class="mx-auto bg-orange-400">OMG custom header</div>
					{/snippet}
				</Datagrid.HeaderWithoutSpacing>
			{:else if column.id === 'quantity'}
			<!-- omit -->
			{:else if column.id === 'price'}
			<Datagrid.Header {column}>
				{#snippet custom()}
					<div class="0">Override stupid price with cute doggy</div>
				{/snippet}
			</Datagrid.Header>

			{:else}
				<Datagrid.Header {column}></Datagrid.Header>
			{/if}
		{/each}
	{/snippet}
	{#snippet body()}
		{#each datagrid.internal.paginatedData as row, rowIndex}
			<Datagrid.Row {rowIndex}>
				{#each datagrid.columns as column, columnIndex}
					{#if column.id === 'product.name'}
						<Datagrid.Cell
							{column}
							{row}
							{columnIndex}
							{rowIndex}
							class={{
								data: cn(
									'overflow-hidden text-ellipsis text-nowrap',
									rowIndex % 3 === 0 && 'text-orange-400'
								)
							}}
						>
							{#snippet custom()}
								<div>
									{getNestedValue(row, column.id).toUpperCase()} + {getNestedValue(row, 'quantity')}
								</div>
							{/snippet}
						</Datagrid.Cell>
					{:else if column.id === 'customCell'}
						<Datagrid.Cell {column} {row} {columnIndex} {rowIndex}>
							{#snippet custom()}
								<p>Custom cell</p>
							{/snippet}
						</Datagrid.Cell>
					{:else if column.id === 'quantity'}
						<!-- omit -->
					{:else if column.id === 'price'}
						<Datagrid.Cell
							{column}
							{row}
							{columnIndex}
							{rowIndex}
							class={{ cell: cn(rowIndex % 2 === 0 ? 'bg-green-100' : 'bg-table-row-odd') }}
						>
							{#snippet custom()}
								<img
									class="w-20"
									src="https://www.pawlovetreats.com/cdn/shop/articles/pembroke-welsh-corgi-puppy_1000x.jpg?v=1628638716"
									alt=""
								/>
							{/snippet}
						</Datagrid.Cell>
					{:else}
						<Datagrid.Cell {column} {row} {columnIndex} {rowIndex} />
					{/if}
				{/each}
			</Datagrid.Row>
		{/each}
	{/snippet}
</Datagrid.Datagrid>`
}
