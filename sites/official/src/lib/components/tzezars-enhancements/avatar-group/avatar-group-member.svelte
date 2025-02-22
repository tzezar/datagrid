<script lang="ts">
	import { cn } from '$lib/utils';
	import * as Avatar from '$lib/components/ui/avatar/index.js';
	import { Avatar as AvatarPrimitive } from 'bits-ui';

	let { ref = $bindable(null), class: _class, ...props }: AvatarPrimitive.RootProps = $props();
</script>

<Avatar.Root
	bind:ref
	class={cn(
		'bg-accent ring ring-background first:ml-0 first:mt-0 group-data-[orientation="horizontal"]/avatar-group:-ml-3 group-data-[orientation="vertical"]/avatar-group:-mt-2',
		_class
	)}
	{...props}
/>
