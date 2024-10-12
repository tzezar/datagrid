<script lang="ts">
	import Pagination from './shadcn/pagination.svelte';

	export let pagination: Snippet | undefined;
</script>

{#if !pagination}
	<Pagination />
{:else}
	{@render pagination()}
{/if}