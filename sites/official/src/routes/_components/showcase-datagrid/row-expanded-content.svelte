<script lang="ts">
	import type { GridBasicRow } from '$lib/datagrid/core/types';

	let { row }: { row: GridBasicRow<any> } = $props();

	// Async function that simulates fetching data from an API
	async function fetchProducts() {
		// Simulate network delay
		await new Promise((resolve) => setTimeout(resolve, 2000));

		// Simulate API response
		return [
			{ id: 1, name: 'Laptop', price: 1299 },
			{ id: 2, name: 'Smartphone', price: 899 },
			{ id: 3, name: 'Headphones', price: 299 },
			{ id: 4, name: 'Tablet', price: 599 },
			{ id: 5, name: 'Smartwatch', price: 249 }
		];
	}

	// Create a promise that will be used with Svelte's #await block
	const productsPromise = fetchProducts();

	// Loading indicator dots animation
	let dots = '';

	// Update dots animation
	const dotsInterval = setInterval(() => {
		dots = dots.length < 3 ? dots + '.' : '';
	}, 500);

	// Clean up the interval when component is destroyed
	import { onDestroy } from 'svelte';
	onDestroy(() => {
		clearInterval(dotsInterval);
	});
</script>

<main class="">
	<h1 class="!text-foreground w-full pb-4">Product Catalog</h1>

	{#await productsPromise}
		<div class="loader-container">
			<div class="spinner"></div>
			<p>Loading products for {row.original['name']} in row {row.identifier}<span class="dots">{dots}</span></p>
		</div>
	{:then products}
		<div class="product-list">
			{#if products.length === 0}
				<p class="empty-state">No products found.</p>
			{:else}
				<ul>
					{#each products as product (product.id)}
						<li class="product-item">
							<h3>{product.name}</h3>
							<p class="price">${product.price}</p>
						</li>
					{/each}
				</ul>
			{/if}
		</div>
	{:catch error}
		<p class="error">Error loading products: {error.message}</p>
	{/await}
</main>

<style>
	main {
		max-width: 800px;
		margin: 0 auto;
		padding: 1rem;
	}

	h1 {
		color: #333;
		text-align: center;
	}

	/* Loader styles */
	.loader-container {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		padding: 2rem;
	}

	.spinner {
		width: 40px;
		height: 40px;
		border: 4px solid #f3f3f3;
		border-top: 4px solid #3498db;
		border-radius: 50%;
		animation: spin 1s linear infinite;
		margin-bottom: 1rem;
	}

	@keyframes spin {
		0% {
			transform: rotate(0deg);
		}
		100% {
			transform: rotate(360deg);
		}
	}

	.dots {
		display: inline-block;
		width: 24px;
	}

	/* Product list styles */
	.product-list {
		@apply flex flex-row;
		width: 100%;
	}

	ul {
		@apply flex w-full gap-6;
		list-style: none;
		padding: 0;
	}

	.product-item {
		border: 1px solid #eee;
		padding: 1rem;
		margin-bottom: 1rem;
		border-radius: 4px;
		box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
		transition:
			transform 0.2s,
			box-shadow 0.2s;
	}

	.product-item:hover {
		transform: translateY(-2px);
		box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
	}

	h3 {
		@apply text-foreground;
		margin-top: 0;
	}

	.price {
		font-weight: bold;
		color: #2c7ac9;
	}

	.empty-state {
		text-align: center;
		color: #888;
		font-style: italic;
		padding: 2rem;
	}

	.error {
		color: #d00;
		background: #fff8f8;
		padding: 1rem;
		border-radius: 4px;
		border: 1px solid #fcc;
	}
</style>
