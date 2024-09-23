<script lang="ts">
	import { onMount } from 'svelte';

	let { withCopyButton = true, command }: { withCopyButton?: boolean; command: string } = $props();

	let isCopied = $state(false);
	let timeoutId: ReturnType<typeof setTimeout>;

	function copyToClipboard() {
		navigator.clipboard.writeText(command).then(() => {
			isCopied = true;
			clearTimeout(timeoutId);
			timeoutId = setTimeout(() => {
				isCopied = false;
			}, 2000);
		});
	}

	onMount(() => {
		return () => {
			clearTimeout(timeoutId);
		};
	});
</script>

<div class="my-4 rounded-lg bg-secondary p-4">
	<div class="flex items-center justify-between">
		<pre class="overflow-x-auto font-mono text-sm text-orange-400">{command}</pre>
		{#if withCopyButton}
			<button
				onclick={copyToClipboard}
				class="ml-4 rounded bg-orange-500 px-3 py-1 text-white transition-colors duration-200 hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-opacity-50"
			>
				{isCopied ? 'Copied!' : 'Copy'}
			</button>
		{/if}
	</div>
</div>
