export type OverlayFeatureConfig = {
    entireDatagridOverlayEnabled?: boolean
    bodyOverlayEnabled?: boolean
}

export class OverlayFeature {
    entireDatagridOverlayEnabled: boolean = $state(false)
    bodyOverlayEnabled: boolean = $state(false)

    constructor(config?: OverlayFeatureConfig) {
        this.entireDatagridOverlayEnabled = config?.entireDatagridOverlayEnabled ?? this.entireDatagridOverlayEnabled
        this.bodyOverlayEnabled = config?.bodyOverlayEnabled ?? this.bodyOverlayEnabled
    }

    isEntireDatagridOverlayEnabled() {
        return this.entireDatagridOverlayEnabled
    }

    isBodyOverlayEnabled() {
        return this.bodyOverlayEnabled
    }


}