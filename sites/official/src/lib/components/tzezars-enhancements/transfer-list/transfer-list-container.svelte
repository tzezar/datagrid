<script lang="ts">
	import { cn } from '$lib/utils';
	import type { Snippet } from 'svelte';

	type Props = {
		children: Snippet;
		class?: string;
	};

	let { children, class: _class }: Props = $props();
</script>

<div class={cn('w-full', _class)}>
	{@render children()}
</div>
