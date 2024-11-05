<script lang="ts">
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

	const createAccessor = (path: string): ((obj: DataItem) => any) => {
		const parts = path.split('.');

		// For non-nested properties, use direct access for best performance
		if (parts.length === 1) {
			return (obj: DataItem) => obj[path];
		}

		// For nested properties, create optimized function
		// This is faster than using reduce() or recursive function calls
		switch (parts.length) {
			case 2:
				return (obj: DataItem) => obj[parts[0]]?.[parts[1]];
			case 3:
				return (obj: DataItem) => obj[parts[0]]?.[parts[1]]?.[parts[2]];
			default:
				// Fallback for deeply nested properties (rare case)
				return (obj: DataItem) => {
					let value = obj;
					for (let i = 0; i < parts.length; i++) {
						value = value?.[parts[i]];
						if (value === undefined) return undefined;
					}
					return value;
				};
		}
	};

	interface SortingDirection {
		columnId: string;
		direction: 'asc' | 'desc';
		// Pre-compiled accessor function for better performance
		accessor: (obj: DataItem) => any;
	}
	const setupSorting = (
		sortingConfig: Array<{
			columnId: string;
			direction: 'asc' | 'desc';
		}>
	) => {
		return sortingConfig.map((config) => ({
			...config,
			accessor: createAccessor(config.columnId)
		}));
	};

	const multiSortData = (data: DataItem[], sortingDirections: SortingDirection[]) => {
		return data.sort((a, b) => {
			for (const { accessor, direction } of sortingDirections) {
				const valueA = accessor(a);
				const valueB = accessor(b);

				if (valueA < valueB) return direction === 'asc' ? -1 : 1;
				if (valueA > valueB) return direction === 'asc' ? 1 : -1;
			}
			return 0;
		});
	};
	// Example usage:
	const sortingConfig = setupSorting([
		{ columnId: 'department.name', direction: 'desc' },
		{ columnId: 'sales', direction: 'asc' }
	]);
	const benchmark = (data: DataItem[], sortingDirections: SortingDirection[]) => {
		const timeStart = performance.now();
		const sorted = multiSortData([...data], sortingDirections);
		const duration = performance.now() - timeStart;
		return { duration, sorted };
	};

	// Example usage in onMount with asynchronous data generation
	onMount(async () => {
		data = await generateData(rowCount);
		const { duration, sorted } = benchmark(data, sortingConfig);
		console.log(`Sorting completed in ${duration}ms`);
	});

</script>
