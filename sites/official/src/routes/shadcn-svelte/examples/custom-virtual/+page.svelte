<script>
	import { onMount } from 'svelte';
    
	let items = $state(Array.from({ length: 10000 }, (_, i) => `Item ${i}`));
	let visibleItems = $state([]);
	let containerRef;
	let lastScrollTop = 0;

	const itemHeight = 40;
	const bufferSize = 20; // Increased buffer size
	const windowSize = 50; // Number of items to show at once

	function updateVisibleItems() {
		if (!containerRef) return;

		const scrollTop = containerRef.scrollTop;
		const viewportHeight = containerRef.clientHeight;

		// Calculate the range of items that should be visible
		const startIndex = Math.max(0, Math.floor(scrollTop / itemHeight) - bufferSize);
		const endIndex = Math.min(
			items.length,
			Math.ceil((scrollTop + viewportHeight) / itemHeight) + bufferSize
		);

		// Update visible items
		visibleItems = items.slice(startIndex, endIndex).map((item, index) => ({
			content: item,
			index: startIndex + index,
			top: (startIndex + index) * itemHeight
		}));
	}

	function handleScroll(event) {
		const currentScrollTop = event.target.scrollTop;
		// Only update if scrolled more than 2 items worth
		if (Math.abs(currentScrollTop - lastScrollTop) > itemHeight * 2) {
			lastScrollTop = currentScrollTop;
			updateVisibleItems();
		}
	}

	onMount(() => {
		updateVisibleItems();
	});
</script>

<div class="w-full rounded-lg border shadow">
	<div bind:this={containerRef} on:scroll={handleScroll} class="relative h-[400px] overflow-y-auto">
		<!-- Total height container -->
		<div class="absolute w-full" style="height: {items.length * itemHeight}px">
			<!-- Visible items -->
			{#each visibleItems as { content, top } (content)}
				<div
					class="absolute w-full rounded bg-gray-100 p-2"
					style="transform: translateY({top}px); height: {itemHeight}px;"
				>
					{content}
				</div>
			{/each}
		</div>
	</div>
</div>
