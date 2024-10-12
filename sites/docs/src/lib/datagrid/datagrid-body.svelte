<script lang="ts">
	import { type Snippet } from 'svelte';

	let { body }: { body: Snippet | undefined } = $props();

	// ? BODY can not be wrapped inside html element, it break sticky and rows
	// ? there is possibility to move other elements like header, topbar etc to ouside of parent container
	// ? but then header and body X axis scroll have to be synced via js
</script>

{#if body}
	{@render body()}
{/if}
