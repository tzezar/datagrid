<script lang="ts">
	import { cn } from '$lib/utils';
	import type { Snippet } from 'svelte';

	type Props = {
		title: string;
		class?: string;
		children?: Snippet;
	};

	let { title, class: _class, children }: Props = $props();
</script>

{#if children}
	{@render children()}
{:else}
	<p class={cn('pb-1 font-semibold', _class)}>{title}</p>
{/if}
