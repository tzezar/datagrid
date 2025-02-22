<script lang="ts">
	import * as Sheet from '$lib/components/ui/sheet/index.js';
	import { buttonVariants } from '$lib/components/ui/button/index.js';
	import { SIDEBAR_WIDTH_MOBILE } from '$lib/components/ui/sidebar/constants';
	import { PanelLeft } from 'lucide-svelte';
	import { cn } from '$lib/utils';
	import AppBarContent from './app-bar-content.svelte';
</script>

<div class='md:hidden'>
	<Sheet.Root>
		<Sheet.Trigger class={cn(buttonVariants({ variant: 'ghost' }), 'size-7 -ml-1')}><PanelLeft /></Sheet.Trigger>
		<Sheet.Content
			data-sidebar="sidebar"
			data-mobile="true"
			side="left"
			class="bg-sidebar text-sidebar-foreground w-[18rem] p-0 [&>button]:hidden"
			style="--sidebar-width: {SIDEBAR_WIDTH_MOBILE};"
		>
			<div class="flex h-full w-full flex-col">
				<AppBarContent />
			</div>
		</Sheet.Content>
	</Sheet.Root>
</div>
