<script lang="ts">
	import GroupTitle from './group-title.svelte';
	import GroupItem from './group-item.svelte';
	import Group from './group.svelte';
	import { hrefs } from '$lib/hrefs';
</script>

<div class="flex w-full flex-col">
	<div class="flex w-full flex-col gap-8 p-8">
		<GroupTitle
			title="Headless"
			class="border-b-2 border-orange-400 pb-1 text-lg text-orange-400"
		/>
		<Group>
			<GroupTitle title="Quick start" />
			<GroupItem disabled title="Installation" href={''} />
			<GroupItem title="Getting started" href={hrefs.headless.quickStart.gettingStarted} />
		</Group>
		<Group>
			<GroupTitle title="Examples" />
			<GroupItem title="Basic" href={hrefs.headless.examples.basic} />
			<GroupItem title="Header groups" href={hrefs.headless.examples.headerGroups} />
			<GroupItem title="Column filters" href={hrefs.headless.examples.columnFilters} />
			<GroupItem
				title="Column filters faceted"
				href={hrefs.headless.examples.columnFiltersFaceted}
			/>
			<GroupItem title="Column ordering" href={hrefs.headless.examples.columnOrdering} />
			<GroupItem title="Column pinning" href={hrefs.headless.examples.columnPinning} />
			<GroupItem
				title="Column pinning detached"
				href={hrefs.headless.examples.columnPinningDetached}
			/>
			<GroupItem title="Column sizing" href={hrefs.headless.examples.columnSizing} />
			<GroupItem title="Column visibility" href={hrefs.headless.examples.columnVisibility} />
			<GroupItem title="Grouping" href={hrefs.headless.examples.grouping} />
			<GroupItem title="Pagination" href={hrefs.headless.examples.pagination} />
			<GroupItem title="Pagination on backend" href={hrefs.headless.examples.paginationOnBackend} />
			<GroupItem title="Row expanding" href={hrefs.headless.examples.rowExpanding} />
			<GroupItem title="Row pinning" href={hrefs.headless.examples.rowPinning} />
			<GroupItem title="Row selection" href={hrefs.headless.examples.rowSelection} />
			<GroupItem title="Sorting" href={hrefs.headless.examples.sorting} />
			<GroupItem title="Sub components" href={hrefs.headless.examples.subComponents} />
			<GroupItem title="Virtualized" href={hrefs.headless.examples.virtualized} />
		</Group>
		<GroupTitle
			title="Enhanced"
			class="border-b-2 border-orange-400 pb-1 text-lg text-orange-400"
		/>
		<GroupItem title="Interactive demo" href={hrefs.enhanced.interactiveDemo} />
		<Group>
			<GroupTitle title="Quick start" />
			<GroupItem disabled title="Installation" href={''} />
			<GroupItem disabled title="Getting started" href={''} />
		</Group>

		<!-- <GroupTitle
			title="Headless"
			class="border-b-2 border-orange-400 pb-1 text-lg text-orange-400"
		/>
		<Group>
			<GroupTitle title="Quick start" />
			<GroupItem disabled title="Installation" href={hrefs.headless.quickStart.installation} />
			<GroupItem disabled title="Getting started" href={hrefs.headless.quickStart.gettingStarted} />
		</Group>
		<Group>
			<GroupTitle title="Guides" />
			<GroupItem disabled title="Column definition" href={hrefs.headless.quickStart.installation} />
			<GroupItem disabled title="Column manager" href={hrefs.headless.quickStart.installation} />
			<GroupItem disabled title="Row manager" href={hrefs.headless.quickStart.installation} />
			<GroupItem disabled title="Cache manager" href={hrefs.headless.quickStart.installation} />
			<GroupItem disabled title="Data processor" href={hrefs.headless.quickStart.installation} />
			<GroupItem disabled title="Column processor" href={hrefs.headless.quickStart.installation} />
			<GroupItem disabled title="Lifecycle hooks" href={hrefs.headless.quickStart.installation} />
			<GroupItem disabled title="Handlers" href={hrefs.headless.quickStart.installation} />
		</Group>
		<Group>
			<GroupTitle title="Features" />
			<GroupItem disabled title="Grouping" href={hrefs.headless.quickStart.installation} />
			<GroupItem disabled title="Sorting" href={hrefs.headless.quickStart.installation} />
			<GroupItem disabled title="Pagination" href={hrefs.headless.quickStart.installation} />
			<GroupItem disabled title="Global search" href={hrefs.headless.quickStart.installation} />
			<GroupItem disabled title="Column faceting" href={hrefs.headless.quickStart.installation} />
			<GroupItem disabled title="Column filtering" href={hrefs.headless.quickStart.installation} />
			<GroupItem disabled title="Column grouping" href={hrefs.headless.quickStart.installation} />
			<GroupItem disabled title="Column ordering" href={hrefs.headless.quickStart.installation} />
			<GroupItem disabled title="Column pinning" href={hrefs.headless.quickStart.installation} />
			<GroupItem disabled title="Column sizing" href={hrefs.headless.quickStart.installation} />
			<GroupItem disabled title="Column visibility" href={hrefs.headless.quickStart.installation} />
			<GroupItem disabled title="Row expanding" href={hrefs.headless.quickStart.installation} />
			<GroupItem disabled title="Row pinning" href={hrefs.headless.quickStart.installation} />
			<GroupItem disabled title="Row selection" href={hrefs.headless.quickStart.installation} />
		</Group>
		<Group>
			<GroupTitle title="Examples" />
			<GroupItem title="Basic" href={hrefs.headless.examples.basic} />
			<GroupItem title="Column filters" href={hrefs.headless.examples.columnFilters} />
			<GroupItem
				title="Column filters faceted"
				href={hrefs.headless.examples.columnFiltersFaceted}
			/>

			<GroupItem title="Editable data" href={hrefs.headless.examples.editableData} />
			<GroupItem title="Grouping" href={hrefs.headless.examples.grouping} />
			<GroupItem title="Pagination" href={hrefs.headless.examples.pagination} />
			<GroupItem title="Sorting" href={hrefs.headless.examples.sorting} />
			<GroupItem title="Search" href={hrefs.headless.examples.search} />
			<GroupItem title="Virtualization" href={hrefs.headless.examples.virtualization} />

			<GroupItem title="Column ordering" href={hrefs.headless.examples.columnOrdering} />
			<GroupItem title="Column pinning" href={hrefs.headless.examples.columnPinning} />
			<GroupItem title="Column sizing" href={hrefs.headless.examples.columnSizing} />
			<GroupItem title="Column visibility" href={hrefs.headless.examples.columnVisibility} />
			<GroupItem title="Row expanding" href={hrefs.headless.examples.rowExpanding} />
			<GroupItem title="Row selection" href={hrefs.headless.examples.rowSelection} />
			<GroupItem title="Row pinning" href={hrefs.headless.examples.rowPinning} />
		</Group>
		<!-- <Group>
			<GroupTitle title="Feature APIs" />
			<GroupItem title="Column manager" href={hrefs.headless.featureApis.columnManager} />
			<GroupItem title="Column processor" href={hrefs.headless.featureApis.columnProcessor} />
			<GroupItem title="Data processor" href={hrefs.headless.featureApis.dataProcessor} />
			<GroupItem title="Filtering manager" href={hrefs.headless.featureApis.filteringManager} />
			<GroupItem title="Grouping manager" href={hrefs.headless.featureApis.groupingManager} />
			<GroupItem title="Pagination manager" href={hrefs.headless.featureApis.paginationManager} />
			<GroupItem title="Row manager" href={hrefs.headless.featureApis.rowManager} />
			<GroupItem title="Sorting manager" href={hrefs.headless.featureApis.sortingManager} />
			<GroupItem title="Grid instance" href={hrefs.headless.featureApis.gridInstance} />
		</Group> -->
		<!-- <GroupTitle
			title="Enhanced"
			class="border-b-2 border-orange-400 pb-1 text-lg text-orange-400"
		/>
		<Group>
			<GroupTitle title="Quick start" />
			<GroupItem disabled title="Installation" href={hrefs.headless.quickStart.installation} />
			<GroupItem disabled title="Getting started" href={hrefs.headless.quickStart.gettingStarted} />
		</Group>
		<Group>
			<GroupTitle title="Playground" />
			<GroupItem
				disabled
				title="Perfomance showcase"
				href={hrefs.headless.quickStart.installation}
			/>
		</Group>
		<Group>
			<GroupTitle title="Examples" />
			<GroupItem title="Basic" href={hrefs.enhanced.examples.basic} />
			<GroupItem title="Column alignment" href={hrefs.enhanced.examples.columnAlignment} />
			<GroupItem title="Column filters" href={hrefs.enhanced.examples.columnFilters} />
			<GroupItem
				title="Column filters faceted"
				href={hrefs.enhanced.examples.columnFiltersFaceted}
			/>
			<GroupItem title="Column ordering" href={hrefs.enhanced.examples.columnOrdering} />
			<GroupItem title="Column pinning" href={hrefs.enhanced.examples.columnPinning} />
			<GroupItem title="Column sizing" href={hrefs.enhanced.examples.columnSizing} />
			<GroupItem title="Column visibility" href={hrefs.enhanced.examples.columnVisibility} />
			<GroupItem title="Context menu" href={hrefs.enhanced.examples.contextMenu} />
			<GroupItem title="Copying data" href={hrefs.enhanced.examples.copyingData} />
			<GroupItem title="Editable data" href={hrefs.enhanced.examples.editableData} />
			<GroupItem title="Exporting data" href={hrefs.enhanced.examples.exportingData} />
			<GroupItem title="Fullscreen" href={hrefs.enhanced.examples.fullscreen} />
			<GroupItem title="Fully controlled" href={hrefs.enhanced.examples.fullyControlled} />
			<GroupItem title="Grouping" href={hrefs.enhanced.examples.grouping} />
			<GroupItem title="Pagination" href={hrefs.enhanced.examples.pagination} />
			<GroupItem
				disabled
				title="Pagination controlled"
				href={hrefs.enhanced.examples.paginationControlled}
			/>
			<GroupItem title="Row expanding" href={hrefs.enhanced.examples.expanding} />
			<GroupItem title="Row selection" href={hrefs.enhanced.examples.rowSelection} />
			<GroupItem title="Scroll to top" href={hrefs.enhanced.examples.scrollToTop} />
			<GroupItem title="Sorting" href={hrefs.enhanced.examples.sorting} />
			<GroupItem title="Spacing" href={hrefs.enhanced.examples.spacing} />
			<GroupItem title="Status indicator" href={hrefs.enhanced.examples.statusIndicator} />
			<GroupItem title="Sub components" href={hrefs.enhanced.examples.subComponents} />
			<GroupItem title="Text sizing" href={hrefs.enhanced.examples.textSizing} />
			<GroupItem title="Virtualization" href={hrefs.enhanced.examples.virtualization} />
		</Group> -->
	</div>
</div>
