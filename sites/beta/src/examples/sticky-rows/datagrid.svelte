<script lang="ts">
	import { setContext } from 'svelte';
	import { columns } from './columns.svelte';
	import { inventoryData as data } from '$lib/data/inventory';
	import { TzezarDatagrid } from '$lib/datagrid/tzezar-datagrid.svelte';
	import * as Datagrid from '$lib/datagrid';
	import { getNestedValue } from '$lib/datagrid/fns/get-nested-value';

	let datagrid = setContext(
		'datagrid',
		new TzezarDatagrid({
			data: data.slice(0, 20),
			columns,
			options: {
				pagination: { display: false }
			}
		})
	);
</script>

<Datagrid.Datagrid>
	{#snippet head()}
		{#each datagrid.columns as column (column.id)}
			<Datagrid.Header {column} />
		{/each}
	{/snippet}
	{#snippet body()}
		{#each datagrid.data as row, rowIndex}
			{#if rowIndex % 2 === 0}
				<Datagrid.Row {rowIndex}>
					{#each datagrid.columns as column, columnIndex}
						{@const props = { row, rowIndex, column, columnIndex }}
						<Datagrid.Cell {...props} />
					{/each}
				</Datagrid.Row>
			{:else}
				<Datagrid.Row
					class={`${Datagrid.STAY_IN_PLACE} ${Datagrid.HIDE_BEHIND_PARENT_ROW} `}
					{rowIndex}
				>
					<div class="min-w-full">
						{#each datagrid.columns as column, columnIndex}
							{@const props = { row, rowIndex, column, columnIndex }}
							<Datagrid.Cell {...props} class={{ cell: 'grid min-w-full max-w-fit grid-cols-2' }}>
								<span>{column.title}</span>
								<span>{getNestedValue(row, column.id)}</span>
							</Datagrid.Cell>
						{/each}
					</div>
				</Datagrid.Row>
			{/if}
		{/each}
	{/snippet}
</Datagrid.Datagrid>
