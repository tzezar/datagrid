import type { TzezarsDatagrid } from "../index.svelte";
import type { Feature } from "./types";



export type AnimationsFeatureConfig = {
    animateHeaders?: boolean;
    animateRows?: boolean;
    animationMultiplier?: number;
}


export class AnimationsFeature implements Feature {
    datagrid: TzezarsDatagrid
    animateHeaders: boolean = $state(true);
    animateRows: boolean = $state(true);
    animationDuration: number = $state(60);

    constructor(datagrid: TzezarsDatagrid, config?: AnimationsFeatureConfig) {
        this.datagrid = datagrid;
        this.initialize(config);
    }

    initialize(config?: AnimationsFeatureConfig) {
        this.animationDuration = config?.animationMultiplier ?? this.animationDuration;
        this.animateHeaders = config?.animateHeaders ?? this.animateHeaders;
        this.animateRows = config?.animateRows ?? this.animateRows;
    }

    shouldAnimateHeaders() {
        return this.animateHeaders && this.datagrid.columnManager.getLeafColumns()
            .filter(col => col.isVisible() && col.state.pinning.position === 'left').length < 1 && this.datagrid.columnManager.getLeafColumns()
                .filter(col => col.isVisible() && col.state.pinning.position === 'right').length < 1;
    }

    shouldAnimateRows() {
        return this.animateRows && this.datagrid.columnManager.getLeafColumns()
            .filter(col => col.isVisible() && col.state.pinning.position === 'left').length < 1 && this.datagrid.columnManager.getLeafColumns()
                .filter(col => col.isVisible() && col.state.pinning.position === 'right').length < 1;
    }

    getHeadersFlipDuration(len: number): number {
        return this.animateHeaders ? Math.sqrt(len) * this.animationDuration : 0
    }

    getRowsFlipDuration(len: number): number {
        return this.animateRows ? Math.sqrt(len) * this.animationDuration : 0
    }

}