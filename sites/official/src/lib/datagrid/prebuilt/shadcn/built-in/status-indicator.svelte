<script lang="ts">
	import { cn } from '$lib/utils';
	import { TzezarsDatagrid } from '../core/index.svelte';

	type Props = {
		datagrid: TzezarsDatagrid<any>;
		position: 'top' | 'bottom'
	};

	let { datagrid, position }: Props = $props();

	const { isLoading, isSaving, isError } = $derived(datagrid.extra.features.loadingIndicator);
</script>

{#if datagrid.extra.features.loadingIndicator.shouldShowLoadingIndicator(position)}
	<div
		class={cn(
			'sticky left-0  w-full overflow-hidden bg-gray-200',
			position === 'top' && 'top-0',
			position === 'bottom' && 'bottom-0'
		)}
	>
		{#if isLoading}
			<div class={cn('relative h-1 w-full overflow-hidden bg-gray-200')}>
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
