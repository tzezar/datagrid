<script lang="ts">
	import { buttonVariants } from '$lib/components/ui/button';
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu/index.js';
	import AdGroupOutlineSharp from '$lib/datagrid/icons/material-symbols/ad-group-outline-sharp.svelte';
	import Settings from '$lib/datagrid/icons/material-symbols/settings.svelte';
	import type { EnhancedDatagrid } from '../../core/index.svelte';
	import ColumnFreezing from './column-freezing.svelte';
	import ColumnGroupsVisibility from './column-groups-visibility.svelte';
	import ColumnReordering from './column-reordering.svelte';
	import ColumnResizing from './column-resizing.svelte';
	import ColumnVisibility from './column-visibility.svelte';
	import ColumnGroupsCreation from './column-groups-creation.svelte';
	import DataExporting from './data-exporting.svelte';
	import GroupingDropdown from './grouping-dropdown.svelte';
	import Sorting from './sorting.svelte';
	import type { ColumnMetaEnhanced } from '../../core/types';

	type Props = {
		datagrid: EnhancedDatagrid<any, ColumnMetaEnhanced<any>>;
	};

	const { datagrid }: Props = $props();
</script>

{#if datagrid.extra.features.controlCenter.displayControlCenter}
	<DropdownMenu.Root>
		<DropdownMenu.Trigger
			class={`${buttonVariants({ variant: 'outline' })} rounded-none border-b-0 border-t-0  border-r-0 !border-grid-border`}
		>
			<Settings />
		</DropdownMenu.Trigger>
		<DropdownMenu.Content class="w-56">
			<DropdownMenu.Group>
				<DropdownMenu.GroupHeading>Datagrid control center</DropdownMenu.GroupHeading>
				<DropdownMenu.Separator />
				<DropdownMenu.Group>
					{#if datagrid.extra.features.sorting.enableInControlCenter && datagrid.extra.features.sorting.enableInControlCenter === true}
						<Sorting {datagrid} />
					{/if}

					{#if datagrid.extra.features.columnOrdering.enableInControlCenter}
						<ColumnReordering {datagrid} />
					{/if}

					{#if datagrid.extra.features.columnPinning.enableInControlCenter}
						<ColumnFreezing {datagrid} />
					{/if}
					{#if datagrid.extra.features.columnSizing.enableInControlCenter}
						<ColumnResizing {datagrid} />
					{/if}

					{#if datagrid.extra.features.columnVisibility.displayControlCenterControls}
						<ColumnVisibility {datagrid} />
					{/if}

					{#if datagrid.extra.features.exporting.enableExporting}
						<DataExporting {datagrid} />
					{/if}

					{#if datagrid.extra.features.columnGroups.enableColumnGroupsCreation}
						<DropdownMenu.Separator />
						<DropdownMenu.Sub>
							<DropdownMenu.SubTrigger>
								<AdGroupOutlineSharp class="mr-2 size-4" />
								<span>Create column group</span>
							</DropdownMenu.SubTrigger>
							<DropdownMenu.SubContent>
								<ColumnGroupsCreation {datagrid} />
							</DropdownMenu.SubContent>
						</DropdownMenu.Sub>
					{/if}

					{#if datagrid.extra.features.columnGroups.enableGroupHeadersToggling}
						<ColumnGroupsVisibility {datagrid} />
					{/if}
					{#if datagrid.extra.features.grouping.enableInControlCenter}
						<DropdownMenu.Separator />
						<DropdownMenu.GroupHeading>Group data by column</DropdownMenu.GroupHeading>
						<GroupingDropdown {datagrid} />
					{/if}
				</DropdownMenu.Group>
			</DropdownMenu.Group>
		</DropdownMenu.Content>
	</DropdownMenu.Root>
{/if}
