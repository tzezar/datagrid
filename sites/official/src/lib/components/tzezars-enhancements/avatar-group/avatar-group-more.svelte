<script lang="ts">
	import { cn } from '$lib/utils';
	import type { Snippet } from 'svelte';

	type Props = {
		count: number;
		children?: Snippet;
		class?: string;
	};

	let { count, children, class: _class }: Props = $props();
</script>

<div
	class={cn(
		'relative flex size-10 items-center justify-center rounded-full bg-accent text-sm ring ring-background group-data-[orientation="horizontal"]/avatar-group:-ml-4 group-data-[orientation="vertical"]/avatar-group:-mt-2',
		_class
	)}
>
	{#if children}
		{@render children()}
	{:else}
		<span class="text-sm font-semibold">+{count}</span>
	{/if}
</div>
