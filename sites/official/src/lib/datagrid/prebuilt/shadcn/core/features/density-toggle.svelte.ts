
export type Density = 'xs' | 'sm' | 'md' | 'lg' | 'xl'

export class DensityToggleFeature {
    density: Density = $state('md');
    enableDensityToggle: boolean = $state(true);
    onDensityChange(density: Density) {

    }
}