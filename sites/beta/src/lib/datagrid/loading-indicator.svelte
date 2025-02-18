<script lang="ts">
	import { cn } from '$lib/utils';

	let {
		isFetching = true,
		isError,
		isRefetching,
		class: _class
	}: {
		class?: {
			wrapper?: string;
			loading?: string;
			error?: string;
		};
		isFetching: boolean;
		isError: boolean;
		isRefetching: boolean;
	} = $props();
</script>

{#if isFetching || isRefetching}
	<div class={cn('relative h-1 w-full overflow-hidden bg-gray-200', _class?.wrapper)}>
		<div class={cn('animate-lineLoader h-full bg-blue-500', _class?.loading)}></div>
	</div>
{/if}
{#if isError}
	<div class={cn('relative h-1 w-full overflow-hidden bg-gray-200', _class?.wrapper)}>
		<div class={cn('animate-lineLoader h-full bg-red-500', _class?.error)}></div>
	</div>
{/if}

<style>
	@keyframes lineLoader {
		0% {
			transform: translateX(-100%);
		}
		100% {
			transform: translateX(100%);
		}
	}

	.animate-lineLoader {
		animation: lineLoader 1.5s ease-in-out infinite;
	}
</style>
