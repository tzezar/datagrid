<script lang="ts">
	import type { Snippet } from 'svelte';
	import TopBar from './top-bar.svelte';

	export let topBar: Snippet | undefined;
</script>

{#if topBar}
	{@render topBar()}
{:else}
	<TopBar />
{/if}