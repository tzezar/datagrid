<script lang="ts">
	import type { INavigationItem } from '$lib/hrefs';
	import NavigationItem from './navigation-item.svelte';

	let { links }: { links: INavigationItem[] } = $props();
</script>

<ul class="space-y-2">
	{#each links as item}
		<NavigationItem {item} depth={0} />
	{/each}
</ul>
