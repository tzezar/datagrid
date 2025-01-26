import type { TzezarsDatagrid } from "../index.svelte";
import type { Feature } from "./types";



export type AnimationsFeatureConfig = {
    animateHeaders?: boolean;
    animateRows?: boolean;
    animationDuration?: number;
}


export class AnimationsFeature implements Feature {
    datagrid: TzezarsDatagrid

    animateHeaders: boolean = $state(false);
    animateRows: boolean = $state(false);
    flipMultiplier: number = $state(3);

    constructor(datagrid: TzezarsDatagrid, config?: AnimationsFeatureConfig) {
        this.datagrid = datagrid;
        this.initialize(config);
    }

    initialize(config?: AnimationsFeatureConfig) {
        this.flipMultiplier = config?.animationDuration ?? this.flipMultiplier;
        this.animateHeaders = config?.animateHeaders ?? this.animateHeaders;
        this.animateRows = config?.animateRows ?? this.animateRows;
    }

    shouldAnimateHeaders() {
        return this.animateHeaders;
    }

    shouldAnimateRows() {
        return this.animateRows;
    }

    getHeadersFlipDuration(len: number): number {
        return this.animateHeaders ? len * this.flipMultiplier : 0
    }

    getRowsFlipDuration(len: number): number {
        return this.animateRows ? len * this.flipMultiplier : 0
    }

}