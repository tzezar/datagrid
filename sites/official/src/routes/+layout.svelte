<!-- src/routes/+layout.svelte -->
<script lang="ts">
	import ThemeSwitcher from '$lib/blocks/theme-switcher.svelte';
	import { Toaster } from '$lib/components/ui/sonner';
	import { ModeWatcher, mode } from 'mode-watcher';
	import '../app.css'; // Assuming your Tailwind CSS is imported here
	import { onMount, type Snippet } from 'svelte';
	import { links } from '$lib/hrefs';
	import { afterNavigate, goto } from '$app/navigation';

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
	let scrollFix;

	afterNavigate(() => {
		if (browser) {
			// if path # anchor then scroll to anchor

			if (window.location.hash) {
				const anchor = document.querySelector(window.location.hash);
				if (anchor) {
					scrollFix.scrollTo({ top: anchor.offsetTop, behavior: 'smooth' });
				}
			} else {
				scrollFix.scrollTo({ top: 0, behavior: 'instant' });
			}
		}
	});

	import logoBlack from '$lib/assets/img/tzezar-logo-black.png';
	import logoWhite from '$lib/assets/img/tzezar-logo-white.png';
	import Navigation from './_components/navigation.svelte';
	import Button from '$lib/components/ui/button/button.svelte';
</script>


{#snippet GithubBtn()}
<a href="https://github.com/tzezar/datagrid">
	<Button variant="outline" size="icon">
		<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24">
			<path
				fill="currentColor"
				d="M12 2A10 10 0 0 0 2 12c0 4.42 2.87 8.17 6.84 9.5c.5.08.66-.23.66-.5v-1.69c-2.77.6-3.36-1.34-3.36-1.34c-.46-1.16-1.11-1.47-1.11-1.47c-.91-.62.07-.6.07-.6c1 .07 1.53 1.03 1.53 1.03c.87 1.52 2.34 1.07 2.91.83c.09-.65.35-1.09.63-1.34c-2.22-.25-4.55-1.11-4.55-4.92c0-1.11.38-2 1.03-2.71c-.1-.25-.45-1.29.1-2.64c0 0 .84-.27 2.75 1.02c.79-.22 1.65-.33 2.5-.33s1.71.11 2.5.33c1.91-1.29 2.75-1.02 2.75-1.02c.55 1.35.2 2.39.1 2.64c.65.71 1.03 1.6 1.03 2.71c0 3.82-2.34 4.66-4.57 4.91c.36.31.69.92.69 1.85V21c0 .27.16.59.67.5C19.14 20.16 22 16.42 22 12A10 10 0 0 0 12 2"
			/>
		</svg></Button
	>
</a>
{/snippet}

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
		<main class="flex-1 overflow-y-auto p-4" bind:this={scrollFix}>
			{@render children()}
		</main>
	</div>
</div>
{#snippet DesktopSidebar()}
	<aside id="desktop-nav" class="hidden h-screen w-64 max-w-sm overflow-y-auto border-r md:block">
		<div class="flex h-full flex-col">
			<a href="/" class="bg-primary-foreground sticky top-0 flex gap-2 p-4 text-xl font-bold">
				{#if schema == 'dark'}
					<img src={logoWhite} alt="Logo" class="h-[32px] w-[32px]" />
				{:else}
					<img src={logoBlack} alt="Logo" class="h-[32px] w-[32px]" />
				{/if}
				Tzezar's Datagrid
			</a>
			<nav class=" p-4">
				<Navigation {links} />
			</nav>
			<div class="bg-primary-foreground sticky bottom-0 mt-auto p-4">
				<ThemeSwitcher />
				{@render GithubBtn()}
			</div>
		</div>
	</aside>
{/snippet}

{#snippet MobileHeader()}
	<header class="bg-primary-foreground flex items-center justify-between border-b p-4 md:hidden">
		<div class="flex w-full items-center justify-between">
			<a href="/" class="sticky top-0 flex gap-2 text-xl font-bold">
				{#if schema == 'dark'}
					<img src={logoWhite} alt="Logo" class="h-[32px] w-[32px]" />
				{:else}
					<img src={logoBlack} alt="Logo" class="h-[32px] w-[32px]" />
				{/if}
				Tzezar's Datagrid
			</a>

			<button
				id="toggle-nav"
				class="text-gray-500 focus:outline-none"
				onclick={toggleMobileNav}
				aria-label="Toggle Navigation"
			>
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
			class="bg-background absolute right-0 top-0 z-50 h-screen w-64 transform transition-transform duration-300 ease-in-out md:hidden"
			class:translate-x-0={showMobileNav}
			class:translate-x-[-100%]={!showMobileNav}
		>
			<div class="flex h-full flex-col overflow-auto">
				<div
					class="bg-primary-foreground sticky top-0 flex h-[64.67px] min-h-[64.67px] items-center justify-between border-b p-4"
				>
					<h1 class="text-xl font-bold">Menu</h1>
					<button
						class="text-gray-500 focus:outline-none"
						onclick={() => (showMobileNav = false)}
						aria-label="Close"
					>
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
				<nav class=" border-l p-4">
					<Navigation {links} />
				</nav>
				<div class="bg-primary-foreground sticky bottom-0 mt-auto border-l p-4">
					<ThemeSwitcher />
					{@render GithubBtn()}
				</div>
			</div>
		</div>
	{/if}
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
