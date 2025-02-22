<script lang="ts">
	import type { Snippet } from 'svelte';
	import * as Tabs from '$lib/components/ui/tabs';
	import { RefreshCw } from 'lucide-svelte';
	import Button from '$lib/components/ui/button/button.svelte';
	import { CodeBlock } from '../code-block';
	import { cn } from '$lib/utils';

	type Props = {
		code: string;
		replay?: boolean;
		class?: string;
		children: Snippet<[]>;
	};

	let { children, code, class: _class = undefined, replay = false }: Props = $props();

	let remountCount = $state(0);
	let tab: 'preview' | 'code' = $state('preview');
</script>

<div
	class={cn('w-full flex flex-col', _class)}
>
	<Tabs.Root bind:value={tab} class="flex flex-col min-h-[400px] ">
		<Tabs.List class="flex justify-start rounded-none rounded-t-lg border border-b-0 ">
			<Tabs.Trigger class="m-0" value="preview">Preview</Tabs.Trigger>
			<Tabs.Trigger class="m-0" value="code">Code</Tabs.Trigger>
		</Tabs.List>

		<Tabs.Content value="preview" class="border h-full pt-0 mt-0 rounded-b-md ">
			{#if replay}
				<Button
					size="icon"
					variant="ghost"
					class="absolute left-3 top-3"
					onclick={() => remountCount++}
				>
					<RefreshCw class="size-4" />
				</Button>
			{/if}
			{#key remountCount}
				<div class="flex items-center justify-center h-full p-4">
						{@render children()}
				</div>
			{/key}
		</Tabs.Content>

		<Tabs.Content value="code" class="border mt-0 rounded-b-md">
			<CodeBlock
				lang="svelte"
				{code}
				class="size-full border-none"
				hideLineNumbers
				hideCopyButton
			/>
		</Tabs.Content>
	</Tabs.Root>
</div>
