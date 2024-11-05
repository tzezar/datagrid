<script lang="ts">
	import Datagrid from './_components/datagrid.svelte';
	import { onMount } from 'svelte';

	type DataItem = {
		id: number;
		department: {
			name: string;
		};
		region: string;
		sales: number;
		profit: number;
	};

	let progress = 0;
	let data: DataItem[] = [];
	let isLoading = true;
	let rowCount = 100_000; // Default row count
	let error = ''; // For input validation

	async function generateData(count: number): Promise<DataItem[]> {
		// Reset data and progress
		data = [];
		progress = 0;
		error = '';

		const departments = ['Sales', 'Marketing', 'Engineering', 'HR', 'Finance'];
		const regions = ['North', 'South', 'East', 'West', 'Central'];

		// Simulate data generation in batches to update progress
		const batchSize = 10_000; // Adjust as needed for finer progress control
		for (let i = 0; i < count; i += batchSize) {
			// Calculate actual batch size (handle last batch)
			const currentBatchSize = Math.min(batchSize, count - i);

			// Generate a batch of data items
			const batch = Array.from({ length: currentBatchSize }, (_, j) => ({
				id: i + j + 1,
				department: {
					name: departments[Math.floor(Math.random() * departments.length)]
				},
				region: regions[Math.floor(Math.random() * regions.length)],
				sales: parseFloat((Math.random() * 10000).toFixed(2)),
				profit: parseFloat((Math.random() * 5000 - 2500).toFixed(2))
			}));

			// Append batch to the data array
			data = [...data, ...batch];

			// Update progress
			progress = Math.min(100, Math.round(((i + currentBatchSize) / count) * 100));

			// Delay to mimic asynchronous batch processing
			await new Promise((resolve) => setTimeout(resolve, 10));
		}

		return data;
	}

	async function handleGenerate() {
		// Input validation
		const count = Number(rowCount);
		if (isNaN(count) || count <= 0 || count > 10_000_000) {
			error = 'Please enter a number between 1 and 10,000,000';
			return;
		}

		isLoading = true;
		try {
			data = await generateData(count);
		} catch (e) {
			error = 'Error generating data. Please try again.';
		} finally {
			isLoading = false;
		}
	}




	onMount(async () => {
		await handleGenerate();
	});
</script>

<div class="p-4">
	<div class="mb-4 flex flex-col justify-center gap-4">
		<div class="flex flex-col">
			<label for="rowCount" class="mb-1 text-sm font-medium">Number of rows:</label>
			<input
				id="rowCount"
				type="number"
				bind:value={rowCount}
				min="1"
				max="10000000"
				class="rounded border px-2 py-1"
			/>
		</div>
		<button
			on:click={handleGenerate}
			disabled={isLoading}
			class="rounded bg-orange-400 px-4 py-2 text-white hover:bg-orange-500 disabled:opacity-50"
		>
			{isLoading ? 'Generating...' : 'Regenerate Data'}
		</button>
	</div>

	{#if error}
		<div class="mb-4 text-red-500">{error}</div>
	{/if}

	{#if isLoading}
		<div>
			<p>Generating {rowCount.toLocaleString()} rows...</p>
			<p class="text-xs">that's a lot of data to load for a browser</p>
			<div class="progress-container mt-2">
				<div class="progress-bar" style="width: {progress}%;">{progress}%</div>
			</div>
			<p class="pt-2 text-xs">
				If your device can't handle this, please let me know on github. I will adjust the number of
				rows.
			</p>
		</div>
	{:else}
		<Datagrid {data} />
	{/if}
</div>


<div class='mx-auto max-w-xl flex justify-center align-middlep py-20'>
	<a href="https://github.com/tzezar/datagrid">Github repository</a>
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
