<script lang="ts">
	import { getContext, type Snippet } from 'svelte';
	import { cn } from '$lib/utils';
	import { STAY_IN_PLACE, Z_INDEX_LOADING_INDICATOR } from './CONSTSANTS';
	import type { TzezarDatagrid } from './tzezar-datagrid.svelte';
	let datagrid = getContext<TzezarDatagrid<unknown>>('datagrid');

	type Props = {
		children: Snippet;
		class?: string;
	};

	let { children, class: _class }: Props = $props();
</script>

<div
	style={`top: ${datagrid.internal.headSize}px;`}
	class={cn(`sticky z-[${Z_INDEX_LOADING_INDICATOR}] flex min-w-fit flex-row ${STAY_IN_PLACE}`, _class)}
>
	{@render children()}
</div>
