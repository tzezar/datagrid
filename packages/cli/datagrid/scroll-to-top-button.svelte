<script lang="ts">
	import { getContext, onMount, type Snippet } from 'svelte';
	import { cn } from '$lib/utils';
	import type { TzezarDatagrid } from './tzezar-datagrid.svelte';

	let {
		class: _class,
		icon
	}: {
		icon?: Snippet;
		class?: {
			button?: string;
			icon?: string;
		};
	} = $props();

	const datagrid = getContext<TzezarDatagrid>('datagrid');

	let scrollContainer: HTMLDivElement | null;

	onMount(() => {
		scrollContainer = document.querySelector(`[data-datagrid="${datagrid.identifier}"]`);
	});

	function scrollToTop() {
		if (!scrollContainer) return;
		scrollContainer.scrollTo({
			top: 0,
			behavior: 'smooth' // optional for smooth scrolling
		});
	}
</script>

<button
	class={cn(
		'self-end border bg-primary-foreground px-[1rem] py-[0.5rem] hover:scale-110',
		_class?.button
	)}
	onclick={() => scrollToTop()}
>
	{#if icon}
		{@render icon()}
	{:else}
		<span class={cn(_class?.icon)}>▲</span>
	{/if}
</button>
