import type { DatagridCore } from "$lib/datagrid/core/index.svelte";

export type AnimationsPluginConfig = {
    animateHeaders?: boolean;
    animateRows?: boolean;
    animationMultiplier?: number;
};

export class AnimationsPlugin {
    datagrid: DatagridCore;
    animateHeaders: boolean = $state(true);
    animateRows: boolean = $state(true);
    animationDuration: number = $state(60);

    constructor(datagrid: DatagridCore, config?: AnimationsPluginConfig) {
        this.datagrid = datagrid;
        this.initialize(config);
    }

    initialize(config?: AnimationsPluginConfig) {
        const { animateHeaders = this.animateHeaders, animateRows = this.animateRows, animationMultiplier = this.animationDuration } = config ?? {};
        this.animateHeaders = animateHeaders;
        this.animateRows = animateRows;
        this.animationDuration = animationMultiplier;
    }

    private shouldAnimate(): boolean {
        const columns = this.datagrid.columns.getLeafColumns();

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
