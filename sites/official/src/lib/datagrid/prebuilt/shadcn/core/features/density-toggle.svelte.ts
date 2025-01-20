
export type Density = 'xs' | 'sm' | 'md' | 'lg' | 'xl'

export type DensityOption = {
    density?: Density;
    paddingTop?: number;
    paddingBottom?: number;
    paddingLeft?: number;
    paddingRight?: number;
}

export type DensityToggleFeatureConfig = {
    density?: Density;
    enableDensityToggle?: boolean;
    onDensityChange?(density: Density): void;
    options?: DensityOption[]
}

export const defaultDensityOptions: DensityOption[] = [
    {
        density: 'xs',
        paddingTop: 0,
        paddingBottom: 0,
        paddingLeft: 0,
        paddingRight: 0
    },
    {
        density: 'sm',
        paddingTop: 4,
        paddingBottom: 4,
        paddingLeft: 4,
        paddingRight: 4
    },
    {
        density: 'md',
        paddingTop: 8,
        paddingBottom: 8,
        paddingLeft: 8,
        paddingRight: 8
    },
    {
        density: 'lg',
        paddingTop: 12,
        paddingBottom: 12,
        paddingLeft: 12,
        paddingRight: 12
    },
    {
        density: 'xl',
        paddingTop: 16,
        paddingBottom: 16,
        paddingLeft: 16,
        paddingRight: 16
    }
]


export class DensityToggleFeature {
    enabled: boolean = $state(true);
    currentDensity: Density = $state('md');
    densityOptions: DensityOption[] = $state(defaultDensityOptions);
    onDensityChange: (density: Density) => void = () => { };

    constructor(config?: DensityToggleFeatureConfig) {
        this.initialize(config);
    }

    initialize(config?: DensityToggleFeatureConfig) {
        this.currentDensity = config?.density ?? this.currentDensity;
        this.enabled = config?.enableDensityToggle ?? this.enabled;
        this.onDensityChange = config?.onDensityChange ?? this.onDensityChange;
        this.densityOptions = config?.options ?? this.densityOptions;
    }



}