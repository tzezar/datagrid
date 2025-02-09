<script lang="ts">
	import HeaderGroupsDatagrid from '../_components/datagrids/header-groups/header-groups-datagrid.svelte';

	let { data } = $props();
</script>

<h2>Header groups datagrid implementation</h2>
<HeaderGroupsDatagrid {data} />
<div class="prose w-full min-w-full">
	<!-- <Readme /> -->
</div>
