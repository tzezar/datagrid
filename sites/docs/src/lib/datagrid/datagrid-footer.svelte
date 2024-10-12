<script lang="ts">
	import { getContext, type Snippet } from 'svelte';
	import Row from './row.svelte';
	import ScrollToTopButton from './scroll-to-top-button.svelte';
	import type { TzezarDatagrid } from './tzezar-datagrid.svelte';

	let { footer }: { footer: Snippet | undefined } = $props();
	let datagrid = getContext<TzezarDatagrid<unknown>>('datagrid');
</script>

<Row
	class="bg-table-primary sticky bottom-0 left-0 z-[15] flex w-full min-w-full flex-col border-b-0 border-t"
>
	{#if footer}
		{@render footer()}
	{:else}
		<div
			class="flex items-center justify-between p-2 pl-3"
			data-datagrid-footer-identifier={datagrid.identifier}
		>
			<div class="ml-auto">
				<ScrollToTopButton />
			</div>
		</div>
	{/if}
</Row>
