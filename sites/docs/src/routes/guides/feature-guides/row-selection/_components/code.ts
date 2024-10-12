export const code = {
    baseColumns: `{
	id: 'checkbox',
	title: 'Row selection',
	width: '50px',
	pinned: {
		position: 'left'
	},
	visible: true,
	resizable: false,
	sortable: false,
	exportable: false,
	selectable: false,
	moveable: false
},`,
customHeader: `{#each datagrid.columns as column, i (column.id)}
	{#if column.id === 'checkbox'}
		<Datagrid.HeaderWithoutSpacing {column} title={column.title}>
			{#snippet custom()}
				<Datagrid.HeaderRowSelectionDropdown />
			{/snippet}
		</Datagrid.HeaderWithoutSpacing>
	{:else}
		<Datagrid.Header {column}></Datagrid.Header>
	{/if}
{/each}`,
customCell:`{#each datagrid.internal.paginatedData as row, rowIndex}
	<Datagrid.Row {rowIndex}>
		{#each datagrid.columns as column, columnIndex}
			{#if column.id === 'checkbox'}
				<Datagrid.CellWithoutSpacing {row} {column} {columnIndex} {rowIndex}>
					{#snippet custom()}
						<Datagrid.CellRowSelectionCheckbox {row} />
					{/snippet}
				</Datagrid.CellWithoutSpacing>
			{:else}
				<Datagrid.Cell {row} {column} {columnIndex} {rowIndex} />
			{/if}
		{/each}
	</Datagrid.Row>
{/each}`,
grid: `<script lang="ts">
	import { setContext } from 'svelte';
	import { columns } from './columns.svelte';
	import { inventoryData as data } from '$lib/data/inventory';
	import { TzezarDatagrid } from '$lib/datagrid/tzezar-datagrid.svelte';
	import * as Datagrid from '$lib/datagrid';

	let datagrid = setContext(
		\`datagrid\`,
		new TzezarDatagrid({
			data,
			columns,
			options: {
				rows: { striped: true },
				topbar: {
					display: false,
				}
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
			{#if column.id === 'checkbox'}
				<Datagrid.HeaderWithoutSpacing {column} title={column.title}>
					{#snippet custom()}
						<Datagrid.HeaderRowSelectionDropdown />
					{/snippet}
				</Datagrid.HeaderWithoutSpacing>
			{:else}
				<Datagrid.Header {column}></Datagrid.Header>
			{/if}
		{/each}
	{/snippet}
	{#snippet body()}
		{#each datagrid.internal.paginatedData as row, rowIndex}
			<Datagrid.Row {rowIndex}>
				{#each datagrid.columns as column, columnIndex}
					{#if column.id === 'checkbox'}
						<Datagrid.CellWithoutSpacing {row} {column} {columnIndex} {rowIndex}>
							{#snippet custom()}
								<Datagrid.CellRowSelectionCheckbox {row} />
							{/snippet}
						</Datagrid.CellWithoutSpacing>
					{:else}
						<Datagrid.Cell {row} {column} {columnIndex} {rowIndex} class={{data: 'text-ellipsis text-nowrap overflow-hidden'}}/>
					{/if}
				{/each}
			</Datagrid.Row>
		{/each}
	{/snippet}
</Datagrid.Datagrid>
`
}
