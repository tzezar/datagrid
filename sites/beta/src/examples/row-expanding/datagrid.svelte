<script lang="ts">
	import { setContext } from 'svelte';
	import { columns } from './columns.svelte';
	import { inventoryData as data } from '$lib/data/inventory';
	import { TzezarDatagrid } from '$lib/datagrid/tzezar-datagrid.svelte';
	import * as Datagrid from '$lib/datagrid';

	let datagrid = setContext(
		'datagrid',
		new TzezarDatagrid({
			data: data.slice(0, 20),
			columns,
			options: {
				paginate: false,
				pagination: { display: false }
			}
		})
	);
</script>

<Datagrid.Datagrid>
	{#snippet head()}
		{#each datagrid.columns as column (column.id)}
			{#if column.id === 'expand'}
				<Datagrid.HeaderWithoutSpacing {column} title="" />
			{:else}
				<Datagrid.Header {column} />
			{/if}
		{/each}
	{/snippet}
	{#snippet body()}
		{#each datagrid.data as row, rowIndex}
			<Datagrid.Row {rowIndex}>
				{#each datagrid.columns as column, columnIndex}
					{@const props = { row, rowIndex, column, columnIndex }}
					{#if column.id === 'expand'}
						<Datagrid.CellWithoutSpacing {...props}>
							<Datagrid.ExpandRowToggler rowId={row.id} />
						</Datagrid.CellWithoutSpacing>
					{:else if column.id === 'product.name'}
						<Datagrid.Cell
							{...props}
							class={{ data: 'overflow-hidden text-ellipsis text-nowrap' }}
						/>
					{:else}
						<Datagrid.Cell {column} {row} {columnIndex} {rowIndex} />
					{/if}
				{/each}
			</Datagrid.Row>
			{#if Datagrid.isRowExpanded(datagrid, row.id)}
				<Datagrid.Row
					class={`border-b ${Datagrid.STAY_IN_PLACE} ${Datagrid.HIDE_BEHIND_PARENT_ROW}`}
					{rowIndex}
				>
					<div class="p-2 pl-3">
						Lorem ipsum dolor sit amet consectetur adipisicing elit. Harum deserunt tenetur debitis
						praesentium aliquam error quibusdam explicabo nam voluptates, dignissimos minima quasi
						aliquid. Repellat, voluptatibus. Natus cumque temporibus nostrum quos. Assumenda
						laboriosam nostrum laborum impedit dolorem consectetur praesentium doloribus iusto
						accusamus recusandae! Sint, natus dolorem perferendis nesciunt similique nihil optio
						repellat adipisci ad expedita numquam quaerat incidunt cum consectetur praesentium.
						Pariatur tempore delectus sunt necessitatibus at voluptatum beatae molestias ratione
						modi nostrum a neque dolor illo magnam vero, natus dolorem, corporis eum aspernatur
						quaerat? Quibusdam ab velit neque rerum excepturi.
					</div>
				</Datagrid.Row>
			{/if}
		{/each}
	{/snippet}
</Datagrid.Datagrid>
