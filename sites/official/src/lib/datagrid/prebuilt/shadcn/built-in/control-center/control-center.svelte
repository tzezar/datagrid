<script lang="ts">
	import { buttonVariants } from '$lib/components/ui/button';
    import * as DropdownMenu from '$lib/components/ui/dropdown-menu/index.js';
	import AdGroupOutlineSharp from '$lib/datagrid/icons/material-symbols/ad-group-outline-sharp.svelte';
	import ExpandLess from '$lib/datagrid/icons/material-symbols/expand-less.svelte';
	import ExpandMore from '$lib/datagrid/icons/material-symbols/expand-more.svelte';
	import Settings from '$lib/datagrid/icons/material-symbols/settings.svelte';
	import type { TzezarsDatagrid } from '../../core/index.svelte';
	import ColumnFreezing from './column-freezing.svelte';
	import ColumnReordering from './column-reordering.svelte';
	import ColumnResizing from './column-resizing.svelte';
	import ColumnVisibility from './column-visibility.svelte';
	import CreateGrouping from './create-grouping.svelte';
	import Exporting from './exporting.svelte';
	import GroupingDropdown from './grouping-dropdown.svelte';
	import Sorting from './sorting.svelte';

    type Props = {
        datagrid: TzezarsDatagrid<any>;
    }

    const { datagrid }: Props = $props();


</script>


<DropdownMenu.Root>
	<DropdownMenu.Trigger class={`${buttonVariants({ variant: 'outline' })} rounded-none border-b-0`}>
		<Settings />
	</DropdownMenu.Trigger>
	<DropdownMenu.Content class="w-56">
		<DropdownMenu.Group>
			<DropdownMenu.GroupHeading>Datagrid control center</DropdownMenu.GroupHeading>
			<DropdownMenu.Separator />
			<DropdownMenu.Group>
				<Sorting {datagrid} />
				<ColumnReordering {datagrid} />
				<ColumnFreezing {datagrid} />
				<ColumnResizing {datagrid} />
				<ColumnVisibility  {datagrid} />
				<Exporting {datagrid} />

				<DropdownMenu.Separator />
				<DropdownMenu.Sub>
					<DropdownMenu.SubTrigger>
						<AdGroupOutlineSharp class="mr-2 size-4" />
						<span>Create column group</span>
					</DropdownMenu.SubTrigger>
					<DropdownMenu.SubContent>
						<CreateGrouping {datagrid} />
					</DropdownMenu.SubContent>
				</DropdownMenu.Sub>
				<DropdownMenu.Item
					closeOnSelect={false}
					onclick={() => datagrid.extra.features.groupHeadersVisibility.toggleGroupHeaders()}
				>
					{#if datagrid.extra.features.groupHeadersVisibility.showGroupHeaders}
						<ExpandLess class="mr-2 size-4" />
						Hide column groups
					{:else}
						<ExpandMore class="mr-2 size-4" />
						Show column groups
					{/if}
				</DropdownMenu.Item>
				<DropdownMenu.Separator />
				<DropdownMenu.GroupHeading>Data grouping</DropdownMenu.GroupHeading>
				<GroupingDropdown {datagrid} />
			</DropdownMenu.Group>
			<!-- <DropdownMenu.Separator /> -->
		</DropdownMenu.Group>
	</DropdownMenu.Content>
</DropdownMenu.Root>
