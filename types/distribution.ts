export type TransactionSpeed = 'slow' | 'medium' | 'fast';

export interface DistributionRecipient {
    address: string;
    amount: string;
}

export interface DistributionCalculationRequest {
    recipients: DistributionRecipient[];
    speed: TransactionSpeed;
}

export interface FeeBreakdown {
    networkFee: string;
    serviceFee: string;
    total: string;
}

export interface DistributionCalculationResponse {
    totalTransactions: number;
    fees: FeeBreakdown;
    estimatedTime: string; // in minutes
}
