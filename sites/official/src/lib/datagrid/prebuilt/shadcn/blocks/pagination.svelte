<script lang="ts">
	import Button from '$lib/components/ui/button/button.svelte';
	import ChevronLeftRounded from '$lib/datagrid/icons/material-symbols/chevron-left-rounded.svelte';
	import ChevronRightRounded from '$lib/datagrid/icons/material-symbols/chevron-right-rounded.svelte';
	import * as Select from '$lib/components/ui/select/index.js';
	import Input from '$lib/components/ui/input/input.svelte';
	import type { TzezarsDatagrid } from '../core/index.svelte';
	let { datagrid }: { datagrid: TzezarsDatagrid } = $props();
	let pageSizes = datagrid.features.pagination.pageSizes.map((pageSize: number) => {
		return {
			value: pageSize.toString(),
			label: pageSize.toString()
		};
	});
</script>

{#snippet prevButton()}
	<Button
		variant="secondary"
		class="size-6"
		size="sm"
		disabled={datagrid.features.pagination.canGoToPrevPage()}
		onclick={() =>
			datagrid.refresh(() => datagrid.features.pagination.goToPrevPage(), {
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
		variant="secondary"
		class="size-6"
		size="sm"
		disabled={datagrid.features.pagination.canGoToNextPage()}
		onclick={() =>
			datagrid.refresh(() => datagrid.features.pagination.goToNextPage(), {
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
		allowDeselect={false}
		value={String(datagrid.features.pagination.pageSize)}
		onValueChange={(value: string) => {
			datagrid.refresh(() => datagrid.features.pagination.setPageSize(Number(value)), {
				recalculatePagination: true
			});
		}}
	>
		<Select.Trigger class="h-6 w-max max-w-[180px] p-2 text-xs">
			<span class="pr-2">{datagrid.features.pagination.pageSize} per page</span>
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
		Showing {datagrid.features.pagination.pageSize * (datagrid.features.pagination.page - 1) + 1} : {Math.min(
			datagrid.features.pagination.pageSize * datagrid.features.pagination.page,
			datagrid.features.pagination.visibleRowsCount
		)} of {datagrid.features.pagination.visibleRowsCount} rows
	</span>
{/snippet}

{#snippet currentPage()}
	<span class="flex items-center gap-1 text-nowrap text-xs">
		<span class=" md:block"> Page </span>
		<Input
			max={datagrid.features.pagination.pageCount}
			class="pagination-page-input h-6 w-full max-w-[60px] p-2 text-xs"
			type="text"
			value={datagrid.features.pagination.page}
			onfocus={(e) => {
				e.currentTarget.select();
			}}
			oninput={(e) => {
				if (isNaN(Number(e.currentTarget.value))) {
					e.currentTarget.value = datagrid.features.pagination.page.toString();
					e.currentTarget.select();
					return;
				}
				const newPage = Number(e.currentTarget.value);
				datagrid.refresh(() => {
					datagrid.features.pagination.page = Math.min(
						Math.max(newPage, 1),
						datagrid.features.pagination.pageCount
					);
				});
				e.currentTarget.value = datagrid.features.pagination.page.toString();
			}}
		/>
		of {datagrid.features.pagination.pageCount}
	</span>
{/snippet}

<div class="pagination-container flex flex-row items-center justify-between gap-2 p-3 md:flex-row">
	{@render status()}
	<div class="flex place-items-center justify-center gap-2 md:w-1/3">
		{@render prevButton()}
		{@render nextButton()}
		{@render currentPage()}
	</div>
	<div class="flex justify-end md:w-1/3">
		{@render perPageSelect()}
	</div>
</div>
