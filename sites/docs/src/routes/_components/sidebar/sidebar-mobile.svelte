<script lang="ts">
	import * as Sheet from '$lib/components/ui/sheet';
	import Button from '$lib/components/ui/button/button.svelte';
	import Sidebar from './sidebar.svelte';
	import ThemeSwitcher from '../theme-switcher.svelte';
	import { setContext } from 'svelte';
    
	let open = $state(false);

	let closeSidebarOnClick = () => {
		open = false;
	};

	setContext('mobile-sidebar', closeSidebarOnClick);
</script>

<div>
	<Sheet.Root {open} onOpenChange={(v) => (open = v)}>
		<Sheet.Trigger asChild let:builder>
			<Button builders={[builder]}>Menu</Button>
		</Sheet.Trigger>
		<Sheet.Content class="z-[2000] flex h-full  flex-col justify-between overflow-auto p-0">
			<Sidebar />
			<div class="bg-primary-foreground sticky bottom-0 mt-auto border-t px-8 py-4">
				<div class="flex items-center justify-between gap-4">
					<a href="https://github.com/tzezar/datagrid" class="font-semibold">GITHUB</a>
					<ThemeSwitcher />
				</div>
			</div>
		</Sheet.Content>
	</Sheet.Root>
</div>
