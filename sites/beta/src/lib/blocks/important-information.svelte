<script lang="ts">
	import type { Snippet } from 'svelte';

	let { children }: { children: Snippet } = $props();
</script>

<div class="bg-primary-foreground p-4 flex flex-col gap-2">
    <p class="text-orange-400">Important</p>
    <p class="">{@render children()}</p>
</div>

