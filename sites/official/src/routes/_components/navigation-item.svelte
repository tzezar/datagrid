<script lang="ts">
	import type { INavigationItem } from '$lib/hrefs';
	import NavigationEntry from './navigation-entry.svelte';
	import NavigationGroup from './navigation-group.svelte';

	let { item, depth }: { item: INavigationItem; depth: number } = $props();
</script>

{#if 'children' in item}
	<NavigationGroup group={item} depth={depth + 1} />
{:else}
	<NavigationEntry entry={item} {depth} />
{/if}
