<script lang="ts">
	import { getContext, onMount, type Snippet } from 'svelte';
	import { applyOffset } from './fns/apply-offset';
	import type { TzezarDatagrid } from './tzezar-datagrid.svelte';
	import { paginateData } from './fns/paginate-data';
	import { sortData } from './fns/sort-data';
	import { filterData } from './fns/filter-data';
	import DatagridPagination from './datagrid-pagination.svelte';
	import DatagridTopBar from './datagrid-top-bar.svelte';
	import DatagridFooter from './datagrid-footer.svelte';
	import DatagridHead from './datagrid-head.svelte';
	import DatagridLoadingIndicator from './datagrid-loading-indicator.svelte';
	import DatagridDataIndicator from './datagrid-data-indicator.svelte';
	import DatagridBody from './datagrid-body.svelte';
	import DatagridWrapper from './datagrid-wrapper.svelte';
	import DatagridContent from './datagrid-content.svelte';

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
			content?: string;
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
			content: ''
		}
	}: Props = $props();

	onMount(() => {
		if (datagrid.columns.some((column) => column.pinned)) {
			datagrid.columns = applyOffset(datagrid.columns);
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

	// Fullscreen functionality workaround, we need ref to know where to scroll back after leaving fullscreen mode
	// svelte-ignore non_reactive_update
	let end: HTMLElement;
</script>

<DatagridWrapper {end} class={_class.wrapper}>
	<DatagridTopBar {topBar} />
	<DatagridContent class={_class.content}>
		<DatagridHead {head} />
		<DatagridLoadingIndicator {loadingIndicator} />
		<DatagridDataIndicator {dataIndicator} />
		<DatagridBody {body} />
		<DatagridFooter {footer} />
	</DatagridContent>
	<DatagridPagination {pagination} />
</DatagridWrapper>
<div bind:this={end} aria-hidden="true" class="hidden"></div>
