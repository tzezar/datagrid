<script lang="ts">
	import type { INavigationEntry } from '$lib/hrefs';

	let { entry, depth }: { entry: INavigationEntry, depth: number } = $props();
</script>

<li>
	<a
		href={entry.href}
		class="hover:bg-primary-foreground block rounded py-1 text-sm font-normal px-2"
	>
		{entry.title}
	</a>
</li>
