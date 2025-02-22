<script lang="ts">
	import { cn } from '$lib/utils';
	import { onMount, type Snippet } from 'svelte';
	import type { ScrollProgressIndicatorConfig } from './types';

	type Styles = {
		circleTrack?: string;
		circleSvg?: string;
		circleWrapper?: string;
		barTrack?: string;
		barLine?: string;
		wrapper?: string;
		container?: string;
		percentage?: string;
	};

	interface Props {
		config: ScrollProgressIndicatorConfig;
		classes?: Styles;
		color?: string;
		strokeSize?: number;
		children: Snippet;
	}

	let {
		config,
		color = 'hsl(var(--primary))',
		strokeSize = 2,
		children,
		classes
	}: Props = $props();

	let percentage = $state(0);
	let scrollYProgress = $state(0);
	let scrollContainer: HTMLElement;

	function handleScroll(event: Event) {
		const target = event.target as HTMLElement;
		const scrollHeight = target.scrollHeight - target.clientHeight;
		if (scrollHeight > 0) {
			scrollYProgress = target.scrollTop / scrollHeight;
			percentage = Math.round(scrollYProgress * 100);
		}
	}

	onMount(() => {
		if (scrollContainer) {
			scrollContainer.addEventListener('scroll', handleScroll);
			// Initial calculation
			handleScroll({ target: scrollContainer } as unknown as Event);

			return () => {
				scrollContainer.removeEventListener('scroll', handleScroll);
			};
		}
	});
</script>

<div class={cn('flex flex-col w-full', classes?.wrapper)}>
	{#if config.type === 'bar' && config.vertical === 'top' && config.outside === true}
		<div class={cn('flex h-1', classes?.barTrack)}>
			<div
				class={cn('h-full w-full bg-primary', classes?.barLine)}
				style="width: {percentage}%;"
			></div>
		</div>
	{/if}
	<div
		bind:this={scrollContainer}
		class={cn('relative max-h-[400px] overflow-auto ', classes?.container)}
	>
		<div class="relative">
			{#if config.type === 'bar' && config.vertical === 'top' && config.outside === false}
				<div class={cn('sticky left-0 right-0 top-0 z-50 h-1 w-full', classes?.barTrack)}>
					<div
						class={cn('h-full bg-primary transition-all duration-200', classes?.barLine)}
						style="width: {percentage}%;"
					></div>
				</div>
			{/if}

			{#if config.type === 'circle' && config.vertical === 'top'}
				{@render Circle()}
			{/if}

			{@render children()}

			{#if config.type === 'circle' && config.vertical === 'bottom'}
				{@render Circle()}
			{/if}
		</div>
	</div>
	{#if config.type === 'bar' && config.vertical === 'bottom'}
		<div class={cn('flex h-1', classes?.barTrack)}>
			<div
				class={cn('h-full w-full bg-primary', classes?.barLine)}
				style="width: {percentage}%;"
			></div>
		</div>
	{/if}
</div>
{#snippet Circle()}
	{#if config.type === 'circle'}
		<div
			class={cn(
				'sticky z-50 flex h-[60px] w-[60px] items-center justify-center',
				{
					'right-4 top-4': config.horizontal === 'right' && config.vertical === 'top',
					'bottom-4 right-4': config.horizontal === 'right' && config.vertical === 'bottom',
					'left-4 top-4': config.horizontal === 'left' && config.vertical === 'top',
					'bottom-4 left-4': config.horizontal === 'left' && config.vertical === 'bottom'
				},
				classes?.circleWrapper
			)}
			style={`
				position: sticky;
				${config.vertical === 'bottom' ? 'bottom: 1rem;' : 'top: 1rem;'}
				${config.horizontal === 'right' ? 'float: right; margin-right: 1rem;' : 'margin-left: 1rem;'}
			`}
		>
			{#if percentage > 0}
				<svg class={cn(classes?.circleSvg)} width="60" height="60" viewBox="0 0 100 100">
					<circle
						class={cn('stroke-primary/10 stroke-[5]', classes?.circleTrack)}
						cx="50"
						cy="50"
						r="40"
						fill="none"
					/>
					<circle
						class={cn('stroke-primary stroke-[6]', classes?.circleSvg)}
						cx="50"
						cy="50"
						r="40"
						fill="none"
						stroke-dasharray="251.2"
						style="stroke-dashoffset: {251.2 - 251.2 * scrollYProgress};"
					/>
				</svg>
				{#if config.showPercentage}
					<span class={cn('absolute text-sm font-semibold', classes?.percentage)}
						>{percentage}%</span
					>
				{/if}
			{/if}
		</div>
	{/if}
{/snippet}
