<script lang="ts">
	import { setContext } from 'svelte';
	import { columns } from './columns.svelte';
	import { inventoryData as data } from '$lib/data/inventory';
	import { TzezarDatagrid } from '$lib/datagrid/tzezar-datagrid.svelte';
	import * as Datagrid from '$lib/datagrid';

	let datagrid = setContext(
		`datagrid`,
		new TzezarDatagrid({
			data: data.slice(0, 50),
			columns,
			options: {
				pagination: { display: false },
				rows: { striped: true },
				topbar: {
					display: true,
					displayCopyDataMenu: false,
					displayExportDataMenu: false,
					displayFullscreenToggle: false,
					displayHeadFilterToggle: false,
					settingsMenu: {
						display: true,
						displayFreezingMenu: true,
						displayReoderingMenu: false,
						displayResizingMenu: false,
						displaySortingMenu: false,
						displayVisibilityMenu: false,
						adjustmentMenu: {
							display: false
						}
					}
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
			<Datagrid.Header {column}>
				{#snippet filter()}
					<Datagrid.ColumnFilter {column} />
				{/snippet}
			</Datagrid.Header>
		{/each}
	{/snippet}
	{#snippet body()}
		{#each datagrid.internal.paginatedData as row, rowIndex}
			<Datagrid.Row {rowIndex}>
				{#each datagrid.columns as column, columnIndex}
					<Datagrid.Cell {column} {row} {columnIndex} {rowIndex}></Datagrid.Cell>
				{/each}
			</Datagrid.Row>
		{/each}
	{/snippet}
</Datagrid.Datagrid>
