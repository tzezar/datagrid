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
			<GroupItem title="minimal" href={hrefs.examples.minimal} />
			<GroupItem title="basic" href={hrefs.examples.basic} />
			<GroupItem title="advanced" href={hrefs.examples.advanced} />
			<!-- <GroupItem title="client data" href={hrefs.examples.clientData} disabled /> -->
			<GroupItem title="svelte query" href={hrefs.examples.svelteQuery} />
		</Group>
		<Group>
			<GroupTitle title="fundamentals" />
			<GroupItem disabled title="Overview" class="normal-case" href={hrefs.fundamentals.overview} />
			<GroupItem disabled title="typescript" href={hrefs.fundamentals.typescript} />
			<GroupItem disabled title="customization" href={hrefs.fundamentals.customization} />
		</Group>
		<Group>
			<GroupTitle title="feature guides" />
			<GroupItem
				disabled
				title="column freezing"
				href={hrefs.guides.featureGuides.columnFreezing}
			/>
			<GroupItem disabled title="column hiding" href={hrefs.guides.featureGuides.columnHiding} />
			<GroupItem
				disabled
				title="column ordering"
				href={hrefs.guides.featureGuides.columnOrdering}
			/>
			<GroupItem
				disabled
				title="column resizing"
				href={hrefs.guides.featureGuides.columnResizing}
			/>
			<GroupItem
				disabled
				title="column aligment"
				href={hrefs.guides.featureGuides.columnAlignment}
			/>
			<GroupItem disabled title="row expanding" href={hrefs.guides.featureGuides.rowExpanding} />
			<GroupItem disabled title="row selection" href={hrefs.guides.featureGuides.rowSelection} />
			<GroupItem disabled title="pagination" href={hrefs.guides.featureGuides.pagination} />
			<GroupItem disabled title="sorting" href={hrefs.guides.featureGuides.sorting} />
			<GroupItem disabled title="filtering" href={hrefs.guides.featureGuides.filtering} />
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
			<GroupItem disabled title="data copying" href={hrefs.guides.featureGuides.dataCopying} />
			<GroupItem disabled title="data exporting" href={hrefs.guides.featureGuides.dataExporting} />
			<GroupItem disabled title="context menu" href={hrefs.guides.featureGuides.contextMenu} />
			<GroupItem
				disabled
				title="fullscreen mode"
				href={hrefs.guides.featureGuides.fullscreenToggle}
			/>
			<GroupItem
				disabled
				title="status indicator"
				href={hrefs.guides.featureGuides.statusIndicator}
			/>
			<GroupItem disabled title="scroll to top" href={hrefs.guides.featureGuides.scrollToTop} />
			<GroupItem disabled title="sticky header" href={hrefs.guides.featureGuides.stickyHeader} />
			<GroupItem disabled title="sticky rows" href={hrefs.guides.featureGuides.stickyRows} />
			<GroupItem disabled title="footer" href={hrefs.guides.featureGuides.footer} />
			<GroupItem
				disabled
				title="header filter toggle"
				href={hrefs.guides.featureGuides.headerFilterToggle}
			/>
			<GroupItem disabled title="custom cells" href={hrefs.guides.featureGuides.customCells} />
			<GroupItem disabled title="custom headers" href={hrefs.guides.featureGuides.customHeaders} />
			<GroupItem
				disabled
				title="custom header filters"
				href={hrefs.guides.featureGuides.customHeaderFilters}
			/>
		</Group>
	</div>
</div>
