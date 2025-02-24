<!-- src/routes/+layout.svelte -->
<script lang="ts">
	import { Toaster } from '$lib/components/ui/sonner';
	import { ModeWatcher } from 'mode-watcher';
	import '../app.css';
	import { onMount, tick, type Snippet } from 'svelte';
	import Separator from '$lib/components/ui/separator/separator.svelte';
	import * as Breadcrumb from '$lib/components/ui/breadcrumb/index.js';
	import LightSwitch from './_components/light-switch.svelte';
	import { page } from '$app/stores';
	import AppBarMobile from './_layout/app-bar-mobile.svelte';
	import AppBarContent from './_layout/app-bar-content.svelte';
	import { afterNavigate } from '$app/navigation';

	let { children }: { children: Snippet } = $props();

	let scrollFix: HTMLElement

	let pathSegments = $derived(
		$page.url.pathname
			.split('/')
			.filter(Boolean)
			.map((segment, index, array) => ({
				label: segment.charAt(0).toUpperCase() + segment.slice(1),
				href: '/' + array.slice(0, index + 1).join('/')
			}))
	);

	afterNavigate(async () => {
		await tick();
		scrollFix.scrollTo(0, 0);
	});
</script>

<Toaster richColors />
<ModeWatcher />
<div class="custom-scrollbar flex h-screen flex-col overflow-hidden md:flex-row">
	<!-- Sidebar (always visible on desktop, hidden on mobile) -->

	{@render DesktopSidebar()}
	<div class="flex h-screen flex-1 flex-col overflow-hidden">
		<!-- Main Content (scrollable) -->
		<header class="bg-background sticky top-0 z-20 flex h-16 shrink-0 items-center gap-2 border-b">
			<div class="z-[100] flex items-center gap-2 px-4">
				<AppBarMobile />
				<Separator orientation="vertical" class="mr-2 h-4" />
				{@render Okruszki()}
			</div>
			<div class="ml-auto pr-3">
				<LightSwitch />
			</div>
		</header>
		<main class="flex-1 overflow-y-auto p-4" bind:this={scrollFix}>
			{@render children()}
		</main>
	</div>
</div>

{#snippet DesktopSidebar()}
	<aside
		id="desktop-nav"
		class="bg-sidebar text-sidebar-foreground hidden h-screen max-w-sm overflow-y-auto border-r md:block md:w-[16rem]"
	>
		<AppBarContent />
	</aside>
{/snippet}

{#snippet Okruszki()}
	<Breadcrumb.Root>
		<Breadcrumb.List>
			<Breadcrumb.Item class="hidden md:block">
				<Breadcrumb.Link href="/">Home</Breadcrumb.Link>
			</Breadcrumb.Item>
			{#each pathSegments as segment, i}
				<Breadcrumb.Separator class="hidden md:block" />
				<Breadcrumb.Item class="hidden md:block">
					<Breadcrumb.Link href={segment.href}>{segment.label}</Breadcrumb.Link>
				</Breadcrumb.Item>
			{/each}
		</Breadcrumb.List>
	</Breadcrumb.Root>
{/snippet}

<style>
	.custom-scrollbar {
		/* width */
		::-webkit-scrollbar {
			width: 10px;
			height: 10px;
		}

		/* Track */
		::-webkit-scrollbar-track {
			border-left: solid 1px hsl(var(--grid-border));
			border-top: solid 1px hsl(var(--grid-border));
			background: hsl(var(--grid-background));
		}

		/* Handle */
		::-webkit-scrollbar-thumb {
			background: hsl(var(--muted-foreground));
		}

		/* Handle on hover */
		::-webkit-scrollbar-thumb:hover {
			background: hsl(var(--muted-foreground) / 50);
		}
	}
</style>
