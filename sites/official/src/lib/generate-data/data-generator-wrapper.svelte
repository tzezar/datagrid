<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { DataGenerator } from './data-generator.svelte';
	import type { Datagrid } from '$lib/tzezars-datagrid/core/index.svelte';


	let { generator, grid }: { generator: DataGenerator; grid: Snippet<[{ data: any[] }]> } =
		$props();
</script>

<div class="mx-auto">
	<div class="mb-4 flex flex-row items-end justify-center gap-4">
		<div class="flex grow flex-col">
			<label for="rowCount" class="mb-1 text-sm font-medium">Number of rows:</label>
			<input
				id="rowCount"
				type="number"
				bind:value={generator.rowCount}
				min="1"
				max="10000000"
				class="rounded border px-2 py-1"
			/>
		</div>
		<button
			onclick={() => generator.generate()}
			disabled={generator.isLoading}
			class="h-fit rounded bg-orange-400 px-4 py-1 text-white hover:bg-orange-500 disabled:opacity-50"
		>
			{generator.isLoading ? 'Generating...' : 'Regenerate Data'}
		</button>
	</div>

	{#if generator.error}
		<div class="mb-4 text-red-500">{generator.error}</div>
	{/if}

	{#if generator.isLoading}
		<div>
			<p>Generating {generator.rowCount.toLocaleString()} rows...</p>
			<p class="text-xs">that's a lot of data to load for a browser</p>
			<div class="progress-container mt-2">
				<div class="progress-bar" style="width: {generator.progress}%;">{generator.progress}%</div>
			</div>
			<p class="pt-2 text-xs">
				If your device can't handle this, please let me know on github. I will adjust the number of
				rows.
			</p>
		</div>
	{:else}
		{@render grid({ data: generator.data })}
	{/if}
</div>

<style>
	.progress-container {
		width: 100%;
		height: 20px;
		background-color: #e0e0e0;
		overflow: hidden;
	}
	.progress-bar {
		height: 100%;
		background-color: theme('colors.orange.400');
		text-align: center;
		white-space: nowrap;
		transition: width 0.1s ease;
	}
</style>
