

export type VirtualizationPluginConfig = {
    enabled?: boolean;
}

export class VirtualizationPlugin {
    enabled: boolean = $state(false);

    constructor(config?: VirtualizationPluginConfig) {
        this.enabled = config?.enabled ?? this.enabled;
    }

    enableVirtualization() {
        this.enabled = true;
    }

    disableVirtualization() {
        this.enabled = false;
    }

    toggleVirtualization() {
        if (this.enabled) {
            this.disableVirtualization();
        } else {
            this.enableVirtualization();
        }
    }

    isEnabled() {
        return this.enabled;
    }

}
