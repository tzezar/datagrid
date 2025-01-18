

export type CredentialsFeatureConfig = {
    enabled?: boolean;
    onCredentialsChange?(credentials: CredentialsFeatureConfig): void;
}

export class CredentialsFeature {
    enabled: boolean = $state(true);

    onCredentialsChange: (credentials: CredentialsFeatureConfig) => void = () => { };

    constructor(config?: CredentialsFeatureConfig) {
        if (config) {
            this.enabled = config.enabled ?? this.enabled;
            this.onCredentialsChange = config.onCredentialsChange ?? this.onCredentialsChange;
        }
    }



}