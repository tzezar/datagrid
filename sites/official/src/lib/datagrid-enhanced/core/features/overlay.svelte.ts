import type { TzezarsDatagrid } from "../index.svelte"


export type OverlayFeatureConfig = {
    wrapperOverlayVisible?: boolean
    bodyOverlayVisible?: boolean
}

export class OverlayFeature {
    datagrid: TzezarsDatagrid
    wrapperOverlayVisible: boolean = $state(false)
    bodyOverlayVisible: boolean = $state(false)

    constructor(datagrid: TzezarsDatagrid, config?: OverlayFeatureConfig) {
        this.datagrid = datagrid
        this.initialize(config)
    }

    initialize(config?: OverlayFeatureConfig) {
        this.wrapperOverlayVisible = config?.wrapperOverlayVisible ?? this.wrapperOverlayVisible
        this.bodyOverlayVisible = config?.bodyOverlayVisible ?? this.bodyOverlayVisible
    }

    toggleWrapperOverlay() {
        this.wrapperOverlayVisible = !this.wrapperOverlayVisible
    }

    toggleBodyOverlay() {
        this.bodyOverlayVisible = !this.bodyOverlayVisible
    }

    shouldShowWrapperOverlay() {
        return this.wrapperOverlayVisible
    }

    shouldShowBodyOverlay() {
        return this.bodyOverlayVisible
    }


}