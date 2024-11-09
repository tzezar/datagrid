<script lang="ts">
	import { page } from '$app/stores';
	import { cn } from '$lib/utils';
	import { getContext, type Snippet } from 'svelte';


	let closeSidebarOnClick = getContext('mobile-sidebar') as () => void


	let {
		children,
		href = '',
		title = '',
		disabled = false,
		class: _class
	}: {
		children?: Snippet;
		href: string;
		title: string;
		class?: string;
		disabled?: boolean;
	} = $props();
</script>

<a
	onclick={()=> closeSidebarOnClick()}
	{href}
	class={cn(
		'capitalize text-sm',
		disabled && 'opacity-30',
		$page.url.pathname === href && 'font-semibold text-orange-500',
		_class
	)}
>
	{title}
</a>
