<script lang="ts">
	import { cn } from '$lib/utils';
	import type { Snippet } from 'svelte';
	import type { HTMLAnchorAttributes } from 'svelte/elements';

	type Props = {
		children: Snippet;
		class?: string;
	} & HTMLAnchorAttributes;

	let { children, class: _class, ...rest }: Props = $props();
</script>

<a {...rest} class={cn('font-medium text-foreground underline underline-offset-4', _class)}>
	{#if children}
		{@render children()}
	{/if}
</a>
