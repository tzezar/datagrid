<script>
    import { onMount } from 'svelte';


    let data

    onMount(async () => {
        data = await import(`./_components/documentation.md`)
    })

</script>
<!-- SEO -->
 


<article class="flex w-full flex-col">
	<group>
		<h1 class="text-3xl font-bold">{data?.metadata?.title}</h1>
	</group>
	<div class="prose dark:prose-invert pt-8 min-w-full ">
		<svelte:component this={data?.default} />
	</div>
</article>