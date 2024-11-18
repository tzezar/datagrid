<script lang="ts">
	import type { Datagrid } from '$lib/datagrid/index.svelte';
	import type { Row } from '$lib/datagrid/processors/data-processor.svelte';
	import GroupCollapsed from '$lib/icons/group-collapsed.svelte';
	import GroupExpanded from '$lib/icons/group-expanded.svelte';

	let { row, grid }: { row: Row<any>; grid: Datagrid<any, any> } = $props();

	function handleGroupToggle(groupId: string) {
		grid.refresh(() => {
			grid.dataProcessor.toggleGroupExpansion(groupId);
			grid.pagination.updatePageCount();
			grid.pagination.goToClosestPage();
		});
	}
</script>

<div class="flex">
	<!-- svelte-ignore a11y_click_events_have_key_events -->
	<!-- svelte-ignore a11y_no_static_element_interactions -->
	<span class="group-toggle" onclick={() => handleGroupToggle(row.groupId as string)}>
		{#if grid.grouping.isGroupExpanded(row.groupId as string)}
			<GroupExpanded/>
		{:else}
			<GroupCollapsed/>
		{/if}
	</span>
</div>
