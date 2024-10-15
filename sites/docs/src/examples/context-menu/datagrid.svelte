<script lang="ts">
	import { setContext } from 'svelte';
	import { columns } from './columns.svelte';
	import { inventoryData as data } from '$lib/data/inventory';
	import { TzezarDatagrid } from '$lib/datagrid/tzezar-datagrid.svelte';
	import * as Datagrid from '$lib/datagrid';
	import * as ContextMenu from '$lib/components/ui/context-menu';
	import { getNestedValue } from '$lib/datagrid/fns/get-nested-value';
	import CellWithContextMenu from '$lib/datagrid/shadcn/cell-with-context-menu.svelte';

	let datagrid = setContext(
		"datagrid",
		new TzezarDatagrid({
			data: data.slice(0, 20),
			columns,
			options: {
				pagination: { display: false },
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
			<Datagrid.Row {rowIndex}>
				{#each datagrid.columns as column, columnIndex}
					{@const props = { row, rowIndex, column, columnIndex }}
					<ContextMenu.Root>
						<ContextMenu.Trigger asChild let:builder>
							<CellWithContextMenu
								{builder}
								{...props}
								class={{ data: 'overflow-hidden text-ellipsis text-nowrap' }}
							/>
						</ContextMenu.Trigger>
						<ContextMenu.Content>
							<ContextMenu.Item>Is not it awesome?</ContextMenu.Item>
							<ContextMenu.Item>Cell content: {getNestedValue(row, column.id)}</ContextMenu.Item>
						</ContextMenu.Content>
					</ContextMenu.Root>
				{/each}
			</Datagrid.Row>
		{/each}
	{/snippet}
</Datagrid.Datagrid>
