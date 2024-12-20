<script lang="ts">
	import { onMount } from 'svelte';
	import Datagrid from './_components/datagrid.svelte';
	import { generateSalesData, type SalesDataRow } from '$lib/generate-data/generate-sales-data';
	import { DataGenerator } from '$lib/generate-data/data-generator.svelte';
	import DataGeneratorWrapper from '$lib/generate-data/data-generator-wrapper.svelte';

	let generator = new DataGenerator(generateSalesData)

	onMount(async () => {
		await generator.generate();
	});
</script>

<DataGeneratorWrapper {generator}>
	{#snippet grid({data})}
		<Datagrid {data} />
	{/snippet}
</DataGeneratorWrapper>

<div
	class="align-middlep mx-auto flex max-w-xl flex-col items-center justify-center py-20 text-xl font-bold uppercase"
></div>


