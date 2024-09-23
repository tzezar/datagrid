<script lang="ts">
	import { cn } from "$lib/utils";
	import type { Snippet } from "svelte";

	let { children, class: _class, description }: { children: Snippet, class?: string, description?: Snippet } = $props();
</script>

<div class={cn("flex flex-col gap-8", _class)}>
	{@render children()}
	
</div>
