<script lang="ts">
	import Check from 'lucide-svelte/icons/check';
	import { Select as SelectPrimitive } from 'bits-ui';
	import { cn } from '$lib/utils.js';

	type $$Props = SelectPrimitive.ItemProps & {
		checkbox?: boolean;
	};
	type $$Events = SelectPrimitive.ItemEvents;

	let className: $$Props['class'] = undefined;
	export let value: $$Props['value'];
	export let label: $$Props['label'] = undefined;
	export let disabled: $$Props['disabled'] = undefined;
	export { className as class };
	export let checkbox: $$Props['checkbox'] = false;
</script>

<SelectPrimitive.Item
	{value}
	{disabled}
	{label}
	class={cn(
		'relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 text-sm outline-none data-[disabled]:pointer-events-none data-[highlighted]:bg-accent data-[highlighted]:text-accent-foreground data-[disabled]:opacity-50',
		checkbox ? 'pl-8' : 'pl-2',
		className
	)}
	{...$$restProps}
	on:click
	on:keydown
	on:focusin
	on:focusout
	on:pointerleave
	on:pointermove
>
	{#if checkbox}
		<span class="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
			<SelectPrimitive.ItemIndicator>
				<Check class="h-4 w-4" />
			</SelectPrimitive.ItemIndicator>
		</span>
	{/if}
	<slot>
		{label || value}
	</slot>
</SelectPrimitive.Item>
