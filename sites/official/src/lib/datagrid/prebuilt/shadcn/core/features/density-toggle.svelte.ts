
export type Density = 'xs' | 'sm' | 'md' | 'lg' | 'xl'

export type DensityToggleFeatureConfig = {
    density?: Density;
    enableDensityToggle?: boolean;
    onDensityChange?(density: Density): void;
}


export class DensityToggleFeature {
    density: Density = $state('md');
    enableDensityToggle: boolean = $state(true);
    onDensityChange: (density: Density) => void = () => { };

    constructor(config?: DensityToggleFeatureConfig) {
        if (config) {
            this.density = config.density ?? this.density;
            this.enableDensityToggle = config.enableDensityToggle ?? this.enableDensityToggle;
            this.onDensityChange = config.onDensityChange ?? this.onDensityChange;
        }
    }

}