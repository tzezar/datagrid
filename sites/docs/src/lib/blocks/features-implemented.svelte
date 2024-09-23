<script lang="ts">
	let { title = 'Features Implemented', features }: { title?: string; features: string[] } = $props();
</script>

<div>
	<p class="pb-2">{title}</p>
	<ul class="list-inside list-disc">
		{#each features as feature}
			<li>{feature}</li>
		{/each}
	</ul>
</div>
