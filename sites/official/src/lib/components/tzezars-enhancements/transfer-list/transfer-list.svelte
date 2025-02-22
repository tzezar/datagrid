<script lang="ts">
	import type { Snippet } from 'svelte';
	import { cn } from '$lib/utils';

	type Props = {
		direction?: 'horizontal' | 'vertical';
		children: Snippet;
		class?: string;
	};

	let { direction = 'horizontal', children, class: _class = '' }: Props = $props();
</script>

<div
	class={cn(
		'flex w-full gap-4 ',
		direction === 'horizontal' ? 'flex-row' : 'flex-col',
		_class
	)}
>
	{@render children()}
</div>
