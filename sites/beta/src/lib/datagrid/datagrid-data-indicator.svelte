<script lang="ts">
	import { getContext, type Snippet } from 'svelte';
	import type { TzezarDatagrid } from './tzezar-datagrid.svelte';
	import Row from './row.svelte';
	import { STAY_IN_PLACE } from './CONSTSANTS';
	import StateIndicator from './state-indicator.svelte';

	let { dataIndicator }: { dataIndicator: Snippet | undefined } = $props();
	let datagrid = getContext<TzezarDatagrid<unknown>>('datagrid');
</script>

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
