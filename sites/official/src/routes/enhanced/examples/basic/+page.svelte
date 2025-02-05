<script lang="ts">
	import PostComingSoon from '$lib/blocks/post-coming-soon.svelte';
	let { data } = $props();
	// @ts-expect-error
	import Documentation, {metadata} from './documentation.md';
</script>

{#if metadata.published}
	<div class="prose dark:prose-invert flex min-w-full grow flex-col pb-8">
		<Documentation {data}></Documentation>
	</div>
{:else} 
	<PostComingSoon />
{/if}
