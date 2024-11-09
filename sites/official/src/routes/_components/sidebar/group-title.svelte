<script lang="ts">
	import { cn } from '$lib/utils';
	import type { Snippet } from 'svelte';

	let {
		children,
		title = '',
		class: _class
	}: { children?: Snippet; title: string; class?: string } = $props();
</script>

<span class={cn('text-sm text-muted-foreground font-normal uppercase ', _class)}>{title}</span>
