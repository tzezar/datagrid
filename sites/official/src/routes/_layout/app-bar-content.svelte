<script>
	import NavFeatures from './nav-features.svelte';
	import NavQuickStart from './nav-quick-start.svelte';
	import NavSecondary from './nav-secondary.svelte';
	import { navigationTree } from './navigation-tree';
	import * as Sidebar from '$lib/components/ui/sidebar/index.js';
	import logoBlack from '$lib/assets/img/tzezar-logo-black.png';
	import logoWhite from '$lib/assets/img/tzezar-logo-white.png';

	import { mode } from 'mode-watcher';
	import NavEnhanced from './nav-enhanced.svelte';
	let schema = $derived($mode || 'dark');
	import { Tabs } from 'bits-ui';
	import { activeTab } from '$lib/state.svelte';

	
</script>

<div class="flex h-full flex-col overflow-auto">
	<div class="flex flex-col p-2">
		<Sidebar.MenuButton size="lg">
			{#snippet child({ props })}
				<a href="/" {...props}>
					<div
						class="bg-foreground text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg"
					>
						{#if schema === 'dark'}
							<img class="size-4" src={logoBlack} alt="" />
						{:else}
							<img class="size-4" src={logoWhite} alt="" />
						{/if}
					</div>
					<div class="grid flex-1 text-left text-sm leading-tight">
						<span class="truncate font-semibold">Tzezar's</span>
						<span class="truncate text-xs">
							{#if activeTab.state === 'headless-core'}
							Headless Datagrid
							{/if}
							{#if activeTab.state === 'enhanced'}
							Enhanced Datagrid with Shadcn Svelte
							{/if}

						</span>
					</div>
				</a>
			{/snippet}
		</Sidebar.MenuButton>
	</div>

	{#if activeTab.state === 'headless-core'}
		<div class="flex grow flex-col">
			<div class="p-2">
				<NavQuickStart items={navigationTree.navQuickStart} />
			</div>

			<div class="p-2">
				<NavFeatures items={navigationTree.navMain} />
			</div>

			<NavSecondary items={navigationTree.navSecondary} class="mt-auto p-2" />
		</div>
	{/if}
	{#if activeTab.state === 'enhanced'}
		<div class="flex grow flex-col">
			<div class="p-2">
				<NavEnhanced items={navigationTree.navEnhanced} />
			</div>
			<NavSecondary items={navigationTree.navSecondary} class="mt-auto p-2" />
		</div>
	{/if}

	<Tabs.Root class="" value={activeTab.state} onValueChange={(value) => activeTab.state = value}>
		<Tabs.List
			class="  bg-background grid w-full grid-cols-2 gap-1 p-2 text-xs font-semibold leading-[0.01em] "
		>
			<Tabs.Trigger
				value="headless-core"
				class="
				data-[state=active]:shadow-mini
				dark:data-[state=active]:bg-primary
				data-[state=active]:bg-primary 
				data-[state=active]:text-background 
				h-8 rounded-[7px] 
				bg-transparent py-2 
				transition-all
				duration-500
				"
			>
				Headless Core
			</Tabs.Trigger>
			<Tabs.Trigger
				value="enhanced"
				class="
				data-[state=active]:shadow-mini
				dark:data-[state=active]:bg-primary
			data-[state=active]:bg-primary 
			data-[state=active]:text-background 
			h-8 rounded-[7px] 
			bg-transparent py-2 
			transition-all
			duration-500
			"
			>
				Shadcn Svelte
			</Tabs.Trigger>
		</Tabs.List>
	</Tabs.Root>
</div>
