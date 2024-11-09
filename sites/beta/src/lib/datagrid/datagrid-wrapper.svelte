<script lang="ts">
	import { cn } from '$lib/utils';
	import { getContext, type Snippet } from 'svelte';
	import type { TzezarDatagrid } from './tzezar-datagrid.svelte';
	let datagrid = getContext<TzezarDatagrid<unknown>>('datagrid');

	let { children, end, class: _class }: { children: Snippet; end: HTMLElement | undefined, class?: string } = $props();

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

<div
	class={cn(
		'flex flex-col ',
		datagrid.state.isFullscreenActive && 'bg-background absolute inset-0 z-[20]  p-4',
		_class
	)}
	style="font-size: {datagrid.options.fontSize.selected.value};"
>
	{@render children()}
</div>
