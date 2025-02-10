<script lang="ts">
	import EditableDataDatagrid from '../_components/datagrids/editable-data/editable-data-datagrid.svelte';

	let { data } = $props();
</script>

<h2>Editable data example implementation</h2>

<EditableDataDatagrid {data} />
<div class="prose w-full min-w-full">
	<!-- <Readme /> -->
</div>
