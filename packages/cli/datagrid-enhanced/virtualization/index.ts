export { default as VirtualList } from './implementation.svelte';

export type SizingCalculatorFn = (index: number, item: unknown) => number;

export interface VLSlotSignature<ItemType> {
    index: number | string;
    item: ItemType;
    size?: number;
}

export interface VLRangeEvent {
    start: number;
    end: number;
}

export interface VLScrollEvent {
    offset: number | string;
    event: Event;
}

export enum SCROLL_BEHAVIOR {
    AUTO = "auto",
    SMOOTH = "smooth",
    INSTANT = "instant"
}

export enum ALIGNMENT {
    AUTO = "auto",
    START = "start",
    CENTER = "center",
    END = "end"
}
