<script lang="ts">
	import type { LeafColumn } from '$lib/datagrid/core/types';
	import type { EnhancedDatagrid } from '../core/index.svelte';
	import {
		getDraggedColumnWidth,
		getKeyboardColumnWidth
	} from '../core/features/column-resizing.svelte';

	type Props = {
		datagrid: EnhancedDatagrid;
		column: LeafColumn<any>;
	};

	let { datagrid, column }: Props = $props();
	let startClientX = 0;
	let startWidth = 0;
	let resizing = false;

	const constraints = () => ({
		minWidth: column.state.size.minWidth || 0,
		maxWidth: column.state.size.maxWidth || Number.MAX_SAFE_INTEGER
	});

	function updateWidth(width: number) {
		datagrid.handlers.column.updateColumnSize(column.columnId, width);
	}

	function handlePointerDown(event: PointerEvent) {
		if (event.button !== 0) return;

		event.preventDefault();
		event.stopPropagation();
		startClientX = event.clientX;
		startWidth = column.state.size.width;
		resizing = true;
		const handle = event.currentTarget as HTMLButtonElement;
		handle.setPointerCapture(event.pointerId);
	}

	function handlePointerMove(event: PointerEvent) {
		if (!resizing) return;

		event.preventDefault();
		event.stopPropagation();
		if (datagrid.extra.features.columnSizing.columnResizeMode !== 'fluid') return;

		updateWidth(getDraggedColumnWidth(startWidth, startClientX, event.clientX, constraints()));
	}

	function handlePointerEnd(event: PointerEvent, cancelled = false) {
		if (!resizing) return;

		event.preventDefault();
		event.stopPropagation();
		if (!cancelled && datagrid.extra.features.columnSizing.columnResizeMode === 'standard') {
			updateWidth(getDraggedColumnWidth(startWidth, startClientX, event.clientX, constraints()));
		}
		resizing = false;
		const handle = event.currentTarget as HTMLButtonElement;
		if (handle.hasPointerCapture(event.pointerId)) {
			handle.releasePointerCapture(event.pointerId);
		}
	}

	function handleKeyDown(event: KeyboardEvent) {
		if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') return;

		event.preventDefault();
		event.stopPropagation();
		updateWidth(getKeyboardColumnWidth(column.state.size.width, event.key, constraints()));
	}
</script>

<button
	type="button"
	class="column-resize-handle"
	aria-label={`Resize ${column.header} column`}
	title={`Resize ${column.header} column`}
	onclick={(event) => event.stopPropagation()}
	onpointerdown={handlePointerDown}
	onpointermove={handlePointerMove}
	onpointerup={(event) => handlePointerEnd(event)}
	onpointercancel={(event) => handlePointerEnd(event, true)}
	onkeydown={handleKeyDown}
></button>

<style>
	.column-resize-handle {
		position: absolute;
		top: 0;
		right: -4px;
		z-index: 3;
		height: 100%;
		width: 8px;
		cursor: col-resize;
		touch-action: none;
		user-select: none;
		border: 0;
		padding: 0;
		background: transparent;
	}

	.column-resize-handle::after {
		position: absolute;
		top: 20%;
		bottom: 20%;
		left: 3px;
		width: 2px;
		border-radius: 9999px;
		background: currentColor;
		content: '';
		opacity: 0;
	}

	.column-resize-handle:hover::after,
	.column-resize-handle:focus-visible::after,
	.column-resize-handle:active::after {
		opacity: 0.45;
	}
</style>
