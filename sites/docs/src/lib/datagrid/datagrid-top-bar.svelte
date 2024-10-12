<script lang="ts">
	import type { Snippet } from 'svelte';
	import TopBar from './top-bar.svelte';

	let { topBar }: { topBar: Snippet | undefined } = $props();

</script>

{#if topBar}
	{@render topBar()}
{:else}
	<TopBar />
{/if}