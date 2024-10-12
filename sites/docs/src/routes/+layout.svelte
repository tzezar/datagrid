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

	const queryClient = new QueryClient({
		defaultOptions: {
			queries: {
				enabled: browser
			}
		}
	});

	$effect(()=> {
		console.log($mode)
	})

	let schema = $state($mode || 'dark')
</script>

<svelte:head>
	{@html atomOneDark}
</svelte:head>

<Toaster />
<ModeWatcher />
<QueryClientProvider client={queryClient}>
	<SvelteQueryDevtools />
	<div class="flex h-screen w-full">
		<div class="flex w-full">
			<div class="hidden h-full w-64 shrink-0 flex-col overflow-auto border-r lg:flex">
				<a href="/" class="">
					<div
						class="bg-primary-foreground sticky top-0 flex items-center justify-center gap-1 py-4"
					>
						<div class="flex h-10 flex-row items-center justify-center align-middle">
							{#if schema == 'dark'}
								<img src={logoWhite} alt="" srcset="" class="h-[64px] w-[64px]" />
							{:else}
								<img src={logoBlack} alt="" srcset="" class="h-[64px] w-[64px]" />
							{/if}
						</div>
						<div>
							<h1 class="text-lg font-semibold">Tzezar's Datagrid</h1>
							<p class="text-right">Beta</p>
						</div>
					</div>
				</a>
				<Sidebar />
				<div class="bg-primary-foreground sticky bottom-0 mt-auto border-t px-8 py-4">
					<div class="flex items-center justify-between gap-4">
						<a href="https://github.com/tzezar/datagrid" class="font-semibold">GITHUB</a>
						<ThemeSwitcher />
					</div>
				</div>
			</div>
			<div class="flex w-full flex-col overflow-auto">
				<div class="bg-primary-foreground sticky top-0 z-[19] flex w-full lg:hidden">
					<div
						class="bg-primary-foreground sticky top-0 flex w-full flex-row items-center justify-between gap-1 px-6 py-4"
					>
						<a href="/" class="flex items-center justify-center gap-1">
							<div class="flex h-10 flex-row items-center justify-between align-middle">
								{#if schema == 'dark'}
									<img src={logoWhite} alt="" srcset="" class="h-[64px] w-[64px]" />
								{:else}
									<img src={logoBlack} alt="" srcset="" class="h-[64px] w-[64px]" />
								{/if}
							</div>
							<div>
								<h1 class="text-lg font-semibold">Tzezar's Datagrid</h1>
								<p class="text-right">Beta</p>
							</div>
						</a>
						<SidebarMobile/>
					
					</div>
				</div>
				<div class="grow p-8">
					{@render children()}
				</div>
			</div>
		</div>
	</div>
</QueryClientProvider>
