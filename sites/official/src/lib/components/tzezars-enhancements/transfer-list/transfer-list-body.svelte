<script lang="ts">
	import ScrollArea from '$lib/components/ui/scroll-area/scroll-area.svelte';
	import type { Snippet } from 'svelte';

	type Props = {
		children: Snippet;
	};

	let { children }: Props = $props();
</script>

<ScrollArea class="flex flex-col border border-t-0 p-1 h-48 rounded-b-md">
	{@render children()}
</ScrollArea>
