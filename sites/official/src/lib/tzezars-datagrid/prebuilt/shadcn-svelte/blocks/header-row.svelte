<script lang='ts'>
	import type { Snippet } from "svelte";

    let {children, ...props}: {children: Snippet} = $props();
</script>

<div class='grid-header-row' {...props}>
    {@render children()}
</div>