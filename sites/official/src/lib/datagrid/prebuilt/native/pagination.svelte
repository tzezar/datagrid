<script lang="ts">
	import type { DataGrid } from '$lib/datagrid/core/index.svelte';

	let { datagrid }: { datagrid: DataGrid<any> } = $props();
</script>

<div class="flex flex-row justify-around">
	<div>
		Per page:
		<select
			value={datagrid.features.pagination.pageSize}
			onchange={(e) => {
				datagrid.refresh(() => {
					datagrid.features.pagination.pageSize = Number(e.currentTarget.value);
					datagrid.features.pagination.goToFirstPage();
				});
			}}
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
			onclick={() => datagrid.refresh(() => datagrid.features.pagination.goToPrevPage())}
		>
			Prev
		</button>
		<span>
			Page {datagrid.features.pagination.page} of {datagrid.features.pagination.pageCount}
		</span>
		<button
			class="pagination-button"
			disabled={datagrid.features.pagination.canGoToNextPage()}
			onclick={() => datagrid.refresh(() => datagrid.features.pagination.goToNextPage())}
		>
			Next
		</button>
	</div>

	<div>
		Showing {datagrid.features.pagination.pageSize * (datagrid.features.pagination.page - 1)} to
		{datagrid.features.pagination.pageSize * datagrid.features.pagination.page} of {(
			datagrid.cache.rows || []
		).length} rows
	</div>
</div>
