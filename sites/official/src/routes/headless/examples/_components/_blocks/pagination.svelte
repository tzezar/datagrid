<script lang="ts">
	import type { DatagridCore } from '$lib/datagrid/core/index.svelte';

	let { datagrid }: { datagrid: DatagridCore<any> } = $props();
</script>

<div class="flex flex-col sm:flex-row items-center gap-4 outline-1 outline outline-border p-2">
	<div class="flex flex-row items-center gap-2">
		<span class="text-nowrap">Per page:</span>
		<select
			class="bg-background h-10 w-full max-w-[150px] border px-2 py-2"
			value={datagrid.features.pagination.pageSize}
			onchange={(e) => datagrid.handlers.pagination.changePageSize(Number(e.currentTarget.value))}
		>
			{#each datagrid.features.pagination.pageSizes as pageSize}
				<option value={pageSize}>{pageSize}</option>
			{/each}
		</select>
	</div>

	<div>
		<button
			class="pagination-button"
			disabled={datagrid.features.pagination.canGoToPrevPage()}
			onclick={() => datagrid.handlers.pagination.goToPrevPage()}
		>
			Prev
		</button>
		<span class="border p-2">
			Page {datagrid.features.pagination.page} of {datagrid.features.pagination.pageCount}
		</span>
		<button
			class="pagination-button"
			disabled={datagrid.features.pagination.canGoToNextPage()}
			onclick={() => datagrid.handlers.pagination.goToNextPage()}
		>
			Next
		</button>
	</div>

	<div>
		Showing {datagrid.features.pagination.pageSize * (datagrid.features.pagination.page - 1)} to
		{datagrid.features.pagination.pageSize * datagrid.features.pagination.page} of {(
			datagrid.cacheManager.rows || []
		).length} rows
	</div>
</div>

<style>
	.pagination-button {
		@apply h-10 border p-1 px-3;
	}
</style>
