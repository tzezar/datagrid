<script lang="ts">
	import type { Datagrid } from "$lib/datagrid/core/index.svelte";


	let { datagrid }: { datagrid: Datagrid<any> } = $props();
</script>


<div>
	<div
		class="pagination-container flex flex-col items-center justify-center gap-2 p-3 md:flex-row md:justify-between"
	>
		<div class="text-muted-foreground text-xs md:w-1/3">
			<!-- Ensuring each div is 1 grid cell -->
			<span>
				Showing {datagrid.pagination.pageSize * (datagrid.pagination.page - 1)} to {datagrid
					.pagination.pageSize * datagrid.pagination.page} of {(datagrid.cache.rows || []).length} rows
			</span>
		</div>
		<div class="flex justify-between md:w-1/3">
			<!-- Ensure this is a flex container within a grid column -->
			<button
				class="pagination-button"
				disabled={datagrid.pagination.canGoToPrevPage()}
				onclick={() => datagrid.refresh(() => datagrid.pagination.goToPrevPage())}
			>
				Prev
			</button>
			<span>
				Page {datagrid.pagination.page} of {datagrid.pagination.pageCount}
			</span>
			<button
				class="pagination-button"
				disabled={datagrid.pagination.canGoToNextPage()}
				onclick={() => datagrid.refresh(() => datagrid.pagination.goToNextPage())}
			>
				Next
			</button>
		</div>
		<div class="flex justify-end md:w-1/3">
			<select
				value={datagrid.pagination.pageSize}
				onchange={(e) => {
					datagrid.refresh(() => {
						datagrid.pagination.pageSize = Number(e.currentTarget.value);
						datagrid.pagination.goToFirstPage();
					});
				}}
			>
				{#each datagrid.pagination.pageSizes as pageSize}
					<option value={pageSize}>{pageSize}</option>
				{/each}
			</select>
		</div>
	</div>
</div>