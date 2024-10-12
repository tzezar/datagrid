<script lang="ts">
	import { getContext, type Snippet } from 'svelte';
	import type { TzezarDatagrid } from './tzezar-datagrid.svelte';
	import { cn } from '$lib/utils';

	let { children, class: _class }: { children: Snippet, class: string | undefined } = $props();
	let datagrid = getContext<TzezarDatagrid<unknown>>('datagrid');
</script>

<div
	data-datagrid={datagrid.identifier}
	class={cn(
		'relative flex flex-col border',
		datagrid.options.scrollable ? 'max-h-[70vh]  overflow-auto ' : '',
		_class
	)}
>
	{@render children()}
</div>
