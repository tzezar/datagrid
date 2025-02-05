import type { EnhancedDatagrid } from "../index.svelte";
import type { Feature } from "./types";

export type AnimationsFeatureConfig = {
    animateHeaders?: boolean;
    animateRows?: boolean;
    animationMultiplier?: number;
};

export class AnimationsFeature implements Feature {
    datagrid: EnhancedDatagrid;
    animateHeaders: boolean = $state(true);
    animateRows: boolean = $state(true);
    animationDuration: number = $state(60);

    constructor(datagrid: EnhancedDatagrid, config?: AnimationsFeatureConfig) {
        this.datagrid = datagrid;
        this.initialize(config);
    }

    initialize(config?: AnimationsFeatureConfig) {
        const { animateHeaders = this.animateHeaders, animateRows = this.animateRows, animationMultiplier = this.animationDuration } = config ?? {};
        this.animateHeaders = animateHeaders;
        this.animateRows = animateRows;
        this.animationDuration = animationMultiplier;
    }

    private shouldAnimate(): boolean {
        const { columnManager } = this.datagrid;
        const columns = columnManager.getLeafColumns();

        const isLeftPinned = columns.some(col => col.isVisible() && col.state.pinning.position === 'left');
        const isRightPinned = columns.some(col => col.isVisible() && col.state.pinning.position === 'right');

        return !isLeftPinned && !isRightPinned;
    }

    shouldAnimateHeaders() {
        return this.animateHeaders && this.shouldAnimate();
    }

    shouldAnimateRows() {
        return this.animateRows && this.shouldAnimate();
    }

    getHeadersFlipDuration(len: number): number {
        return this.animateHeaders ? Math.sqrt(len) * this.animationDuration : 0;
    }

    getRowsFlipDuration(len: number): number {
        return this.animateRows ? Math.sqrt(len) * this.animationDuration : 0;
    }
}
