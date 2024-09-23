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
	import * as Sheet from '$lib/components/ui/sheet';
	import Button from '$lib/components/ui/button/button.svelte';

	import { browser } from '$app/environment';
	import { QueryClient, QueryClientProvider } from '@tanstack/svelte-query';
	import { SvelteQueryDevtools } from '@tanstack/svelte-query-devtools';

	const queryClient = new QueryClient({
		defaultOptions: {
			queries: {
				enabled: browser
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
		<div class="flex w-full">
			<div class="hidden h-full w-64 shrink-0 flex-col overflow-auto border-r lg:flex">
				<a href="/" class="">
					<div
						class="sticky top-0 flex items-center justify-center gap-1 bg-primary-foreground py-4"
					>
						<div class="flex h-10 flex-row items-center justify-center align-middle">
							{#if $mode == 'dark'}
								<img src={logoWhite} alt="" srcset="" class="h-[64px]" />
							{:else}
								<img src={logoBlack} alt="" srcset="" class="h-[64px]" />
							{/if}
						</div>
						<div>
							<h1 class="text-lg font-semibold">Tzezar's Datagrid</h1>
							<p class="text-right">Beta</p>
						</div>
					</div>
				</a>
				<Sidebar />
				<div class="sticky bottom-0 mt-auto border-t bg-primary-foreground px-8 py-4">
					<div class="flex items-center justify-between gap-4">
						<a href="https://github.com/tzezar/datagrid" class="font-semibold">GITHUB</a>
						<ThemeSwitcher />
					</div>
				</div>
			</div>
			<div class="flex w-full flex-col overflow-auto">
				<div class="sticky top-0 z-[19] flex w-full bg-primary-foreground lg:hidden">
					<div
						class="sticky top-0 flex w-full flex-row items-center justify-between gap-1 bg-primary-foreground px-6 py-4"
					>
						<a href="/" class="flex items-center justify-center gap-1">
							<div class="flex h-10 flex-row items-center justify-between align-middle">
								{#if $mode == 'dark'}
									<img src={logoWhite} alt="" srcset="" class="h-[64px]" />
								{:else}
									<img src={logoBlack} alt="" srcset="" class="h-[64px]" />
								{/if}
							</div>
							<div>
								<h1 class="text-lg font-semibold">Tzezar's Datagrid</h1>
								<p class="text-right">Beta</p>
							</div>
						</a>

						<Sheet.Root>
							<Sheet.Trigger asChild let:builder>
								<Button builders={[builder]}>Menu</Button>
							</Sheet.Trigger>
							<Sheet.Content
								class="z-[2000] flex h-full  flex-col justify-between overflow-auto p-0"
							>
								<Sidebar />
								<div class="sticky bottom-0 mt-auto border-t bg-primary-foreground px-8 py-4">
									<div class="flex items-center justify-between gap-4">
										<a href="https://github.com/tzezar/datagrid" class="font-semibold">GITHUB</a>
										<ThemeSwitcher />
									</div>
								</div>
							</Sheet.Content>
						</Sheet.Root>
					</div>
				</div>
				<div class="p-8 grow">
					{@render children()}
				</div>
			</div>
		</div>
	</div>
</QueryClientProvider>
