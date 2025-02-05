<script lang="ts">
	import PostComingSoon from '$lib/blocks/post-coming-soon.svelte';
import { formatDate } from '$lib/utils.js';

	let { data } = $props();
</script>


{#if data.meta.published}

<div class="prose dark:prose-invert flex flex-col grow min-w-full pb-8"> 
	<data.content {data}></data.content>
</div>
{:else}
	<PostComingSoon />
{/if}

