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
			<GroupItem disabled title="Installation" href={hrefs.headless.quickStart.installation} />
			<GroupItem disabled title="Getting started" href={hrefs.headless.quickStart.gettingStarted} />
		</Group>
		<Group>
			<GroupTitle title="Examples" />
			<GroupItem  title="Basic" href={hrefs.headless.examples.basic} />
			<GroupItem disabled title="Column filters" href={hrefs.headless.examples.columnFilters} />
			<GroupItem
				disabled
				title="Column filters faceted"
				href={hrefs.headless.examples.columnFiltersFaceted}
			/>
			<GroupItem  title="Column ordering" href={hrefs.headless.examples.columnOrdering} />
			<GroupItem disabled title="Column pinning" href={hrefs.headless.examples.columnPinning} />
			<GroupItem title="Column sizing" href={hrefs.headless.examples.columnSizing} />
			<GroupItem
				
				title="Column visibility"
				href={hrefs.headless.examples.columnVisibility}
			/>
			<GroupItem disabled title="Editable data" href={hrefs.headless.examples.editableData} />
			<GroupItem  title="Row expanding" href={hrefs.headless.examples.rowExpanding} />
			<GroupItem disabled title="Fully controlled" href={hrefs.headless.examples.fullyControlled} />
			<GroupItem title="Grouping" href={hrefs.headless.examples.grouping} />
			<GroupItem title="Pagination" href={hrefs.headless.examples.pagination} />
			<GroupItem
				disabled
				title="Pagination controlled"
				href={hrefs.headless.examples.paginationControlled}
			/>
			<GroupItem title="Row selection" href={hrefs.headless.examples.rowSelection} />
			<GroupItem title="Sorting" href={hrefs.headless.examples.sorting} />
			<!-- <GroupItem title="Sub components" href={hrefs.headless.examples.subComponents} /> -->
			<GroupItem disabled title="Virtualization" href={hrefs.headless.examples.virtualization} />
			<GroupItem disabled title="Kitchen sink" href={hrefs.headless.examples.kitchenSink} />
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
		<GroupTitle
			title="Shadcn svelte"
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
			<GroupItem disabled title="Basic" href={hrefs.shadcnSvelte.examples.basic} />
			<GroupItem disabled title="Column alignment" href={hrefs.headless.quickStart.installation} />
			<GroupItem disabled title="Column filters" href={hrefs.headless.quickStart.installation} />
			<GroupItem
				disabled
				title="Column filters faceted"
				href={hrefs.headless.quickStart.installation}
			/>
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
			<GroupItem
				disabled
				title="Pagination controlled"
				href={hrefs.headless.quickStart.installation}
			/>
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
