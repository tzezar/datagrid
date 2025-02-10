<script lang="ts">
	import PaginationOnBackendDatagrid from '../_components/datagrids/pagination-on-backend/pagination-on-backend-datagrid.svelte';

	let { data } = $props();
</script>

{#if !data.inventory}
	<p>Loading...</p>
{/if}

<h2>Pagination implementation</h2>
<PaginationOnBackendDatagrid {data} />
<div class="prose w-full min-w-full">
	<!-- <Readme /> -->
</div>
