


export type AnimationsFeatureConfig = {
    animateHeaders?: boolean;
    animateRows?: boolean;
    animationDuration?: number;
}


export class AnimationsFeature {
    animateHeaders: boolean = $state(true);
    animateRows: boolean = $state(true);
    flipMultiplier: number = $state(3);

    constructor(config?: AnimationsFeatureConfig) {
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

    getFlipDuration(len: number): number {
        return this.animateHeaders ? len * this.flipMultiplier : 0
    }


}