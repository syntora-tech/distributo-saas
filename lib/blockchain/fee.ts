import { Connection, LAMPORTS_PER_SOL } from '@solana/web3.js';
import { Network } from './network';

export enum TransactionSpeed {
    STANDARD = 'standard',
    PRIORITY = 'priority',
    URGENT = 'urgent'
}

export interface FeeEstimation {
    networkFee: string;
    serviceFee: string;
    totalCost: string;
    estimatedTime: number;
}

export interface NetworkFees {
    network: Network;
    baseFee: string;
    precision: number;
    speeds: {
        [key in TransactionSpeed]: FeeEstimation;
    };
}

const SPEED_MULTIPLIERS = {
    [TransactionSpeed.STANDARD]: 1,
    [TransactionSpeed.PRIORITY]: 1.5,
    [TransactionSpeed.URGENT]: 2
};

const SPEED_ESTIMATED_TIME = {
    [TransactionSpeed.STANDARD]: 2, // seconds
    [TransactionSpeed.PRIORITY]: 1, // seconds
    [TransactionSpeed.URGENT]: 0.5 // seconds
};

const SERVICE_FEE_PERCENTAGE = 0.01; // 1%

export async function getNetworkFees(
    connection: Connection,
    network: Network
): Promise<NetworkFees> {
    try {
        // Get current network fee
        const fees = await connection.getRecentPrioritizationFees();
        const baseFee = BigInt(fees[0]?.prioritizationFee || 5000); // Default to 5000 lamports if not available

        const speeds = Object.values(TransactionSpeed).reduce((acc, speed) => {
            const multiplier = SPEED_MULTIPLIERS[speed];
            const networkFee = BigInt(Math.round(Number(baseFee) * multiplier));
            const serviceFee = BigInt(Math.round(Number(networkFee) * SERVICE_FEE_PERCENTAGE));
            const totalCost = networkFee + serviceFee;

            acc[speed] = {
                networkFee: networkFee.toString(),
                serviceFee: serviceFee.toString(),
                totalCost: totalCost.toString(),
                estimatedTime: SPEED_ESTIMATED_TIME[speed]
            };
            return acc;
        }, {} as { [key in TransactionSpeed]: FeeEstimation });

        return {
            network,
            baseFee: baseFee.toString(),
            precision: 9, // lamports precision
            speeds
        };
    } catch (error) {
        console.error('Error getting network fees:', error);
        throw error;
    }
} 