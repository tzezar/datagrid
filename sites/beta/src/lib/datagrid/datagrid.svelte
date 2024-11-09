<script lang="ts">
	import { getContext, onMount, type Snippet } from 'svelte';
	import type { TzezarDatagrid } from './tzezar-datagrid.svelte';
	import DatagridPagination from './datagrid-pagination.svelte';
	import DatagridTopBar from './datagrid-top-bar.svelte';
	import DatagridFooter from './datagrid-footer.svelte';
	import DatagridHead from './datagrid-head.svelte';
	import DatagridLoadingIndicator from './datagrid-loading-indicator.svelte';
	import DatagridDataIndicator from './datagrid-data-indicator.svelte';
	import DatagridBody from './datagrid-body.svelte';
	import DatagridWrapper from './datagrid-wrapper.svelte';
	import DatagridContent from './datagrid-content.svelte';
	import { applyInternalLogicToColumns } from './fns/apply-internal-logic-to-columns.svelte';

	// Get the datagrid context
	const datagrid = getContext<TzezarDatagrid<unknown>>('datagrid');

	// Define prop types
	type Props = {
		head?: Snippet;
		loadingIndicator?: Snippet;
		dataIndicator?: Snippet;
		body?: Snippet;
		topBar?: Snippet;
		footer?: Snippet;
		children?: Snippet;
		class?: {
			wrapper?: string;
			content?: string;
		};
		pagination?: Snippet;
	};

	// Destructure props with default values
	const {
		pagination,
		topBar,
		body,
		loadingIndicator,
		dataIndicator,
		head,
		footer,
		children,
		class: _class = {
			wrapper: '',
			content: ''
		}
	}: Props = $props();

	// Apply column offset if any columns are pinned
	onMount(() => {
		applyInternalLogicToColumns(datagrid);
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
	{#if children}
		{@render children()}
	{/if}
	<DatagridPagination {pagination} />
</DatagridWrapper>
<div bind:this={end} aria-hidden="true" class="hidden"></div>
