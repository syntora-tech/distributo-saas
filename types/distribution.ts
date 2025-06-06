import { Network } from "@/lib/blockchain/network";

export enum TransactionSpeed {
    SLOW = 'slow',
    MEDIUM = 'medium',
    FAST = 'fast'
}

export interface DistributionRecipient {
    address: string;
    amount: string;
}

export interface DistributionCalculationRequest {
    recipients: DistributionRecipient[];
    speed: TransactionSpeed;
    network: Network;
}

export interface FeeBreakdown {
    networkFee: string;
    serviceFee: string;
    total: string;
}

export interface DistributionCalculationResponse {
    totalTransactions: number;
    fees: FeeBreakdown;
    estimatedTime: string;
    network: Network;
}
