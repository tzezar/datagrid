<script lang="ts">
	import { cn } from '$lib/utils';
	import type { WithChildren } from 'bits-ui';
	import type { Snippet } from 'svelte';

	type Props = WithChildren<{
		orientation?: 'vertical' | 'horizontal';
		children: Snippet;
		class?: string;
	}>;

	let { orientation = 'horizontal', class: _class, children }: Props = $props();
</script>

<div
	data-orientation={orientation}
	class={cn(
		'group/avatar-group flex items-center data-[orientation="horizontal"]:flex-row data-[orientation="vertical"]:flex-col ml-3',
		_class
	)}
>
	{#if children}
		{@render children()}
	{/if}
</div>
