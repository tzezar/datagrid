<script lang="ts">
	import GroupTitle from './group-title.svelte';
	import GroupItem from './group-item.svelte';
	import Group from './group.svelte';
	import { hrefs } from '$lib/hrefs';
</script>

<div class="flex w-full flex-col">
	<div class="flex w-full flex-col gap-8 p-8">
		<Group>
			<GroupItem disabled title="Supporters" href={hrefs.supporters.default} />
			<GroupItem disabled title="Report a bug" href={''} />
			<GroupItem disabled title="Suggest an enhancement" href={''} />
		</Group>
		<GroupTitle
			title="Headless"
			class="border-b-2 border-orange-400 pb-1 text-lg text-orange-400"
		/>

		<Group>
			<GroupTitle title="Quick start" />
			<GroupItem disabled title="Installation" href={''} />
			<GroupItem title="Getting started" href={hrefs.headless.quickStart.gettingStarted} />
		</Group>
		<GroupItem title="API reference" href={hrefs.headless.apiReference.default} />

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
			<GroupItem title="Virtualized" href={hrefs.headless.examples.virtualized} />
			<GroupItem title="Editable data" href={hrefs.headless.examples.editableData} />
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
	</div>
</div>
