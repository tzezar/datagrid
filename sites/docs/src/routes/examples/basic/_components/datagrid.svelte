<script lang="ts">
	import { setContext } from 'svelte';
	import { columns } from './columns.svelte';
	import { inventoryData as data } from '$lib/data/inventory';

	import { TzezarDatagrid } from '$lib/datagrid/tzezar-datagrid.svelte';
	import * as Datagrid from '$lib/datagrid';

	let datagrid = setContext(
		`datagrid`,
		new TzezarDatagrid({
			title: 'Inventory',
			data,
			columns,
			options: {
				pagination: { display: true },
				rows: { striped: true },
				topbar: {
					display: true,
					displayFullscreenToggle: false,
					displayExportDataMenu: false,
					displayCopyDataMenu: false,
					displayHeadFilterToggle: false,
					settingsMenu: {
						display: false,
						displaySortingMenu: true,
						displayReorderingMenu: true,
						displayFreezingMenu: true,
						displayResizingMenu: true,
						displayVisibilityMenu: true,
						adjustmentMenu: {
							display: true,
							displaySpacingMenu: true,
							displayTextSizeMenu: true
						}
					}
				}
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
		{#each datagrid.internal.paginatedData as row, rowIndex}
			<Datagrid.Row {rowIndex}>
				{#each datagrid.columns as column, columnIndex}
					<Datagrid.Cell {columnIndex} {rowIndex} {column} {row} />
				{/each}
			</Datagrid.Row>
		{/each}
	{/snippet}
</Datagrid.Datagrid>
