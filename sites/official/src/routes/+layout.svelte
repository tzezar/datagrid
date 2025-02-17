<!-- src/routes/+layout.svelte -->
<script lang="ts">
	import ThemeSwitcher from '$lib/blocks/theme-switcher.svelte';
	import { Toaster } from '$lib/components/ui/sonner';
	import { ModeWatcher, mode } from 'mode-watcher';
	import '../app.css'; // Assuming your Tailwind CSS is imported here
	import { onMount, type Snippet } from 'svelte';
	import { links } from '$lib/hrefs';
	import type { NavigationGroup, NavigationEntry, NavigationItem } from '$lib/hrefs';

	let { children }: { children: Snippet } = $props();

	let schema = $derived($mode || 'dark');
	let showMobileNav = $state(false);

	function toggleMobileNav() {
		showMobileNav = !showMobileNav;
	}

	// Close mobile nav when clicking outside
	onMount(() => {
		const handleClickOutside = (event) => {
			const mobileNav = document.getElementById('mobile-nav');
			const toggleButton = document.getElementById('toggle-nav');

			if (
				showMobileNav &&
				mobileNav &&
				!mobileNav.contains(event.target) &&
				!toggleButton.contains(event.target)
			) {
				showMobileNav = false;
			}
		};

		document.addEventListener('click', handleClickOutside);

		return () => {
			document.removeEventListener('click', handleClickOutside);
		};
	});

	import logoBlack from '$lib/assets/img/tzezar-logo-black.png';
	import logoWhite from '$lib/assets/img/tzezar-logo-white.png';
</script>

<Toaster richColors />
<ModeWatcher />
<div class="custom-scrollbar flex h-screen flex-col overflow-hidden md:flex-row">
	<!-- Sidebar (always visible on desktop, hidden on mobile) -->
	{@render DesktopSidebar()}
	<!-- Mobile Header and Content -->
	<div class="flex h-screen flex-1 flex-col overflow-hidden">
		<!-- Mobile Header (visible on mobile, hidden on desktop) -->
		{@render MobileHeader()}

		<!-- Mobile Nav Overlay (only shown when toggled) -->
		{@render MobileNav()}

		<!-- Main Content (scrollable) -->
		<main class="flex-1 overflow-y-auto p-4">
			{@render children()}
		</main>
	</div>
</div>
{#snippet DesktopSidebar()}
	<aside id="desktop-nav" class="hidden h-screen w-64 max-w-sm overflow-y-auto border-r md:block">
		<div class="flex h-full flex-col">
			<a href="/" class="sticky top-0 flex gap-2 p-4 text-xl font-bold bg-primary-foreground">
				{#if schema == 'dark'}
					<img src={logoWhite} alt="Logo" class="h-[32px] w-[32px]" />
				{:else}
					<img src={logoBlack} alt="Logo" class="h-[32px] w-[32px]" />
				{/if}
				Tzezar's Datagrid
			</a>
			<nav class=" p-4">
				{@render Navigation()}
			</nav>
			<div class="bg-primary-foreground sticky bottom-0 mt-auto p-4">
				<ThemeSwitcher />
			</div>
		</div>
	</aside>
{/snippet}

{#snippet MobileHeader()}
	<header class="flex items-center justify-between border-b bg-primary-foreground p-4 md:hidden">
		<div class="flex w-full items-center justify-between">
			<a href="/" class="sticky top-0 flex gap-2 text-xl font-bold">
				{#if schema == 'dark'}
					<img src={logoWhite} alt="Logo" class="h-[32px] w-[32px]" />
				{:else}
					<img src={logoBlack} alt="Logo" class="h-[32px] w-[32px]" />
				{/if}
				Tzezar's Datagrid
			</a>

			<button id="toggle-nav" class="text-gray-500 focus:outline-none" onclick={toggleMobileNav} aria-label="Toggle Navigation">
				<svg
					xmlns="http://www.w3.org/2000/svg"
					class="h-6 w-6"
					fill="none"
					viewBox="0 0 24 24"
					stroke="currentColor"
				>
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d="M4 6h16M4 12h16M4 18h16"
					/>
				</svg>
			</button>
		</div>
	</header>
{/snippet}

{#snippet MobileNav()}
	{#if showMobileNav}
		<div
			id="mobile-nav"
			class="absolute right-0 top-0 z-50 h-screen w-64 transform bg-background transition-transform duration-300 ease-in-out"
			class:translate-x-0={showMobileNav}
			class:translate-x-[-100%]={!showMobileNav}
		>
			<div class="flex flex-col">
				<div class="flex items-center justify-between p-4">
					<h1 class="text-xl font-bold">Menu</h1>
					<button class="text-gray-500 focus:outline-none" onclick={() => (showMobileNav = false)} aria-label="Close">
						<svg
							xmlns="http://www.w3.org/2000/svg"
							class="h-6 w-6"
							fill="none"
							viewBox="0 0 24 24"
							stroke="currentColor"
						>
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M6 18L18 6M6 6l12 12"
							/>
						</svg>
					</button>
				</div>
				<nav class=" p-4">
					{@render Navigation()}
				</nav>
				<div class="bg-primary-foreground sticky bottom-0 mt-auto p-4">
					<ThemeSwitcher />
				</div>
			</div>
		</div>
	{/if}
{/snippet}

{#snippet Navigation()}
	<ul class="space-y-2">
		{#each links as item}
			{@render NavigationItem(item, 0)}
		{/each}
	</ul>

	{#snippet NavigationItem(item: NavigationItem, depth: number)}
		{#if 'children' in item}
			{@render NavigationGroup(item as NavigationGroup, depth + 1)}
		{:else}
			{@render NavigationEntry(item as NavigationEntry, depth)}
		{/if}
	{/snippet}

	{#snippet NavigationEntry(entry: NavigationEntry, depth: number)}
		<li>
			<a href={entry.href} class="block rounded p-2 hover:bg-primary-foreground">
				{entry.title}
			</a>
		</li>
	{/snippet}

	{#snippet NavigationGroup(group: NavigationGroup, depth: number)}
		<div class="flex flex-col gap-2 pt-2">
			<p class=" font-semibold">
				{group.title}
			</p>
			<div class="flex flex-col">
				{#each group.children as child}
					{@render NavigationItem(child, depth + 1)}
				{/each}
			</div>
		</div>
	{/snippet}
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
