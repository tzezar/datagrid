<script lang="ts">
	import * as Select from '$lib/components/ui/select';
	import type { TzezarDatagrid } from '$lib/datagrid/tzezar-datagrid.svelte';
	import { Pagination } from 'bits-ui';
	import { getContext } from 'svelte';
	import MaterialSymbolsLightChevronLeft from '$lib/datagrid/icones/MaterialSymbolsLightChevronLeft.svelte'; 
	import MaterialSymbolsLightChevronRight from '$lib/datagrid/icones/MaterialSymbolsLightChevronRight.svelte'; 

	const datagrid = getContext<TzezarDatagrid<unknown>>('datagrid');

	let {}: {} = $props();

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

<div class="flex flex-row flex-wrap justify-center gap-4 pt-2 sm:justify-between">
	<Pagination.Root
		count={datagrid.state.pagination.count}
		perPage={datagrid.state.pagination.perPage}
		page={datagrid.state.pagination.page}
		let:range
		onPageChange={(v) => (datagrid.state.pagination.page = v)}
	>
		<div class="flex items-center gap-2">
			<Pagination.PrevButton
				class="hover:bg-dark-10 active:scale-98 h-8 items-center justify-center  rounded-[9px] border bg-primary  disabled:cursor-not-allowed disabled:text-muted-foreground disabled:bg-muted"
			>
				<MaterialSymbolsLightChevronLeft class="mx-2 h-8 text-primary-foreground" />
			</Pagination.PrevButton>

			<Pagination.NextButton
				class="hover:bg-dark-10 active:scale-98 h-8 items-center  justify-center  rounded-[9px]   border bg-primary  disabled:cursor-not-allowed disabled:text-muted-foreground disabled:bg-muted"
			>
				<MaterialSymbolsLightChevronRight class="mx-2 h-8 text-primary-foreground" />
			</Pagination.NextButton>
		</div>
	</Pagination.Root>
	<div class="flex flex-row gap-1 text-nowrap text-xs">
		<Select.Root
			onSelectedChange={(selected) => {
				datagrid.state.pagination.page = 1;
				datagrid.state.pagination.perPage = Number(selected?.value);
			}}
			selected={{
				value: datagrid.state.pagination.perPage,
				label: `Per page: ${datagrid.state.pagination.perPage}`
			}}
		>
			<Select.Trigger class="h-8">
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
