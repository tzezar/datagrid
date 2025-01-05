<script lang="ts">
	import Button from '$lib/components/ui/button/button.svelte';
	import type { Datagrid } from '$lib/datagrid/core/index.svelte';
	import ChevronLeftRounded from '$lib/datagrid/icons/material-symbols/chevron-left-rounded.svelte';
	import ChevronRightRounded from '$lib/datagrid/icons/material-symbols/chevron-right-rounded.svelte';
	let { datagrid }: { datagrid: Datagrid<any> } = $props();
	import * as Select from '$lib/components/ui/select/index.js';
	import Input from '$lib/components/ui/input/input.svelte';

	let pageSizes = datagrid.pagination.pageSizes.map((pageSize: number) => {
		return {
			value: pageSize.toString(),
			label: pageSize.toString()
		};
	});
</script>

{#snippet prevButton()}
	<Button
		class="h-6"
		size="sm"
		disabled={datagrid.pagination.canGoToPrevPage()}
		onclick={() =>
			datagrid.refresh(() => datagrid.pagination.goToPrevPage(), {
				recalculateAll: false,
				recalculateGroups: false,
				recalculatePagination: true
			})}
	>
		<ChevronLeftRounded />
	</Button>
{/snippet}

{#snippet nextButton()}
	<Button
		class="h-6"
		size="sm"
		disabled={datagrid.pagination.canGoToNextPage()}
		onclick={() =>
			datagrid.refresh(() => datagrid.pagination.goToNextPage(), {
				recalculateAll: false,
				recalculateGroups: false,
				recalculatePagination: true
			})}
	>
		<ChevronRightRounded />
	</Button>
{/snippet}

{#snippet perPageSelect()}
	<Select.Root
		type="single"
		name="perPage"
		value={String(datagrid.pagination.pageSize)}
		onValueChange={(value: string) => {
			datagrid.refresh(() => datagrid.pagination.setPageSize(Number(value)), {
				recalculatePagination: true
			});
		}}
	>
		<Select.Trigger class="h-6 w-max max-w-[180px]">
			{datagrid.pagination.pageSize} per page
		</Select.Trigger>
		<Select.Content>
			<Select.Group>
				<Select.GroupHeading>Available page sizes</Select.GroupHeading>
				{#each pageSizes as pageSize}
					<Select.Item value={pageSize.value} label={pageSize.label}>{pageSize.label}</Select.Item>
				{/each}
			</Select.Group>
		</Select.Content>
	</Select.Root>
{/snippet}

{#snippet status()}
	<span class="text-muted-foreground hidden text-xs md:block md:w-1/3">
		Showing {datagrid.pagination.pageSize * (datagrid.pagination.page - 1) + 1} : {Math.min(
			datagrid.pagination.pageSize * datagrid.pagination.page,
			datagrid.pagination.visibleRowsCount
		)} of {datagrid.pagination.visibleRowsCount} rows
	</span>
{/snippet}

{#snippet currentPage()}
	<span class="flex items-center gap-2 text-nowrap text-xs">
		<!-- <span class="hidden md:block"> Page </span> -->
		<Input
			class="h-6 w-full max-w-[180px]"
			type="text"
			value={datagrid.pagination.page}
			oninput={(e) => {
				datagrid.refresh(() => {
					datagrid.pagination.page = Number(e.currentTarget.value);
				});
			}}
		/>
		<!-- of {datagrid.pagination.pageCount} -->
	</span>
{/snippet}

<div>
	<div
		class="pagination-container flex flex-row items-center justify-between gap-2 p-3 md:flex-row"
	>
		{@render status()}
		<div class="flex place-items-center justify-center gap-2 md:w-1/3">
			{@render prevButton()}
			{@render currentPage()}
			{@render nextButton()}
		</div>
		<div class="flex justify-end md:w-1/3">
			{@render perPageSelect()}
		</div>
	</div>
</div>
