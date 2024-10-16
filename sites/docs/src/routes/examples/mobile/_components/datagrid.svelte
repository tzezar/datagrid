<script lang="ts">
	import { setContext } from 'svelte';
	import { columns } from './columns.svelte';
	import { inventoryData as data } from '$lib/data/inventory';
	import { TzezarDatagrid } from '$lib/datagrid/tzezar-datagrid.svelte';
	import * as Datagrid from '$lib/datagrid';
	import { getNestedValue } from '$lib/datagrid/fns/get-nested-value';
	import { SvelteSet } from 'svelte/reactivity';
	import { selectRow } from '$lib/datagrid/fns/select-row';
	import { cn } from '$lib/utils';
	import { isRowIdInSelectedRowsSet } from '$lib/datagrid/fns/is-row-id-in-selected-rows-set';
	import HeaderRowSelectionDropdown from '$lib/datagrid/shadcn/header-row-selection-dropdown.svelte';
	import SelectRowsMenu from './select-rows-menu.svelte';

	let datagrid = setContext(
		'datagrid',
		new TzezarDatagrid({
			data: data.slice(0, 1000),
			columns,
			state: {
				pagination: {
					page: 1,
					count: 1000,
					perPage: 18
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

{#snippet head()}{/snippet}

<Datagrid.Datagrid {head} class={{ content: 'grid grid-cols-3 border-0 border-b', }}>
	{#snippet body()}
		{#each datagrid.internal.paginatedData as row, rowIndex}
			<Datagrid.Row
				disableTailwindGroup
				onclick={() => selectRow(row, datagrid)}
				class={` ${Datagrid.STAY_IN_PLACE} ${Datagrid.HIDE_BEHIND_PARENT_ROW} last:pb-10 border-0 p-4`}
				{rowIndex}
			>
				<div class="min-w-full">
					{#each datagrid.columns as column, columnIndex}
						{@const props = { row, rowIndex, column, columnIndex }}
						<Datagrid.Cell
							{...props}
							class={{
								cell: cn(
									' transition-all first:rounded-t-xl last:rounded-b-xl last:shadow-lg bg-table-primary grid min-w-full max-w-fit grid-cols-2 border-b last:border-b-orange-500 hover:bg-orange-400/20 group-hover/row:bg-none',
									isRowIdInSelectedRowsSet(row.id, datagrid.internal.selectedRowIds) &&
										'bg-orange-400/20'
								)
							}}
						>
							<span>{column.title}</span>
							<span>{getNestedValue(row, column.id)}</span>
						</Datagrid.Cell>
					{/each}
				</div>
			</Datagrid.Row>
		{/each}
	{/snippet}
</Datagrid.Datagrid>

<div class="flex w-fit pt-8">
	<SelectRowsMenu />
</div>
<h1 class="pt-8">Selected</h1>
<pre class="max-h-[400px] overflow-auto pb-8 z-5">
	{JSON.stringify(datagrid.state.selectedRows, null, 4)}
</pre>

<style>
</style>
