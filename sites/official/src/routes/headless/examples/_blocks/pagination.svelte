<script lang="ts">
	import type { DatagridCore } from '$lib/datagrid/core/index.svelte';

	let { datagrid }: { datagrid: DatagridCore<any> } = $props();
</script>

<div class="pagination-container">
	<div class="page-size-selector">
		<span class="page-size-label">Per page:</span>
		<select
			class="page-size-input"
			value={datagrid.features.pagination.pageSize}
			onchange={(e) => datagrid.handlers.pagination.changePageSize(Number(e.currentTarget.value))}
		>
			{#each datagrid.features.pagination.pageSizes as pageSize}
				<option value={pageSize}>{pageSize}</option>
			{/each}
		</select>
	</div>

	<div class="pagination-controls">
		<button
			class="pagination-button"
			disabled={datagrid.features.pagination.canGoToPrevPage()}
			onclick={() => datagrid.handlers.pagination.goToPrevPage()}
		>
			Prev
		</button>
		<span class="current-page">
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

	<div class="row-count">
		Showing
		{Math.min(
			datagrid.features.pagination.pageSize * (datagrid.features.pagination.page - 1) + 1,
			(datagrid.cacheManager.rows || []).length
		)}
		to
		{Math.min(
			datagrid.features.pagination.pageSize * datagrid.features.pagination.page,
			(datagrid.cacheManager.rows || []).length
		)}
		of {(datagrid.cacheManager.rows || []).length} rows
	</div>
</div>

<style lang="postcss">
	.pagination-container {
		@apply flex flex-col items-center gap-4 p-2 outline outline-1 outline-border sm:flex-row;
	}

	.page-size-selector {
		@apply flex flex-row items-center gap-2;
	}

	.page-size-label {
		@apply whitespace-nowrap;
	}

	.page-size-input {
		@apply h-10 w-full max-w-[150px] border bg-background px-2 py-2;
	}

	.pagination-controls {
		@apply flex items-center gap-2;
	}

	.pagination-button {
		@apply h-10 border p-1 px-3 disabled:cursor-not-allowed disabled:opacity-50;
	}

	.current-page {
		@apply border p-2;
	}

	.row-count {
		@apply text-sm;
	}
</style>
