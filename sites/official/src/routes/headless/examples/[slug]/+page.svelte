<script lang="ts">
	let { data } = $props();
</script>

<svelte:head>
	<title>{data.meta.title}</title>
	<meta property="og:type" content="article" />
	<meta property="og:title" content={data.meta.title} />
</svelte:head>

<article>
	<div class="test">
		<data.content />
	</div>
</article>

<style>
	:global(.test :is(h1)) {
		@apply text-orange-500 text-xl font-semibold;
	}
    :global(.test :is(pre)) {
        @apply p-4;
    }
</style>
