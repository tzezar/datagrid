<script lang="ts">
	import SortingDatagrid from '../_components/datagrids/sorting/sorting-datagrid.svelte';

	let { data } = $props();
</script>

<div>
	<h2>Row selection example implementation</h2>
<p class='text-muted-foreground text-sm'>Hold `Ctrl` for multisort`</p>
</div>


<SortingDatagrid {data} />
<div class="prose w-full min-w-full">
	<!-- <Readme /> -->
</div>
