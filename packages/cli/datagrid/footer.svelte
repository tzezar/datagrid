<script lang="ts">
	import { getContext, type Snippet } from 'svelte';
	import { cn } from '$lib/utils';
	import type { TzezarDatagrid } from './tzezar-datagrid.svelte';
	import { Z_INDEX_FOOTER } from './CONSTSANTS';

	const datagrid = getContext<TzezarDatagrid<unknown>>('datagrid');

	type Props = {
		children: Snippet;
		class?: '';
	};

	let { children, class: _class = '' }: Props = $props();
</script>

<div
	class={cn(`sticky bottom-[-1px] min-w-full border-t z-[${Z_INDEX_FOOTER}]`, _class)}
	data-datagrid-footer-identifier={datagrid.identifier}
>
	{@render children()}
</div>
