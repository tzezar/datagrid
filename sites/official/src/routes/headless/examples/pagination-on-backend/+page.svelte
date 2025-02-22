<script lang="ts">
	let { data } = $props();
</script>

<svelte:head>
	<title>{data.meta.title}</title>
	<meta property="og:type" content="article" />
	<meta property="og:title" content={data.meta.title} />
</svelte:head>

{#await data}
	<p>Loading...</p>
{:then value}
	<div class="markdown">
		<data.content {data} />
	</div>
{/await}
