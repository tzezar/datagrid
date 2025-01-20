<script lang="ts">
	import '../app.css';
	// import atomOneDark from 'svelte-highlight/styles/atom-one-dark';
	import type { Snippet } from 'svelte';
	import Sidebar from './_components/sidebar/sidebar.svelte';
	let { children }: { children: Snippet } = $props();
	import { ModeWatcher, toggleMode, mode } from 'mode-watcher';

	import logoBlack from '$lib/assets/img/tzezar-logo-black.png';
	import logoWhite from '$lib/assets/img/tzezar-logo-white.png';
	import ThemeSwitcher from './_components/theme-switcher.svelte';
	import { Toaster } from '$lib/components/ui/sonner/index.js';

	import { browser } from '$app/environment';
	import SidebarMobile from './_components/sidebar/sidebar-mobile.svelte';
	import { onNavigate } from '$app/navigation';
	import { afterNavigate } from '$app/navigation';

	let schema = $derived($mode || 'dark');

	let scrollFix: HTMLDivElement;
	afterNavigate(() => {
		if (browser) {
			// if path # anchor then scroll to anchor

			if (window.location.hash) {
				const anchor = document.querySelector(window.location.hash) as HTMLAnchorElement;
				if (anchor) {
					scrollFix.scrollTo({ top: anchor.offsetTop, behavior: 'smooth' });
				}
			} else {
				scrollFix.scrollTo({ top: 0, behavior: 'instant' });
			}
		}
	});
</script>

<!-- <svelte:head>
	{@html atomOneDark}
</svelte:head> -->

<Toaster />
<ModeWatcher />
<div class="flex h-screen w-full">
	<div class="flex h-full w-full">
		<!-- Desktop Sidebar -->
		<div class="hidden h-full w-64 shrink-0 flex-col overflow-auto border-r lg:flex">
			<!-- Logo Section -->
			<a href="/" class="">
				<div class="sticky top-0 flex items-center justify-center gap-4 bg-primary-foreground py-4">
					<div class="flex h-10 flex-row items-center justify-center align-middle">
						{#if schema == 'dark'}
							<img src={logoWhite} alt="Logo" class="h-[42px] w-[42px]" />
						{:else}
							<img src={logoBlack} alt="Logo" class="h-[42px] w-[42px]" />
						{/if}
					</div>
					<div>
						<h1 class="text-lg font-semibold">Tzezar's Datagrid</h1>
					</div>
				</div>
			</a>

			<!-- Sidebar Navigation -->
			<div class="sticky left-0 flex grow flex-col border-t">
				<Sidebar />
			</div>

			<!-- Sidebar Footer -->
			<div class="sticky bottom-0 mt-auto h-20 border-t bg-primary-foreground px-8 py-4">
				<div class="flex items-center justify-between gap-4">
					<a href="https://github.com/tzezar/datagrid" class="font-semibold">GITHUB</a>
					<ThemeSwitcher />
				</div>
			</div>
		</div>

		<!-- Main Content Area -->
		<div class="relative flex h-screen w-full flex-col overflow-auto" bind:this={scrollFix}>
			<!-- Mobile Header -->
			<div class="sticky top-0 flex w-full border-b bg-primary-foreground lg:hidden">
				<div
					class="flex w-full flex-row items-center justify-between gap-1 bg-primary-foreground px-4 py-2 lg:px-6"
				>
					<a href="/" class="flex items-center justify-center gap-4">
						<div class="flex h-10 flex-row items-center justify-between align-middle">
							{#if schema == 'dark'}
								<img src={logoWhite} alt="Logo" class="h-[32px] w-[32px]" />
							{:else}
								<img src={logoBlack} alt="Logo" class="h-[32px] w-[32px]" />
							{/if}
						</div>
						<div class="flex items-center gap-1">
							<h1 class="text-lg font-semibold leading-tight">Tzezar's Datagrid</h1>
						</div>
					</a>
					<div
						class=" flex place-content-center place-items-center items-center justify-center leading-none"
					>
						<SidebarMobile />
					</div>
				</div>
			</div>

			<!-- Main Content -->
			<div class="min-h-0 flex-1 p-4 py-6 pb-24 lg:p-8">
				{@render children()}
			</div>
			<!-- FOOTER -->
		</div>
	</div>
</div>
