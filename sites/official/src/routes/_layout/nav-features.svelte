<script lang="ts">
	import { page } from '$app/stores';
	import Badge from '$lib/components/ui/badge/badge.svelte';
	import * as Collapsible from '$lib/components/ui/collapsible/index.js';
	import * as Sidebar from '$lib/components/ui/sidebar/index.js';
	import ChevronRight from 'lucide-svelte/icons/chevron-right';

	let {
		items
	}: {
		items: {
			title: string;
			url: string;
			badge?: string;
			// this should be `Component` after lucide-svelte updates types
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			icon?: any;
			isActive?: boolean;
			disabled?: boolean;
			items?: {
				title: string;
				url: string;
				disabled?: boolean;
			}[];
		}[];
	} = $props();
</script>

<Sidebar.Group class="p-0">
	<!-- <Sidebar.GroupLabel>Features</Sidebar.GroupLabel> -->
	<Sidebar.Menu>
		{#each items as mainItem (mainItem.title)}
			<Collapsible.Root open={mainItem.isActive} class="group/collapsible">
				{#snippet child({ props })}
					<Sidebar.MenuItem {...props}>
						<Collapsible.Trigger>
							{#snippet child({ props })}
								{#if mainItem.items}
									<Sidebar.MenuButton
										{...props}
										isActive={$page.url.pathname.includes(mainItem.url)}
										class="data-[active=true]:bg-sidebar-accent data-[active=true]:text-sidebar-accent-foreground"
									>
										{#if mainItem.icon}
											<mainItem.icon />
										{/if}
										<span>{mainItem.title}</span>
										<ChevronRight
											class="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90"
										/>
									</Sidebar.MenuButton>
								{/if}
								{#if !mainItem.items}
									<a href={mainItem.url} {...props}>
										<Sidebar.MenuButton {...props} isActive={mainItem.url === $page.url.pathname}>
											{#if mainItem.icon}
												<mainItem.icon />
											{/if}
											<span>{mainItem.title}</span>
											{#if mainItem?.badge}
												<Badge class="ml-auto rounded-sm" variant="outline">{mainItem?.badge}</Badge
												>
											{/if}
										</Sidebar.MenuButton>
									</a>
								{/if}
							{/snippet}
						</Collapsible.Trigger>
						<Collapsible.Content>
							{#if mainItem.items}
								<Sidebar.MenuSub>
									{#each mainItem.items as subItem (subItem.title)}
										<Sidebar.MenuSubItem
											data-disabled={subItem.disabled}
											class={`
												data-[disabled=true]:cursor-not-allowed
												`}
										>
											<Sidebar.MenuSubButton
												data-disabled={subItem.disabled}
												isActive={subItem.url === $page.url.pathname}
												class="
												data-[active=true]:bg-sidebar-accent
												data-[active=true]:text-sidebar-accent-foreground
												data-[disabled=true]:pointer-events-none 
												data-[disabled=true]:cursor-not-allowed data-[disabled=true]:opacity-30"
											>
												{#snippet child({ props })}
													<a href={subItem.url} {...props}>
														<span>{subItem.title}</span>
													</a>
												{/snippet}
											</Sidebar.MenuSubButton>
										</Sidebar.MenuSubItem>
									{/each}
								</Sidebar.MenuSub>
							{/if}
						</Collapsible.Content>
					</Sidebar.MenuItem>
				{/snippet}
			</Collapsible.Root>
		{/each}
	</Sidebar.Menu>
</Sidebar.Group>
