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
			data: data.slice(0, 1000),
			columns,
			state: {
				pagination: {
					page: 1,
					count: 1000,
					perPage: 5
				}
			},
			options: {
				pagination: { display: true },
				topbar: {
					display: true,
					displayCopyDataMenu: true,
					displayExportDataMenu: true,
					displayFullscreenToggle: true,
					displayHeadFilterToggle: false,
					settingsMenu: {
						display: true,
						displayResizingMenu: false,
						displayFreezingMenu: false
					}
				}
			}
		})
	);
</script>

<Datagrid.Datagrid>
	{#snippet body()}
		{#each datagrid.state.processedData as row, rowIndex}
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
		{/each}
	{/snippet}
</Datagrid.Datagrid>
