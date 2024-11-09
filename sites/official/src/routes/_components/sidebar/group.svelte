<script lang="ts">
	import type { Snippet } from 'svelte';

	let { children }: { children: Snippet } = $props();
</script>

<div class="flex w-full flex-col gap-1 text-sm">
	{@render children()}
</div>
