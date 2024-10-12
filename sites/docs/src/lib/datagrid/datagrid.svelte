<script lang="ts">
	import { cn } from '$lib/utils';
	import { getContext, onMount, type Snippet } from 'svelte';
	import { applyOffset } from './fns/apply-offset';
	import LoadingIndicator from './loading-indicator.svelte';
	import { STAY_IN_PLACE } from './CONSTSANTS';
	import Row from './row.svelte';
	import StateIndicator from './state-indicator.svelte';
	import ScrollToTopButton from './scroll-to-top-button.svelte';
	import Pagination from './shadcn/pagination.svelte';
	import LoadingIndicatorContainer from './loading-indicator-container.svelte';
	import type { TzezarDatagrid } from './tzezar-datagrid.svelte';
	import { paginateData } from './fns/paginate-data';
	import { sortData } from './fns/sort-data';
	import { filterData } from './fns/filter-data';
	import TopBar from './top-bar.svelte';
	import DatagridPagination from './datagrid-pagination.svelte';
	import DatagridTopBar from './datagrid-top-bar.svelte';
	import DatagridFooter from './datagrid-footer.svelte';

	// TODO: this component grew big, need to split it into smaller components
	let datagrid = getContext<TzezarDatagrid<unknown>>('datagrid');

	type Props = {
		head?: Snippet;
		loadingIndicator?: Snippet;
		dataIndicator?: Snippet;
		body?: Snippet;
		topBar?: Snippet;
		footer?: Snippet;
		class?: {
			wrapper?: string;
			table?: string;
		};
		pagination?: Snippet;
	};

	let {
		pagination,
		topBar,
		body,
		loadingIndicator,
		dataIndicator,
		head,
		footer,
		class: _class = {
			wrapper: '',
			table: ''
		}
	}: Props = $props();

	onMount(() => {
		if (datagrid.columns.some((column) => column.pinned)) {
			applyOffset(datagrid.columns);
		}
	});

	// * Internal logic in client mode is splitted in separate $effects to reduce unnecessary recalculations

	// ! BUG for some reason internal logic, like sorting, filtering and pagination runs after render
	// ! in theory data is not changing but in practice it is for unknown reason
	// ! whole chain of logic comes from filterDate() that takes data as parameter
	// ! maybe move that logic to another place? instead of $effect make it inside class as $derrived

	// ? Worth noting the order. On small samples of data, it doesn't change anything but on large ones,
	// ? it is better to filter first and then sort because the best sorting algorithms are O(n log n) so the less data you have,
	// ? the faster it is, and filtering shrinks the size of the sample, so filtering first is faster.
	// Updates filtered data in client mode only
	$effect(() => {
		if (datagrid.mode === 'client') {
			datagrid.internal.filteredData = filterData([...datagrid.data], datagrid.state.filters);
		}
	});

	// Updates sorted data in client mode only
	$effect(() => {
		if (datagrid.mode === 'client') {
			datagrid.internal.sortedData = sortData(
				[...datagrid.internal.filteredData],
				datagrid.state.sortingArray
			);
		}
	});

	// Updates paginated data in client mode only
	$effect(() => {
		if (datagrid.mode === 'client') {
			datagrid.internal.paginatedData = paginateData(
				datagrid.internal.sortedData,
				datagrid.state.pagination.page,
				datagrid.state.pagination.perPage
			);
		}
	});

	// Updates pagination count in client mode only
	$effect(() => {
		if (datagrid.mode === 'client') {
			datagrid.state.pagination.count = datagrid.internal.filteredData.length || 1;
		}
	});

	// Fullscreen functionality
	let end: HTMLElement;
	$effect.pre(() => {
		// TODO: this has to be refactored
		// * there must be easier way to do this
		// ? maybe add display fixed instead of absolute and disable scrolling
		// datagrid in fullscreen mode appear on top of the page, so we need to scroll it to the top
		if (datagrid.state.isFullscreenActive) {
			document.body.classList.add('overflow-hidden');
			document.body.scrollIntoView({ behavior: 'smooth', block: 'start' });
		} else {
			// if datagrid is not in fullscreen mode, we need to scroll back to it's original position
			if (!end) {
				document.body.classList.remove('overflow-hidden');
				return;
			}
			end.scrollIntoView({ behavior: 'smooth', block: 'start' });
			document.body.classList.remove('overflow-hidden');
		}
	});
</script>

<!-- WRAPPER -->
<div
	class={cn(
		'flex flex-col ',
		datagrid.state.isFullscreenActive && 'bg-primary-foreground absolute inset-0 z-[20]  p-4'
	)}
	style="font-size: {datagrid.options.fontSize.selected.value};"
>
	{#if datagrid.options.topbar.display}
		<DatagridTopBar {topBar} />
	{/if}
	<!-- CONTENT -->
	<div
		data-datagrid={datagrid.identifier}
		class={cn(
			'relative flex flex-col border',
			datagrid.options.scrollable ? 'max-h-[70vh]  overflow-auto ' : ''
		)}
	>
		<!-- HEAD -->
		<div class="w sticky top-0 z-[16] flex min-w-fit" data-datagrid-head={datagrid.identifier}>
			{#if head}
				{@render head()}
			{/if}
		</div>
		<!-- LOADING INDICATOR -->
		{#if datagrid.options.statusIndicator.display}
			{#if loadingIndicator}
				{@render loadingIndicator()}
			{:else}
				<LoadingIndicatorContainer>
					<LoadingIndicator
						isError={datagrid.state.status.isError}
						isFetching={datagrid.state.status.isFetching}
						isRefetching={datagrid.state.status.isRefetching}
					/>
				</LoadingIndicatorContainer>
			{/if}
		{/if}
		<!-- DATA INDICATOR -->
		{#if datagrid.options.dataIndicator.display}
			{#if dataIndicator}
				{@render dataIndicator()}
			{:else}
				<Row class={`${STAY_IN_PLACE} border-b-0`}>
					<StateIndicator
						isLoading={datagrid.state.status.isFetching}
						isError={datagrid.state.status.isError}
					/>
				</Row>
			{/if}
		{/if}
		<!-- BODY -->
		{#if body}
			<!-- ? BODY can not be wrapped inside html element, it break sticky and rows -->
			<!-- ? there is possibility to move other elements like header, topbar etc to ouside of parent container -->
			<!-- ? but then header and body X axis scroll have to be synced via js -->
			{@render body()}
		{/if}
		<!-- FOOTER -->
		{#if datagrid.options.footer.display}
			<DatagridFooter {footer} />
		{/if}
	</div>
	{#if datagrid.options.pagination.display}
		<DatagridPagination {pagination} />
	{/if}
</div>
<div bind:this={end} aria-hidden="true" class="hidden"></div>
