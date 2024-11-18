<script lang='ts'>
	import type { Snippet } from "svelte";

    let {children}: {children: Snippet} = $props();
</script>

<div class='grid-wrapper'>
    {@render children()}
</div>