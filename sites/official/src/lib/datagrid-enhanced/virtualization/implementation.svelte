<script module lang="ts">
	'use strict';
	/**
	 * the third argument for event bundler
	 * @see https://github.com/WICG/EventListenerOptions/blob/gh-pages/explainer.md
	 */
	const thirdEventArg = (() => {
		let result = false;
		try {
			const arg = Object.defineProperty({}, 'passive', {
				get() {
					result = { passive: true };
					return true;
				}
			});
			//@ts-expect-error no overload match this call
			window.addEventListener('testpassive', arg, arg);
			//@ts-expect-error property 'remove' does not exist
			window.remove('testpassive', arg, arg);
		} catch (_e) {
			/* */
		}
		return result;
	})();
</script>

<script lang="ts" generics="ItemType">
	// @ts-nocheck

	type Props = {
		items: ItemType[];
		isDisabled?: boolean;
		isHorizontal?: boolean;
		isTable?: boolean;
		scrollToIndex?: number | undefined;
		scrollToOffset?: number | undefined;
		scrollToAlignment?: ALIGNMENT;
		scrollToBehaviour?: SCROLL_BEHAVIOR;
		preRenderCount?: number;
		header?: Snippet;
		vl_slot: Snippet<[VLSlotSignature<ItemType>]>;
		footer?: Snippet;
		onVisibleRangeUpdate?: ((range: VLRangeEvent) => void) | undefined;
		onAfterScroll?: ((event: VLScrollEvent) => void) | undefined;
		class?: string;
		style?: string;
		sizingCalculator?: SizingCalculatorFn;
	};

	import { onDestroy, onMount, tick, type Snippet } from 'svelte';
	import {
		ALIGNMENT,
		SCROLL_BEHAVIOR,
		type SizingCalculatorFn,
		type VLRangeEvent,
		type VLScrollEvent,
		type VLSlotSignature
	} from '.';
	import clsx from 'clsx';
	// ====== INTERNAL TYPES ============
	var SCROLL_CHANGE_REASON;
	(function (SCROLL_CHANGE_REASON) {
		SCROLL_CHANGE_REASON[(SCROLL_CHANGE_REASON['OBSERVED'] = 0)] = 'OBSERVED';
		SCROLL_CHANGE_REASON[(SCROLL_CHANGE_REASON['REQUESTED'] = 1)] = 'REQUESTED';
	})(SCROLL_CHANGE_REASON || (SCROLL_CHANGE_REASON = {}));
	// ====== PROPERTIES ================
	const {
		items = [],
		// When disabled, all items are rendered like a normal html list
		isDisabled = false,
		isHorizontal = false,
		isTable = false,
		// reactive variable related to positioning
		scrollToIndex,
		scrollToOffset,
		// Render count at start, used for SSR
		preRenderCount = 6,
		// scroll attributes
		scrollToAlignment = ALIGNMENT.AUTO,
		scrollToBehaviour = SCROLL_BEHAVIOR.INSTANT,
		// snippets
		header,
		vl_slot,
		footer,
		// events
		onVisibleRangeUpdate,
		onAfterScroll,
		// css
		class: className = '',
		style = '',
		// calculates the size of a given index
		sizingCalculator
	}: Props = $props();
	// ======== VARIABLES ========
	// number of elements to pad above & below the visible range to prevent visual glitching
	const WINDOW_OVERSIZE_COUNT = 3;
	let mounted = false;
	let lastMeasuredIndex = -1;
	// dom references
	let listContainer;
	// svelte-ignore non_reactive_update
	let listInner;
	let clientHeight = $state(0);
	let clientWidth = $state(0);
	// virtual list first visible index
	let startIdx = $state(0);
	// virtual list last visible index
	let endIdx = $state(preRenderCount - 1);
	// used when rendering didn't happen yet, the average size
	let avgSizeInPx = $state(0);
	let curState = $state({
		offset:
			scrollToOffset ||
			(scrollToIndex !== undefined && items.length && getOffsetForIndex(scrollToIndex) && 1) ||
			0,
		scrollChangeReason: SCROLL_CHANGE_REASON.REQUESTED
	});
	let prevState;
	// Holds the raw rendered position of each item in the list
	const rawSizes = $derived(new Array(items.length));
	// Holds the calculated size (height or width) of each item in the list
	const sizes = $derived.by(() => {
		const r = items.map((item, index) => {
			let s = sizingCalculator?.(index, item);
			if (s !== undefined) return s;
			s = rawSizes[index];
			if (s !== undefined) return s;
			return avgSizeInPx;
		});
		return r;
	});
	// this is index -> viewport offset
	const offsets = $derived.by(() => {
		const p = [];
		sizes.reduce((a, b) => {
			p.push(a);
			return a + b;
		}, 0);
		return p;
	});
	const visibleItemsInfo = $derived.by(() => {
		if (!items || isDisabled) {
			return [];
		}
		const r = [];
		for (let index = startIdx; index <= endIdx; index++) {
			const item = items[index];
			if (item) {
				r.push({ item, index: index, size: sizes[index] });
			}
		}
		return r;
	});
	const totalViewportSize = () =>
		offsets.length > 0 ? offsets[offsets.length - 1] + sizes[sizes.length - 1] : 0;
	// css
	const listStyle = $derived(clsx(!isDisabled && 'overflow:auto;', style));
	const listInnerStyle = $derived.by(() => {
		//TODO: the bug is here
		const startOffset = offsets[startIdx] ? offsets[startIdx] : 0;
		const endOffset = offsets[endIdx] ? totalViewportSize() - offsets[endIdx] - sizes[endIdx] : 0;
		return clsx(
			!isTable && 'display:flex;',
			!isTable && ((!isHorizontal && 'flex-direction:column;') || 'flex-direction:row;'),
			!isDisabled &&
				((!isHorizontal && `margin-top:${startOffset}px;margin-bottom:${endOffset}px`) ||
					`margin-left:${startOffset}px;margin-right:${endOffset}px;width:${totalViewportSize() - endOffset - startOffset}px`)
		);
	});
	// ======= FUNCTIONS =======
	onMount(() => {
		listContainer.addEventListener('scroll', onScroll, thirdEventArg);
		refreshOffsets();
		if (scrollToOffset !== undefined) {
			scrollTo(scrollToOffset);
		} else if (scrollToIndex !== undefined) {
			scrollTo(getOffsetForIndex(scrollToIndex));
		}
		mounted = true;
	});
	onDestroy(() => {
		if (mounted) listContainer.removeEventListener('scroll', onScroll);
	});
	$effect(() => {
		//@ts-expect-error unused no side effect
		scrollToIndex, scrollToAlignment, scrollToOffset, items.length, sizingCalculator;
		propsUpdated();
	});
	$effect(() => {
		//@ts-expect-error not assigned
		startIdx, endIdx;
		propsUpdated();
	});
	$effect(() => {
		if (curState.scrollChangeReason === SCROLL_CHANGE_REASON.REQUESTED) {
			scrollTo(curState.offset);
		} else {
			refreshOffsets();
		}
	});
	let prevProps = {};
	async function propsUpdated() {
		if (!mounted) return;
		if (scrollToIndex && scrollToOffset) {
			console.error('VirtualList: scrollToIndex and scrollToOffset MUST NOT be used together.');
		}
		const scrollPropsHaveChanged =
			prevProps?.scrollToIndex !== scrollToIndex ||
			prevProps?.scrollToAlignment !== scrollToAlignment;
		const itemPropsHaveChanged =
			prevProps?.modelCount !== items.length ||
			prevProps?.sizingCalculator !== sizingCalculator ||
			prevProps?.avgSizeInPx !== avgSizeInPx ||
			prevProps?.clientHeight !== clientHeight ||
			prevProps?.clientWidth !== clientWidth;
		if (itemPropsHaveChanged) {
			await recomputeSizes();
		}
		const scrollOffsetHaveChanged = prevProps?.scrollToOffset !== scrollToOffset;
		if (scrollOffsetHaveChanged) {
			curState = {
				offset: scrollToOffset || 0,
				scrollChangeReason: SCROLL_CHANGE_REASON.REQUESTED
			};
		} else if (
			typeof scrollToIndex === 'number' &&
			(scrollPropsHaveChanged || itemPropsHaveChanged)
		) {
			curState = {
				offset: getOffsetForIndex(scrollToIndex),
				scrollChangeReason: SCROLL_CHANGE_REASON.REQUESTED
			};
		}
		if (
			onVisibleRangeUpdate &&
			(prevProps?.startIdx !== startIdx || prevProps?.endIdx !== endIdx)
		) {
			const vr = getVisibleRange(isHorizontal ? clientWidth : clientHeight, curState.offset);
			onVisibleRangeUpdate(vr);
		}
		prevProps = {
			scrollToIndex,
			scrollToAlignment,
			scrollToOffset,
			modelCount: items.length,
			sizingCalculator,
			avgSizeInPx,
			clientHeight,
			clientWidth,
			startIdx,
			endIdx
		};
	}
	async function recomputeSizes(startIndex = 0) {
		//resetItem
		lastMeasuredIndex = Math.min(lastMeasuredIndex, startIndex - 1);
		await refreshOffsets();
	}
	function onScroll(event) {
		const offset = isHorizontal ? listContainer.scrollLeft : listContainer.scrollTop;
		if (event.target !== listContainer || offset < 0 || curState.offset === offset) return;
		if (prevState?.offset !== offset) {
			curState = {
				offset,
				scrollChangeReason: SCROLL_CHANGE_REASON.OBSERVED
			};
			onAfterScroll?.({ offset, event });
		}
	}
	function getOffsetForIndex(index, align = scrollToAlignment, _modelCount = items.length) {
		if (index < 0) {
			index = 0;
		} else if (index >= _modelCount) {
			index = _modelCount - 1;
		}
		return getUpdatedOffsetForIndex(
			align,
			isHorizontal ? clientWidth : clientHeight,
			curState.offset /*|| 0*/,
			index
		);
	}
	/**
	 * Determines a new offset that ensures a certain item is visible, given the alignment.
	 *
	 * @param align Desired alignment within container
	 * @param containerSize Size (width or height) of the container viewport
	 * @return Offset to use to ensure the specified item is visible
	 */
	function getUpdatedOffsetForIndex(
		align = ALIGNMENT.START,
		containerSize,
		currentOffset,
		targetIndex
	) {
		if (containerSize <= 0) {
			return 0;
		}
		const size = sizes[targetIndex];
		const maxOffset = offsets[targetIndex];
		const minOffset = maxOffset - containerSize + size;
		let idealOffset;
		switch (align) {
			case ALIGNMENT.END:
				idealOffset = minOffset;
				break;
			case ALIGNMENT.CENTER:
				idealOffset = maxOffset - (containerSize - size) / 2;
				break;
			case ALIGNMENT.START:
				idealOffset = maxOffset;
				break;
			default:
				idealOffset = Math.max(minOffset, Math.min(maxOffset, currentOffset));
		}
		return Math.max(0, Math.min(totalViewportSize() - containerSize, idealOffset));
	}
	/**
	 * Searches for the item (index) nearest the specified offset.
	 *
	 * If no exact match is found the next lowest item index will be returned.
	 * This allows partially visible items (with offsets just before/above the fold) to be visible.
	 *
	 */
	function findNearestItem(offset) {
		if (isNaN(offset)) {
			throw Error(`Invalid offset ${offset} specified`);
		}
		// Our search algorithms find the nearest match at or below the specified offset.
		// So make sure the offset is at least 0 or no match will be found.
		offset = Math.max(0, offset);
		const lastMeasuredSizeAndPosition = getSizeAndPositionOfLastMeasuredItem();
		const i = Math.max(0, lastMeasuredIndex);
		if (lastMeasuredSizeAndPosition.offset >= offset) {
			// If we've already measured items within this range just use a binary search as it's faster.
			return binarySearch(0, i, offset);
		} else {
			// If we haven't yet measured this high, fallback to an exponential search with an inner binary search.
			// The exponential search avoids pre-computing sizes for the full set of items as a binary search would.
			// The overall complexity for this approach is O(log n).
			return exponentialSearch(i, offset);
		}
	}
	function getSizeAndPositionOfLastMeasuredItem() {
		return lastMeasuredIndex >= 0
			? { offset: offsets[lastMeasuredIndex], size: sizes[lastMeasuredIndex] }
			: { offset: 0, size: 0 };
	}
	function binarySearch(low, high, offset) {
		let middle = 0;
		let currentOffset = 0;
		while (low <= high) {
			middle = low + Math.floor((high - low) / 2);
			currentOffset = offsets[middle];
			if (currentOffset === offset) {
				return middle;
			} else if (currentOffset < offset) {
				low = middle + 1;
			} else if (currentOffset > offset) {
				high = middle - 1;
			}
		}
		if (low > 0) {
			return low - 1;
		}
		return 0;
	}
	function exponentialSearch(index, offset) {
		let interval = 1;
		while (index < items.length && offsets[index] < offset) {
			index += interval;
			interval *= 2;
		}
		return binarySearch(Math.floor(index / 2), Math.min(index, items.length - 1), offset);
	}
	// recalculates the viewport position
	async function refreshOffsets() {
		if (!avgSizeInPx) {
			avgSizeInPx = getAvgSize();
		}
		const vr = getVisibleRange(
			isHorizontal ? clientWidth : clientHeight,
			curState.offset,
			WINDOW_OVERSIZE_COUNT
		);
		startIdx = vr.start;
		endIdx = vr.end;
		await tick();
		let vi0 = 0;
		// holds index -> offset
		const itemOffsetsTemp = {};
		const children = !isTable ? listInner.children : listInner.querySelector('tbody').children;
		for (let i = 0; i < children.length; i++) {
			const el = children[i];
			const stl = getComputedStyle(el);
			// ignore entries marked as fixed or absolute
			const cssPosition = stl.position;
			if (cssPosition && ['absolute', 'fixed'].includes(cssPosition)) {
				continue;
			}
			const size = stl.display !== 'none' ? getOuterSize(el) : 0;
			const index = startIdx + vi0;
			itemOffsetsTemp[index] = (itemOffsetsTemp[index] || 0) + size;
			vi0++;
		}
		// only update the elements that moved
		for (const k of Object.keys(itemOffsetsTemp)) {
			const index = parseInt(k);
			if (rawSizes[index] !== itemOffsetsTemp[index]) {
				rawSizes[index] = itemOffsetsTemp[index];
			}
		}
	}
	function getAvgSize() {
		const maxSampleCount = 10;
		const sizeArr = [];
		const children = !isTable ? listInner.children : listInner.querySelector('tbody').children;
		for (let index = 0; index < children.length; index++) {
			const el = children[index];
			const style = getComputedStyle(el);
			if (['absolute', 'fixed'].includes(style.position)) {
				continue;
			}
			const outerSize = getOuterSize(el);
			sizeArr.push(outerSize);
			if (sizeArr.length >= maxSampleCount) {
				break;
			}
		}
		if (sizeArr.length === 0) {
			return 0;
		}
		return sizeArr.reduce((a, b) => a + b, 0) / sizeArr.length;
	}
	function getClientSize(el) {
		const style = getComputedStyle(el);
		let r = parseFloat(!isHorizontal ? style.height : style.width);
		if (style.boxSizing === 'border-box') {
			if (!isHorizontal) {
				r -= parseFloat(style.borderTopWidth) - parseFloat(style.borderBottomWidth);
			} else {
				r -= parseFloat(style.borderLeftWidth) - parseFloat(style.borderRightWidth);
			}
		}
		return r;
	}
	// returns an index range
	function getVisibleRange(containerSize = 0, scrollbarOffset, windowOverPaddingCount = 0) {
		// TODO: is there a easier way to make this check?
		if (totalViewportSize() === 0) return { start: 0, end: 0 };
		const maxOffset = scrollbarOffset + containerSize;
		let startIdx = findNearestItem(scrollbarOffset);
		if (startIdx === undefined) {
			throw Error(`Invalid offset ${scrollbarOffset} specified`);
		}
		let offset = offsets[startIdx] + sizes[startIdx];
		let endIdx = startIdx;
		while (offset < maxOffset && endIdx < items.length - 1) {
			endIdx++;
			offset += sizes[endIdx];
		}
		if (windowOverPaddingCount > 0) {
			startIdx = Math.max(0, startIdx - windowOverPaddingCount);
			endIdx = Math.min(endIdx + windowOverPaddingCount, items.length - 1);
		}
		return {
			start: startIdx,
			end: endIdx
		};
	}
	function getOuterSize(el) {
		const style = getComputedStyle(el);
		let r = getClientSize(el);
		if (isHorizontal) {
			r +=
				parseFloat(style.borderLeftWidth) +
				parseFloat(style.borderRightWidth) +
				parseFloat(style.marginLeft) +
				parseFloat(style.marginRight);
		} else {
			r +=
				parseFloat(style.borderTopWidth) +
				parseFloat(style.borderBottomWidth) +
				parseFloat(style.marginTop) +
				parseFloat(style.marginBottom);
		}
		return Number.isNaN(r) ? 0 : r;
	}
	// scrolls the contrainer to give px value
	function scrollTo(value) {
		if ('scroll' in listContainer) {
			const p = { behavior: scrollToBehaviour };
			p[isHorizontal ? 'left' : 'top'] = value;
			listContainer.scroll(p);
		} else {
			//@ts-expect-error no index signature
			listContainer[isHorizontal ? 'scrollLeft' : 'scrollTop'] = value;
		}
	}
</script>

<div
	data-fullscreen={false}
	bind:this={listContainer}
	bind:clientHeight
	bind:clientWidth
	class={clsx('vtlist grid-container-wrapper', className)}
	style={listStyle}
>
	<div bind:this={listInner} class="grid-container !w-full min-w-max" style={listInnerStyle}>
		{@render header?.()}
		{#each visibleItemsInfo as item}
			{@render vl_slot(item)}
		{/each}
		{@render footer?.()}
	</div>
</div>
