<script lang="ts">
	import GroupTitle from './group-title.svelte';
	import GroupItem from './group-item.svelte';
	import Group from './group.svelte';
	import { hrefs } from '$lib/hrefs';
</script>

<div class="flex w-full flex-col">
	<div class="flex w-full flex-col gap-8 p-8">
		<GroupTitle title="Headless" class="border-b-2 border-orange-400 pb-1 text-orange-400 text-lg" />
		<Group>
			<GroupTitle title="Quick start" />
			<GroupItem disabled title="Installation" href={hrefs.headless.quickStart.installation} />
			<GroupItem disabled title="Getting started" href={hrefs.headless.quickStart.gettingStarted} />
		</Group>
		<Group>
			<GroupTitle title="Examples" />
			<GroupItem title="basic" href={hrefs.headless.examples.basic} />
			<GroupItem title="Column filters" href={hrefs.headless.examples.columnFilters} />
			<GroupItem title="Column filters faceted" href={hrefs.headless.examples.columnFiltersFaceted} />
			<GroupItem title="Column ordering" href={hrefs.headless.examples.columnOrdering} />
			<GroupItem title="Column pinning" href={hrefs.headless.examples.columnPinning} />
			<GroupItem title="Column sizing" href={hrefs.headless.examples.columnSizing} />
			<GroupItem title="Column visibility" href={hrefs.headless.examples.columnVisibility} />
			<GroupItem title="Editable data" href={hrefs.headless.examples.editableData} />
			<GroupItem title="Expanding" href={hrefs.headless.examples.expanding} />
			<GroupItem title="Fully controlled" href={hrefs.headless.examples.fullyControlled} disabled/>
			<GroupItem title="Grouping" href={hrefs.headless.examples.grouping} />
			<GroupItem title="Pagination" href={hrefs.headless.examples.pagination} />
			<GroupItem title="Pagination controlled" href={hrefs.headless.examples.paginationControlled} />
			<GroupItem title="Row selection" href={hrefs.headless.examples.rowSelection} />
			<GroupItem title="Sorting" href={hrefs.headless.examples.sorting} />
			<!-- <GroupItem title="Sub components" href={hrefs.headless.examples.subComponents} /> -->
			<GroupItem title="Virtualization" href={hrefs.headless.examples.virtualization} />
		</Group>
		<Group>
			<GroupTitle title="Feature APIs" />
			<GroupItem disabled title="Column faceting" href={hrefs.headless.featureApis.columnFaceting} />
			<GroupItem disabled title="Column filters" href={hrefs.headless.featureApis.columnFilters} />
			<GroupItem disabled title="Column ordering" href={hrefs.headless.featureApis.columnOrdering} />
			<GroupItem disabled title="Column pinning" href={hrefs.headless.featureApis.columnPinning} />
			<GroupItem disabled title="Column sizing" href={hrefs.headless.featureApis.columnSizing} />
			<GroupItem disabled title="Column visibility" href={hrefs.headless.featureApis.columnVisibility} />
			<GroupItem disabled title="Expanding" href={hrefs.headless.featureApis.expanding} />
			<GroupItem disabled title="Global search" href={hrefs.headless.featureApis.globalSearch} />
			<GroupItem disabled title="Grouping" href={hrefs.headless.featureApis.grouping} />
			<GroupItem disabled title="Pagination" href={hrefs.headless.featureApis.pagination} />
			<GroupItem disabled title="Row pinning" href={hrefs.headless.featureApis.rowPinning} />
			<GroupItem disabled title="Row selection" href={hrefs.headless.featureApis.rowSelection} />
			<GroupItem disabled title="Sorting" href={hrefs.headless.featureApis.sorting} />
		</Group>
		<GroupTitle title="Shadcn svelte" class="border-b-2 border-orange-400 pb-1 text-orange-400 text-lg" />
		<Group>
			<GroupTitle title="Quick start" />
			<GroupItem disabled title="Installation" href={hrefs.headless.quickStart.installation} />
			<GroupItem disabled title="Getting started" href={hrefs.headless.quickStart.gettingStarted} />
		</Group>
		<Group>
			<GroupTitle title="Playground" />
			<GroupItem disabled title="Perfomance showcase" href={hrefs.headless.quickStart.installation} />
		</Group>
		<Group>
			<GroupTitle title="Examples" />
			<GroupItem disabled title="basic" href={hrefs.headless.quickStart.installation} />
			<GroupItem disabled title="Column alignment" href={hrefs.headless.quickStart.installation} />
			<GroupItem disabled title="Column filters" href={hrefs.headless.quickStart.installation} />
			<GroupItem disabled title="Column filters faceted" href={hrefs.headless.quickStart.installation} />
			<GroupItem disabled title="Column ordering" href={hrefs.headless.quickStart.installation} />
			<GroupItem disabled title="Column pinning" href={hrefs.headless.quickStart.installation} />
			<GroupItem disabled title="Column sizing" href={hrefs.headless.quickStart.installation} />
			<GroupItem disabled title="Column visibility" href={hrefs.headless.quickStart.installation} />
			<GroupItem disabled title="Context menu" href={hrefs.headless.quickStart.installation} />
			<GroupItem disabled title="Copying data" href={hrefs.headless.quickStart.installation} />
			<GroupItem disabled title="Editable data" href={hrefs.headless.quickStart.installation} />
			<GroupItem disabled title="Expanding" href={hrefs.headless.quickStart.installation} />
			<GroupItem disabled title="Exporting data" href={hrefs.headless.quickStart.installation} />
			<GroupItem disabled title="Fullscreen" href={hrefs.headless.quickStart.installation} />
			<GroupItem disabled title="Fully controlled" href={hrefs.headless.quickStart.installation} />
			<GroupItem disabled title="Grouping" href={hrefs.headless.quickStart.installation} />
			<GroupItem disabled title="Pagination" href={hrefs.headless.quickStart.installation} />
			<GroupItem disabled title="Pagination controlled" href={hrefs.headless.quickStart.installation} />
			<GroupItem disabled title="Row selection" href={hrefs.headless.quickStart.installation} />
			<GroupItem disabled title="Scroll to top" href={hrefs.headless.quickStart.installation} />
			<GroupItem disabled title="Sorting" href={hrefs.headless.quickStart.installation} />
			<GroupItem disabled title="Spacing" href={hrefs.headless.quickStart.installation} />
			<GroupItem disabled title="Status indicator" href={hrefs.headless.quickStart.installation} />
			<GroupItem disabled title="Sub components" href={hrefs.headless.quickStart.installation} />
			<GroupItem disabled title="Text sizing" href={hrefs.headless.quickStart.installation} />
			<GroupItem disabled title="Virtualization" href={hrefs.headless.quickStart.installation} />
		</Group>
		<!-- 
		<Group>
			<GroupTitle title="quick start" />
			<GroupItem title="installation" href={hrefs.quickStart.installation} />
			<GroupItem title="getting started" href={hrefs.quickStart.gettingStarted} />
		</Group>
		<Group>
			<GroupTitle title="examples" />
			<GroupItem title="mobile" href={hrefs.examples.mobile} />
			<GroupItem title="minimal" href={hrefs.examples.minimal} />
			<GroupItem title="basic" href={hrefs.examples.basic} />
			<GroupItem title="advanced" href={hrefs.examples.advanced} />
		</Group>
		<Group>
			<GroupTitle title="fundamentals" />
			<GroupItem title="typescript" href={hrefs.fundamentals.typescript} />
			<GroupItem title="customization" href={hrefs.fundamentals.customization} />
		</Group>
		<Group>
			<GroupTitle title="feature guides" />
			<GroupItem title="column freezing" href={hrefs.guides.featureGuides.columnFreezing} />
			<GroupItem title="column hiding" href={hrefs.guides.featureGuides.columnHiding} />
			<GroupItem title="column ordering" href={hrefs.guides.featureGuides.columnOrdering} />
			<GroupItem title="column resizing" href={hrefs.guides.featureGuides.columnResizing} />
			<GroupItem title="column aligment" href={hrefs.guides.featureGuides.columnAlignment} />
			<GroupItem title="row expanding" href={hrefs.guides.featureGuides.rowExpanding} />
			<GroupItem title="row selection" href={hrefs.guides.featureGuides.rowSelection} />
			<GroupItem title="pagination" href={hrefs.guides.featureGuides.pagination} />
			<GroupItem title="sorting" href={hrefs.guides.featureGuides.sorting} />
			<GroupItem title="filtering" href={hrefs.guides.featureGuides.filtering} />

			<GroupItem title="data copying" href={hrefs.guides.featureGuides.dataCopying} />
			<GroupItem title="data exporting" href={hrefs.guides.featureGuides.dataExporting} />
			<GroupItem title="context menu" href={hrefs.guides.featureGuides.contextMenu} />
			<GroupItem title="fullscreen mode" href={hrefs.guides.featureGuides.fullscreenToggle} />
			<GroupItem title="status indicator" href={hrefs.guides.featureGuides.statusIndicator} />
			<GroupItem title="scroll to top" href={hrefs.guides.featureGuides.scrollToTop} />
			<GroupItem title="sticky rows" href={hrefs.guides.featureGuides.stickyRows} />
			<GroupItem title="footer" href={hrefs.guides.featureGuides.footer} />
			<GroupItem
				disabled
				title="adjusting spacing"
				href={hrefs.guides.featureGuides.adjustingSpacing}
			/>
			<GroupItem
				disabled
				title="adjusting text size"
				href={hrefs.guides.featureGuides.adjustingTextSize}
			/>
			<GroupItem disabled title="sticky header" href={hrefs.guides.featureGuides.stickyHeader} />

	
		</Group>
		<Group>
			<GroupTitle title="experimental" />
			<GroupItem title="grouping & aggregating" href="/experimental/grouping-aggregating-preview" />
		</Group> -->
	</div>
</div>
