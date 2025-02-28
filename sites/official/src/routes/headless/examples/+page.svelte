<script lang='ts'>
	import Link from "$lib/components/tzezars-enhancements/link/link.svelte";
import { navigationTree } from "../../_layout/navigation-tree";

    let tree = navigationTree.navMain.find((item) => item.url === '/headless/examples')
</script>

<div class='flex flex-col gap-4'>
    {#each tree?.items || [] as item}
    <Link href={item.url}>{item.title}</Link>
{/each}

</div>
  