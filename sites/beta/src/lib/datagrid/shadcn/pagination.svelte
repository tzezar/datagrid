<script lang="ts">
	import * as Select from '$lib/components/ui/select';
	import { Pagination } from 'bits-ui';
	import { getContext } from 'svelte';
	import MaterialSymbolsLightChevronLeft from '../icones/MaterialSymbolsLightChevronLeft.svelte'; 
	import MaterialSymbolsLightChevronRight from '../icones/MaterialSymbolsLightChevronRight.svelte';
	import type { TzezarDatagrid } from '../tzezar-datagrid.svelte';
	import { cn } from '$lib/utils';
	import Input from '$lib/components/ui/input/input.svelte';

	const datagrid = getContext<TzezarDatagrid<unknown>>('datagrid');

	const getPageOptions = (count: number, perPage: number) => {
		let res = [];
		for (let i = 1; i <= Math.ceil(count / perPage); i++) {
			res.push({ label: i.toString(), value: i });
		}
		return res;
	};

	let pageOptions = $derived(
		getPageOptions(datagrid.state.pagination.count, datagrid.state.pagination.perPage)
	);
</script>

<div
	style:padding-top={datagrid.options.spacing.selected.vertical}
	style:padding-bottom={datagrid.options.spacing.selected.vertical}
	style:padding-left={datagrid.options.spacing.selected.horizontal}
	style:padding-right={datagrid.options.spacing.selected.horizontal}
	class={cn(
		'bg-primary-foreground grid  grid-cols-3 items-center justify-center gap-4 border border-t-0',
		``
	)}
>
	<span class="text-muted-foreground w-full text-left text-xs">
		<span class='hidden md:inline'>Showing</span> {datagrid.state.pagination.perPage * datagrid.state.pagination.page -
			datagrid.state.pagination.perPage}
		:
		{datagrid.state.pagination.perPage * datagrid.state.pagination.page}
		of
		{datagrid.state.pagination.count}
	</span>
	<Pagination.Root
		count={datagrid.state.pagination.count}
		perPage={datagrid.state.pagination.perPage}
		page={datagrid.state.pagination.page}
		onPageChange={(v) => datagrid.updatePagination(v, datagrid.state.pagination.perPage)}
	>
		<div class="flex flex-col items-center gap-1">
			<div class="flex gap-2">
				<Pagination.PrevButton
					class="hover:bg-dark-10 active:scale-98 disabled:text-muted-foreground h-8 items-center   justify-center rounded-[9px] border  bg-transparent disabled:cursor-not-allowed hover:disabled:bg-transparent"
				>
					<MaterialSymbolsLightChevronLeft class="mx-2 h-8" />
				</Pagination.PrevButton>
				<div class="flex items-center">
					<Input type="number" min={1} max={pageOptions.length} value={datagrid.state.pagination.page} oninput={(e) => datagrid.updatePagination(+e.currentTarget.value, datagrid.state.pagination.perPage)} class='w-20 outline-none focus-visible:ring-0 h-8'/>
					<!-- <Select.Root
						selected={{
							value: datagrid.state.pagination.page,
							label: `Page ${datagrid.state.pagination.page}`
						}}
						onSelectedChange={(selected) =>
							datagrid.updatePagination(selected?.value || 1, datagrid.state.pagination.perPage)}
					>
						<Select.Trigger class="bg-primary-foreground h-8">
							<Select.Value />
						</Select.Trigger>
						<Select.Content sameWidth={false} align="start" class="max-h-96 overflow-auto">
							{#each pageOptions as page (page)}
								<Select.Item value={page.value}>Page {page.label}</Select.Item>
							{/each}
						</Select.Content>
					</Select.Root> -->
				</div>
				<Pagination.NextButton
					class=" hover:bg-dark-10 active:scale-98 disabled:text-muted-foreground h-8 items-center   justify-center rounded-[9px] border  bg-transparent disabled:cursor-not-allowed hover:disabled:bg-transparent"
				>
					<MaterialSymbolsLightChevronRight class="mx-2 h-8" />
				</Pagination.NextButton>
			</div>
		</div>
	</Pagination.Root>
	<div class="flex w-full flex-row justify-end gap-1 text-nowrap text-xs">
		<Select.Root
			onSelectedChange={(selected) => {
				datagrid.updatePagination(1, selected?.value || 10);
			}}
			selected={{
				value: datagrid.state.pagination.perPage,
				label: `Per page: ${datagrid.state.pagination.perPage}`
			}}
		>
			<Select.Trigger class="bg-primary-foreground h-8  w-fit">
				<Select.Value asChild>{datagrid.state.pagination.perPage}</Select.Value>
			</Select.Trigger>
			<Select.Content sameWidth={false} align="start" class="max-h-96 overflow-auto">
				<Select.Label>Rows per page</Select.Label>
				<Select.Item checkbox value={1}>1</Select.Item>
				<Select.Item checkbox value={2}>2</Select.Item>
				<Select.Item checkbox value={10}>10</Select.Item>
				<Select.Item checkbox value={20}>20</Select.Item>
				<Select.Item checkbox value={30}>30</Select.Item>
				<Select.Item checkbox value={40}>40</Select.Item>
				<Select.Item checkbox value={50}>50</Select.Item>
				<Select.Item checkbox value={100}>100</Select.Item>
				<Select.Item checkbox value={250}>250</Select.Item>
			</Select.Content>
		</Select.Root>
	</div>
</div>
