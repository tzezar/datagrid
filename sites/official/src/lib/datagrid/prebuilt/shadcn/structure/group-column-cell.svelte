<script lang="ts">
	import type { GroupColumn } from '$lib/datagrid/core/types';
	import { cn } from '$lib/utils';
	import type { Snippet } from 'svelte';

	type Props = {
		column: GroupColumn<any>;
		children: Snippet;
		class?: string;
	};

	let { column, children, class: _class }: Props = $props();
</script>

<div class="group-column-cell">
	{@render children()}
</div>
