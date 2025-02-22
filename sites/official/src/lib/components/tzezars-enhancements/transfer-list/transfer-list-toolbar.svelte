<script lang="ts">
	import Button from '$lib/components/ui/button/button.svelte';
	import Input from '$lib/components/ui/input/input.svelte';
	import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-svelte';
	import type { Snippet } from 'svelte';
	import type { TransferListCore } from './transfer-list-core.svelte';
	import { cn } from '$lib/utils';

	type Props = {
		core: TransferListCore<any>;
		children?: Snippet;

		class?: {
			container?: string;
			input?: string;
			moveAllIcon?: string;
			moveSelectedIcon?: string;
		};

		variant: 'source' | 'target';

		moveSelectedIconSlot?: Snippet;
		moveAllIconSlot?: Snippet;
		inputSlot?: Snippet;

		inputPlaceholder?: string;
	};

	let {
		children,
		core,
		variant,
		inputPlaceholder = 'Search...',
		moveAllIconSlot,
		moveSelectedIconSlot,
		inputSlot,
		class: _class
	}: Props = $props();
</script>

<div class="flex">
	{#if children}
		{@render children()}
	{:else if variant === 'source'}
		{#if inputSlot}
			{@render inputSlot()}
		{:else}
			<Input
				class={cn('rounded-none rounded-tl-md focus-visible:ring-0', _class?.input)}
				oninput={(e) => core.updateSearch('source', e.currentTarget.value)}
				placeholder={inputPlaceholder}
			/>
		{/if}

		<Button
			variant="outline"
			class={cn(
				'rounded-none border-x-0 disabled:opacity-100',
				!core.hasSourceSelection() && 'cursor-not-allowed text-muted-foreground',
				_class?.moveSelectedIcon
			)}
			onclick={() => core.transferSelected('source')}
		>
			{#if moveSelectedIconSlot}
				{@render moveSelectedIconSlot()}
			{:else}
				<ChevronRight />
			{/if}
		</Button>
		<Button
			variant="outline"
			class={cn('rounded-none rounded-tr-md', _class?.moveAllIcon)}
			onclick={() => core.transferAll('source')}
		>
			{#if moveAllIconSlot}
				{@render moveAllIconSlot()}
			{:else}
				<ChevronsRight />
			{/if}
		</Button>
	{:else if variant === 'target'}
		<Button
			variant="outline"
			class={cn('rounded-none rounded-tl-md disabled:opacity-100', _class?.moveAllIcon)}
			onclick={() => core.transferAll('target')}
		>
			{#if moveAllIconSlot}
				{@render moveAllIconSlot()}
			{:else}
				<ChevronsLeft />
			{/if}
		</Button>
		<Button
			variant="outline"
			class={cn(
				'rounded-none border-x-0 disabled:opacity-100',
				!core.hasTargetSelection() && 'cursor-not-allowed text-muted-foreground',
				_class?.moveSelectedIcon
			)}
			onclick={() => core.transferSelected('target')}
		>
			{#if moveSelectedIconSlot}
				{@render moveSelectedIconSlot()}
			{:else}
				<ChevronLeft />
			{/if}
		</Button>
		{#if inputSlot}
			{@render inputSlot()}
		{:else}
			<Input
				class={cn('rounded-none rounded-tr-md focus-visible:ring-0', _class?.input)}
				oninput={(e) => core.updateSearch('target', e.currentTarget.value)}
				placeholder={inputPlaceholder}
			/>
		{/if}
	{/if}
</div>
