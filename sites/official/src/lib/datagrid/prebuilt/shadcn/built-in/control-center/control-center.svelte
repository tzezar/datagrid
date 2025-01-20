<script lang="ts">
	import { buttonVariants } from '$lib/components/ui/button';
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu/index.js';
	import AdGroupOutlineSharp from '$lib/datagrid/icons/material-symbols/ad-group-outline-sharp.svelte';
	import Settings from '$lib/datagrid/icons/material-symbols/settings.svelte';
	import type { TzezarsDatagrid } from '../../core/index.svelte';
	import ColumnFreezing from './column-freezing.svelte';
	import ColumnGroupsVisibility from './column-groups-visibility.svelte';
	import ColumnReordering from './column-reordering.svelte';
	import ColumnResizing from './column-resizing.svelte';
	import ColumnVisibility from './column-visibility.svelte';
	import ColumnGroupsCreation from './column-groups-creation.svelte';
	import DataExporting from './data-exporting.svelte';
	import GroupingDropdown from './grouping-dropdown.svelte';
	import Sorting from './sorting.svelte';

	type Props = {
		datagrid: TzezarsDatagrid<any>;
	};

	const { datagrid }: Props = $props();

	const showColumnGroupingSeparator = $derived(
		datagrid.extra.features.groupHeadersVisibility.showGroupHeaders ||
			datagrid.extra.features.grouping.enabled
	);
</script>

{#if datagrid.extra.features.controlCenter.enabled}
	<DropdownMenu.Root>
		<DropdownMenu.Trigger
			class={`${buttonVariants({ variant: 'outline' })} rounded-none border-b-0`}
		>
			<Settings />
		</DropdownMenu.Trigger>
		<DropdownMenu.Content class="w-56">
			<DropdownMenu.Group>
				<DropdownMenu.GroupHeading>Datagrid control center</DropdownMenu.GroupHeading>
				<DropdownMenu.Separator />
				<DropdownMenu.Group>
					{#if datagrid.extra.features.sorting.enableSorting}
						<Sorting {datagrid} />
					{/if}

					{#if datagrid.extra.features.columnOrdering.enabled}
						<ColumnReordering {datagrid} />
					{/if}

					{#if datagrid.extra.features.columnPinning.enabled}
						<ColumnFreezing {datagrid} />
					{/if}
					{#if datagrid.extra.features.columnSizing.enabled}
						<ColumnResizing {datagrid} />
					{/if}

					{#if datagrid.extra.features.columnVisibility.enabled}
						<ColumnVisibility {datagrid} />
					{/if}

					{#if datagrid.extra.features.exporting.enableExporting}
						<DataExporting {datagrid} />
					{/if}

					{#if showColumnGroupingSeparator}
						<DropdownMenu.Separator />
					{/if}

					{#if datagrid.extra.features.groupHeadersVisibility.enableColumnGroupsCreation}
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

					{#if datagrid.extra.features.groupHeadersVisibility.enableGroupHeadersHiding}
						<ColumnGroupsVisibility {datagrid} />
					{/if}
					<DropdownMenu.Separator />
					{#if datagrid.extra.features.grouping.enabled}
						<DropdownMenu.GroupHeading>Data grouping</DropdownMenu.GroupHeading>
						<GroupingDropdown {datagrid} />
					{/if}
				</DropdownMenu.Group>
			</DropdownMenu.Group>
		</DropdownMenu.Content>
	</DropdownMenu.Root>
{/if}
