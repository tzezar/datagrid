<script lang="ts">
	import { cn } from '$lib/utils';
	import { EnhancedDatagrid } from '../core/index.svelte';

	type Props = {
		datagrid: EnhancedDatagrid<any>;
		position: 'top' | 'bottom' | 'both'
	};

	let { datagrid, position }: Props = $props();

	const { isLoading, isSaving, isError } = $derived(datagrid.extra.features.loadingIndicator);
</script>

{#if datagrid.extra.features.loadingIndicator.shouldShowLoadingIndicator(position)}
	<div
		class={cn(
			'sticky left-0 right-0 z-10 w-full overflow-hidden bg-gray-200 border-x',
			position === 'top' && 'top-0',
			position === 'bottom' && 'bottom-0'
		)}
		style="position: -webkit-sticky;"
	>
		{#if isLoading}
			<div class={cn('relative h-[0.125rem] w-full overflow-hidden bg-gray-200')}>
				<div
					class={cn(
						'animate-lineLoader h-full ',
						isSaving && 'bg-green-500',
						isLoading && 'bg-blue-500',
						isError && 'bg-red-500'
					)}
				></div>
			</div>
		{/if}
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