<script lang="ts">
	import GroupTitle from './group-title.svelte';
	import GroupItem from './group-item.svelte';
	import Group from './group.svelte';
	import { hrefs } from '$lib/hrefs';
</script>

<div class="flex w-full flex-col">
	<div class="flex w-full flex-col gap-8 p-8">
		<Group>
			<GroupItem title="about" href={hrefs.about} />
			<GroupItem title="features" href={hrefs.features} />
		</Group>
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
			<!-- <GroupItem title="client data" href={hrefs.examples.clientData} disabled /> -->
			<GroupItem disabled title="svelte query" href={hrefs.examples.svelteQuery} />
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
			<GroupItem  title="filtering" href={hrefs.guides.featureGuides.filtering} />
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
			<GroupItem  title="data copying" href={hrefs.guides.featureGuides.dataCopying} />
			<GroupItem  title="data exporting" href={hrefs.guides.featureGuides.dataExporting} />
			<GroupItem title="context menu" href={hrefs.guides.featureGuides.contextMenu} />
			<GroupItem title="fullscreen mode" href={hrefs.guides.featureGuides.fullscreenToggle} />
			<GroupItem title="status indicator" href={hrefs.guides.featureGuides.statusIndicator} />
			<GroupItem title="scroll to top" href={hrefs.guides.featureGuides.scrollToTop} />
			<GroupItem disabled title="sticky header" href={hrefs.guides.featureGuides.stickyHeader} />
			<GroupItem title="sticky rows" href={hrefs.guides.featureGuides.stickyRows} />
			<GroupItem title="footer" href={hrefs.guides.featureGuides.footer} />
			<GroupItem
				disabled
				title="header filter toggle"
				href={hrefs.guides.featureGuides.headerFilterToggle}
			/>
			<GroupItem
				disabled
				title="custom header filters"
				href={hrefs.guides.featureGuides.customHeaderFilters}
			/>
		</Group>
	</div>
</div>
