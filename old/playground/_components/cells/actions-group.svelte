<script lang="ts">
	import type { Datagrid } from '$lib/tzezars-datagrid/index.svelte';
	import type { Row } from '$lib/tzezars-datagrid/processors/data-processor.svelte';
	import GroupCollapsed from '../icons/group-collapsed.svelte';
	import GroupExpanded from '../icons/group-expanded.svelte';

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
