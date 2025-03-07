<script lang="ts">
	import '../app.css';
	import atomOneDark from 'svelte-highlight/styles/atom-one-dark';
	import type { Snippet } from 'svelte';
	import Sidebar from './_components/sidebar/sidebar.svelte';
	let { children }: { children: Snippet } = $props();
	import { ModeWatcher, toggleMode, mode } from 'mode-watcher';

	import logoBlack from '$lib/assets/img/tzezar-logo-black.png';
	import logoWhite from '$lib/assets/img/tzezar-logo-white.png';
	import ThemeSwitcher from './_components/theme-switcher.svelte';
	import { Toaster } from '$lib/components/ui/sonner';

	import { browser } from '$app/environment';
	import { QueryClient, QueryClientProvider } from '@tanstack/svelte-query';
	import { SvelteQueryDevtools } from '@tanstack/svelte-query-devtools';
	import SidebarMobile from './_components/sidebar/sidebar-mobile.svelte';
	import { onNavigate } from '$app/navigation';
	import { afterNavigate } from '$app/navigation';
	import Button from '$lib/components/ui/button/button.svelte';

	const queryClient = new QueryClient({
		defaultOptions: {
			queries: {
				enabled: browser
			}
		}
	});

	let schema = $derived($mode || 'dark');

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
</script>

<svelte:head>
	{@html atomOneDark}
</svelte:head>

<Toaster />
<ModeWatcher />
<QueryClientProvider client={queryClient}>
	<SvelteQueryDevtools />
	<div class="flex h-screen w-full">
		<div class="flex h-full w-full">
		  <!-- Desktop Sidebar -->
		  <div class="hidden h-full w-64 shrink-0 flex-col overflow-auto border-r lg:flex">
			<!-- Logo Section -->
			<a href="/" class="">
			  <div class="bg-primary-foreground sticky top-0 flex items-center justify-center gap-1 py-4">
				<div class="flex h-10 flex-row items-center justify-center align-middle">
				  {#if schema == 'dark'}
					<img src={logoWhite} alt="Logo" class="h-[52px] w-[52px]" />
				  {:else}
					<img src={logoBlack} alt="Logo" class="h-[52px] w-[52px]" />
				  {/if}
				</div>
				<div>
				  <h1 class="text-lg font-semibold">Tzezar's Datagrid</h1>
				  <p class="text-right text-orange-400">Beta</p>
				</div>
			  </div>
			</a>
	  
			<!-- Sidebar Navigation -->
			<div class="sticky left-0 flex grow flex-col border-t">
			  <Sidebar />
			</div>
	  
			<!-- Sidebar Footer -->
			<div class="bg-primary-foreground sticky bottom-0 mt-auto h-20 border-t px-8 py-4">
			  <div class="flex items-center justify-between gap-4">
				<a href="https://github.com/tzezar/datagrid" class="font-semibold">GITHUB</a>
				<ThemeSwitcher />
			  </div>
			</div>
		  </div>
	  
		  <!-- Main Content Area -->
		  <div class="flex h-screen w-full flex-col overflow-auto relative" bind:this={scrollFix}>
			<!-- Mobile Header -->
			<div class="bg-primary-foreground sticky top-0 z-[19] flex w-full border-b lg:hidden">
			  <div class="bg-primary-foreground flex w-full flex-row items-center justify-between gap-1 px-4 py-2 lg:px-6">
				<a href="/" class="flex items-center justify-center gap-2">
				  <div class="flex h-10 flex-row items-center justify-between align-middle">
					{#if schema == 'dark'}
					  <img src={logoWhite} alt="Logo" class="h-[32px] w-[32px]" />
					{:else}
					  <img src={logoBlack} alt="Logo" class="h-[32px] w-[32px]" />
					{/if}
				  </div>
				  <div class='flex items-center gap-1'>
					<h1 class="text-lg font-semibold leading-tight">Tzezar's Datagrid</h1>
					<p class="text-right text-orange-400 leading-none text-sm self-start ">Beta</p>
				  </div>
				</a>
				<div class=" flex items-center justify-center place-items-center place-content-center leading-none">
					<SidebarMobile />
				</div>
			  </div>
			</div>
	  
			<!-- Main Content -->
			<div class="flex-1 min-h-0 p-4 py-6 lg:p-8 pb-24">
			  {@render children()}
			</div>
	  
			<!-- Footer -->
			<div class="bg-primary-foreground/70 fixed bottom-0 z-20 lg:h-20 w-full border-t px-2 py-2 lg:py-4 lg:max-w-[calc(100%-256px)] lg:px-8 flex items-center text-center justify-center">
			  <div class="text-xs lg:text-base h-full  items-center text-center justify-center flex ">
				<span>
					Feel free to contact me if you have any questions and if you find this project useful
					then please leave a star on <a href="https://github.com/tzezar/datagrid" class="underline">github</a> - thank you ❤️
				</span>
			  </div>
			</div>
		  </div>
		</div>
	  </div>
</QueryClientProvider>
