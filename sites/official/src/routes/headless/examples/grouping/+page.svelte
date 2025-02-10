<script lang="ts">
	import GroupingDatagrid from '../_components/datagrids/grouping/grouping-datagrid.svelte';

	let { data } = $props();
</script>

<h2>Grouping implementation</h2>
<GroupingDatagrid {data} />
<div class="prose w-full min-w-full">
	<!-- <Readme /> -->
</div>
