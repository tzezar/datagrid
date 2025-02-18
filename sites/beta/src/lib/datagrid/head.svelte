<script lang="ts">
	import { cn } from '$lib/utils';
	import type { Snippet } from 'svelte';

	let {
		children,
		class: _class
	}: {
		children: Snippet;
		class?: string;
	} = $props();
</script>

<div class={cn('sticky top-0 z-20 bg-primary-foreground', _class)}>
	{#if children}
		{@render children()}
	{/if}
</div>
