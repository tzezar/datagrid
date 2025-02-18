<script lang="ts">
	import { getContext, type Snippet } from 'svelte';
	import type { TzezarDatagrid } from './tzezar-datagrid.svelte';
	import LoadingIndicatorContainer from './loading-indicator-container.svelte';
	import LoadingIndicator from './loading-indicator.svelte';

	let { loadingIndicator }: { loadingIndicator: Snippet | undefined } = $props();
	let datagrid = getContext<TzezarDatagrid<unknown>>('datagrid');
</script>

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
