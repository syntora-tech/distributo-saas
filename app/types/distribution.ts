export interface Recipient {
    address: string;
    amount: number;
}

export interface DistributionFormData {
    tokenAddress: string;
    tokenName: string;
    recipients: Recipient[];
}

export type DistributionStep =
    | 'create'
    | 'recipients'
    | 'funding'
    | 'start'
    | 'monitor';

export interface DistributionState {
    currentStep: DistributionStep;
    formData: DistributionFormData;
    isProcessing: boolean;
    error: string | null;
} 