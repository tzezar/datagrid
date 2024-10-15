<script lang="ts">
	import MaterialSymbolsLightFolderOpenOutline from './icones/MaterialSymbolsLightFolderOpenOutline.svelte';
	import MaterialSymbolsLightCastWarningOutline from './icones/MaterialSymbolsLightCastWarningOutline.svelte'; 
	import MaterialSymbolsLightHourglassOutline from './icones/MaterialSymbolsLightHourglassOutline.svelte'; 
	import { getContext, type Snippet } from 'svelte';
	import type { TzezarDatagrid } from './tzezar-datagrid.svelte';
	import { cn } from '$lib/utils';

	const datagrid = getContext<TzezarDatagrid<unknown>>('datagrid');

	let isEmpty = $derived(
		(datagrid.mode === 'clint' && datagrid.internal.paginatedData.length === 0) ||
			(datagrid.mode === 'server' && datagrid.data.length === 0)
	);

	let {
		errorIcon,
		loadingIcon,
		emptyIcon,
		class: _class,
		isLoading,
		isError
	}: {
		class?: {
			wrapper?: string;
			loading?: string;
			error?: string;
			empty?: string;
			subtitle?: string;
		};
		isLoading: boolean;
		isError: boolean;
		emptyIcon?: Snippet;
		loadingIcon?: Snippet;
		errorIcon?: Snippet;
	} = $props();
</script>

<div class={cn('min-h-full w-full', _class?.wrapper)}>
	{#if isLoading && !isError && isEmpty}
		<div class={cn('bg-primary-foreground flex flex-col p-4 align-middle', _class?.loading)}>
			{#if loadingIcon}
				{@render loadingIcon()}
			{:else}
				<MaterialSymbolsLightHourglassOutline class="mx-auto size-20" />
			{/if}
			<span class={cn('mx-auto font-semibold', _class?.subtitle)}>Your data is loading</span>
		</div>
	{/if}
	{#if isEmpty && !isLoading && !isError}
		<div class={cn('bg-primary-foreground flex flex-col p-4 align-middle', _class?.empty)}>
			{#if emptyIcon}
				{@render emptyIcon()}
			{:else}
				<MaterialSymbolsLightFolderOpenOutline class="mx-auto size-20" />
			{/if}
			<span class={cn('mx-auto font-semibold', _class?.subtitle)}>No data</span>
		</div>
	{/if}
	{#if isError}
		<div class={cn('bg-primary-foreground flex flex-col p-4 align-middle', _class?.error)}>
			{#if errorIcon}
				{@render errorIcon()}
			{:else}
				<MaterialSymbolsLightCastWarningOutline class="mx-auto size-20" />
			{/if}
			<span class={cn('mx-auto font-semibold', _class?.subtitle)}>Something went wrong</span>
		</div>
	{/if}
</div>
