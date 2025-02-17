<script lang="ts">
	import {
		links,
		type NavigationEntry,
		type NavigationGroup,
		type NavigationItem
	} from '$lib/hrefs';
</script>

<div class="flex flex-col">
	{#each links as item}
		{@render NavigationItem(item, 0)}
	{/each}
</div>

{#snippet NavigationItem(item: NavigationItem, depth: number)}
	{#if 'children' in item}
		{@render NavigationGroup(item as NavigationGroup, depth + 1)}
	{:else}
		{@render NavigationEntry(item as NavigationEntry, depth)}
	{/if}
{/snippet}

{#snippet NavigationEntry(entry: NavigationEntry, depth: number)}
	<a href={entry.href} class="">
		{entry.title}
	</a>
{/snippet}

{#snippet NavigationGroup(group: NavigationGroup, depth: number)}
	<div class="flex flex-col gap-2 pt-2">
		<p class=" font-semibold">
			{group.title}
		</p>
		<div class="flex flex-col">
			{#each group.children as child}
				{@render NavigationItem(child, depth + 1)}
			{/each}
		</div>
	</div>
{/snippet}
