<script>
	// @ts-nocheck

	import { onMount, onDestroy } from 'svelte';

	let items = $state(
		Array.from({ length: 10000 }, (_, i) => ({
			id: i,
			content: `Item ${i} with ${Math.random() > 0.5 ? 'some extra content that makes this item taller than others' : 'short content'}`
		}))
	);

	let visibleItems = $state([]);
	let containerRef;
	let heightCache = $state(new Map()); // Cache for measured heights
	let totalHeight = $state(0);
	let averageHeight = $state(50); // Initial estimate
	let observer;

	// Create a ResizeObserver to detect height changes
	function setupResizeObserver() {
		observer = new ResizeObserver((entries) => {
			let needsUpdate = false;

			entries.forEach((entry) => {
				const id = entry.target.dataset.id;
				const newHeight = entry.borderBoxSize[0].blockSize;

				if (heightCache.get(Number(id)) !== newHeight) {
					heightCache.set(Number(id), newHeight);
					needsUpdate = true;
				}
			});

			if (needsUpdate) {
				updateTotalHeight();
				updateVisibleItems();
			}
		});
	}

	function updateTotalHeight() {
		let height = 0;
		let measuredCount = 0;

		// Calculate average from measured items
		heightCache.forEach((itemHeight) => {
			height += itemHeight;
			measuredCount++;
		});

		if (measuredCount > 0) {
			averageHeight = height / measuredCount;
		}

		// Estimate total height using measured heights + average for unmeasured
		totalHeight = items.reduce((acc, item) => acc + (heightCache.get(item.id) || averageHeight), 0);
	}

	function getApproximatePosition(index) {
		let position = 0;
		for (let i = 0; i < index; i++) {
			position += heightCache.get(i) || averageHeight;
		}
		return position;
	}

	function findFirstVisibleIndex(scrollTop) {
		let position = 0;
		let index = 0;

		while (position < scrollTop && index < items.length) {
			position += heightCache.get(index) || averageHeight;
			index++;
		}

		return Math.max(0, index - 1);
	}

	function updateVisibleItems() {
		if (!containerRef) return;

		const scrollTop = containerRef.scrollTop;
		const viewportHeight = containerRef.clientHeight;
		const bufferSize = 1000; // Increased buffer for smooth scrolling

		// Find approximate visible range
		const firstVisibleIndex = findFirstVisibleIndex(Math.max(0, scrollTop - bufferSize));
		let position = getApproximatePosition(firstVisibleIndex);
		let endIndex = firstVisibleIndex;

		// Find end index
		while (position < scrollTop + viewportHeight + bufferSize && endIndex < items.length) {
			position += heightCache.get(endIndex) || averageHeight;
			endIndex++;
		}

		// Update visible items
		visibleItems = items.slice(firstVisibleIndex, endIndex + 1).map((item) => ({
			...item,
			top: getApproximatePosition(items.findIndex((i) => i.id === item.id))
		}));
	}

	function handleScroll() {
		requestAnimationFrame(updateVisibleItems);
	}

	onMount(() => {
		setupResizeObserver();
		updateVisibleItems();
	});

	onDestroy(() => {
		if (observer) {
			observer.disconnect();
		}
	});
</script>

<div class="w-full rounded-lg border shadow">
	<div bind:this={containerRef} on:scroll={handleScroll} class="relative h-[400px] overflow-y-auto">
		<!-- Total height container -->
		<div class="absolute w-full" style="height: {totalHeight}px">
			<!-- Visible items -->
			{#each visibleItems as item (item.id)}
				<div
					data-id={item.id}
					class="absolute w-full rounded bg-gray-100 p-2"
					style="transform: translateY({item.top}px);"
				>
					{item.content}
					<!-- Add some random content to demonstrate dynamic heights -->
					{#if item.id % 3 === 0}
						<div class="mt-2 text-sm text-gray-600">
							Additional content that makes this item taller
							{#if item.id % 6 === 0}
								<p class="mt-2">Even more content for some items</p>
							{/if}
						</div>
					{/if}
				</div>
			{/each}
		</div>
	</div>
</div>
