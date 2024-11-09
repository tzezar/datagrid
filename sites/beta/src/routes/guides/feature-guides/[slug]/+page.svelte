<script lang="ts">
	import { formatDate } from '$lib/utils';

	export let data;
</script>

<!-- SEO -->
<svelte:head>
	<title>{data.meta.title}</title>
	<meta property="og:type" content="article" />
	<meta property="og:title" content={data.meta.title} />
</svelte:head>

<article class="flex w-full flex-col">
	<group>
		<h1 class="text-3xl font-bold">{data.meta.title}</h1>
		<p class="text-muted-foreground">Published at {formatDate(data.meta.date)}</p>
	</group>
	<div class="prose dark:prose-invert pt-8 min-w-full ">
		<svelte:component this={data.content} />
	</div>
</article>

<style>
</style>
