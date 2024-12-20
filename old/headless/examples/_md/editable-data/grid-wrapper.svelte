<script lang="ts">
	import { onMount } from 'svelte';
	import { generateSalesData, type SalesDataRow } from '$lib/generate-data/generate-sales-data';
	import { DataGenerator } from '$lib/generate-data/data-generator.svelte';
	import DataGeneratorWrapper from '$lib/generate-data/data-generator-wrapper.svelte';
	import Grid from './grid.svelte';

	let generator = new DataGenerator(generateSalesData);

	onMount(async () => {
		await generator.generate();
	});
</script>

<DataGeneratorWrapper {generator}>
	{#snippet grid({ data })}
		<Grid {data}/>
	{/snippet}
</DataGeneratorWrapper>
