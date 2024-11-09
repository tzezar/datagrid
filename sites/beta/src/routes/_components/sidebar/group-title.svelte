<script lang="ts">
	import type { Snippet } from 'svelte';

	let { children, title = '' }: { children?: Snippet; title: string } = $props();
</script>

<span class="text-xs font-thin uppercase text-muted-foreground">{title}</span>
