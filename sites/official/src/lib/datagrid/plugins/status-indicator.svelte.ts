type IStatusIntdicator = {
    enabled: boolean;
    position: StatusIndicatorPosition;
    state: StatusIndicatorState;
    onLoadingIndicatorChange: (state: StatusIndicatorState) => void;
    isVisible(target: StatusIndicatorPosition): boolean;
    updateState(state: StatusIndicatorState): void;
}

export type StatusIndicatorPluginConfig = {
    enabled?: boolean;
    state?: 'loading' | 'saving' | 'error';
    position?: StatusIndicatorPosition;
    onLoadingIndicatorChange?(state: StatusIndicatorState): void;
}

export type StatusIndicatorState = 'loading' | 'saving' | 'error' | 'none';
export type StatusIndicatorPosition = 'top' | 'bottom' | 'both';

export class StatusIndicatorPlugin implements IStatusIntdicator {

    enabled: boolean = $state(true);
    position: StatusIndicatorPosition = $state('top');
    state: StatusIndicatorState = $state('none');

    onLoadingIndicatorChange: (state: StatusIndicatorState) => void = () => { };

    constructor(config?: StatusIndicatorPluginConfig) {
        this.enabled = config?.enabled ?? this.enabled;
        this.position = config?.position ?? this.position;
        this.state = config?.state ?? this.state;
        this.onLoadingIndicatorChange = config?.onLoadingIndicatorChange ?? this.onLoadingIndicatorChange;
    }

    isVisible(target: StatusIndicatorPosition) {
        if (!this.enabled || this.state === 'none') return false;

        const positions = {
            top: ['top', 'both'],
            bottom: ['bottom', 'both'],
            both: ['both'],
        };

        return positions[target]?.includes(this.position) || false;
    }

    updateState(state: StatusIndicatorState) {
        this.state = state;
        this.onLoadingIndicatorChange(this.state);
    }

}