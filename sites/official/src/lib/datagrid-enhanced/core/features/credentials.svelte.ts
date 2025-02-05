export type CredentialsFeatureConfig = {
    displayCredentials?: boolean;
    onCredentialsChange?(credentials: CredentialsFeatureConfig): void;
}

export class CredentialsFeature {
    enabled: boolean = $state(true);

    constructor(config?: CredentialsFeatureConfig) {
        this.enabled = config?.displayCredentials ?? this.enabled;
    }


}