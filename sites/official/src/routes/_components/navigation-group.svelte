<script lang="ts">
	import type { INavigationGroup } from '$lib/hrefs';

	import { cn } from '$lib/utils';
	import NavigationItem from './navigation-item.svelte';

	let { group, depth }: { group: INavigationGroup; depth: number } = $props();
</script>

<div class={cn('flex flex-col')}>
	<div>
		<p
			class={cn(
				'w-full px-2  text-sm font-semibold',
				['Headless', 'Enhanced'].includes(group.title) ?
					'text-foreground border-b border-t pb-2 text-lg font-semibold my-4 py-2' : 'text-xs text-muted-foreground pt-4'
			)}
		>
			{group.title}
		</p>
		<div class="flex flex-col">
			{#each group.children as item}
				<NavigationItem {item} depth={depth + 1} />
			{/each}
		</div>
	</div>
</div>
