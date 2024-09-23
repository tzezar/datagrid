<script lang="ts">
	import { cn } from '$lib/utils';
	import type { Snippet } from 'svelte';

	let {
		children,
		classNames
	}: {
		children: Snippet;
		classNames?: string;
	} = $props();
</script>

<!-- ? This one is probably not needed due to problems with styling when body is inside parent container -->

<div class={cn('bg-primary-foreground ', classNames)}>
	{#if children}
		{@render children()}
	{/if}
</div>
