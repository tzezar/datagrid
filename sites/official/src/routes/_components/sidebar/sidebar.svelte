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
		<GroupTitle
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
