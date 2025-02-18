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

<!-- ? not sure if this component is needed due to new CONST style vars -->

<div class={cn('flex min-w-fit flex-row ', _class)}>
	{#if children}
		{@render children()}
	{/if}
</div>
