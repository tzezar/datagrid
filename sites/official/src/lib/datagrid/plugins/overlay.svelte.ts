export type OverlayPluginConfig = {
    entireDatagridOverlayEnabled?: boolean
    bodyOverlayEnabled?: boolean
}

export class OverlayPlugin {
    entireDatagridOverlayEnabled: boolean = $state(false)
    bodyOverlayEnabled: boolean = $state(false)

    constructor(config?: OverlayPluginConfig) {
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