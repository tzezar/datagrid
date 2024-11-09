<script lang="ts">
	let { title, description }: { title: string; description: string } = $props();

	// Split the title once for better performance
	const formattedTitle = {
		firstLetter: title.charAt(0).toUpperCase(),
		rest: title.slice(1)
	};
</script>

<div class="flex flex-col">
	<div class="flex-grow">
		<div class="flex flex-row items-center gap-2">
			<div class='bg-orange-400 h-3 w-3 rounded-full'></div>
			<h2 class="title-font mb-[3px] text-lg font-medium leading-relaxed">
				{title}
			</h2>
		</div>
		<p class="text-base leading-relaxed text-muted-foreground">
			{description}
		</p>
	</div>
</div>
