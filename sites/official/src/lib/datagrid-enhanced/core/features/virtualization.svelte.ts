

export type VirtualizationFeatureConfig = {
    enabled?: boolean;
}

export class VirtualizationFeature {
    enabled: boolean = $state(true);

    constructor(config?: VirtualizationFeatureConfig) {
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
