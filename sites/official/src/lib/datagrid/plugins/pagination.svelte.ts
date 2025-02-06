export type PaginationPosition = 'top' | 'bottom' | 'both' | 'none';

export type PaginationPluginConfig = {
    position?: PaginationPosition;
}

type IPaginationEnhancedFeature = {
    position: PaginationPosition;
}


export class PaginationPlugin implements IPaginationEnhancedFeature {
    position: PaginationPosition = $state('bottom');

    constructor(config?: PaginationPluginConfig & PaginationPluginConfig) {
        this.position = config?.position ?? this.position;
    }

    isPaginationVisible() {
        return this.position !== 'none'
    }

}