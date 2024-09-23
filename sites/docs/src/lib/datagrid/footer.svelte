<script lang="ts">
	import { getContext, type Snippet } from 'svelte';
	import { cn } from '$lib/utils';
	import type { TzezarDatagrid } from './tzezar-datagrid.svelte';

	const datagrid = getContext<TzezarDatagrid>('datagrid');

	type Props = {
		children: Snippet;
		class?: '';
	};

	let { children, class: _class = '' }: Props = $props();
</script>

<div
	class={cn("sticky bottom-[-1px] min-w-full border-t", _class)}
	data-datagrid-footer-identifier={datagrid.identifier}
>
	{@render children()}
</div>
