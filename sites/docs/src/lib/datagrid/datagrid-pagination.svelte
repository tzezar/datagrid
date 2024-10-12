<script lang="ts">
	import type { Snippet } from 'svelte';
	import Pagination from './shadcn/pagination.svelte';

	let { pagination }: { pagination: Snippet | undefined } = $props();
</script>

{#if !pagination}
	<Pagination />
{:else}
	{@render pagination()}
{/if}
