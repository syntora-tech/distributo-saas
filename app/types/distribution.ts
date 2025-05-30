export interface Recipient {
    address: string;
    amount: number;
}

export interface DistributionFormData {
    tokenAddress: string;
    tokenName: string;
    recipients: Recipient[];
    depositAddressId?: string;
}

export type DistributionStep = 'create' | 'recipients' | 'review' | 'distribution' | 'complete';

export interface DistributionState {
    currentStep: DistributionStep;
    formData: DistributionFormData;
    isProcessing: boolean;
    error: string | null;
}

export type DistributionStatus = 'PENDING' | 'ACTIVE' | 'COMPLETED' | 'FAILED';

export interface Distribution {
    id: string;
    name: string;
    tokenAddress: string;
    status: DistributionStatus;
    createdAt: string;
    updatedAt: string;
    depositAddress: {
        id: string;
        address: string;
    };
    depositAddressId: string;
    recipients: Recipient[];
    userId: string;
} 