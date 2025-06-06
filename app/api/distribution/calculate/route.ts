import { NextResponse } from "next/server";
import { DistributionCalculationRequest, TransactionSpeed } from "@/types/distribution";
import { WalletAdapterNetwork } from '@solana/wallet-adapter-base';
import { clusterApiUrl, Connection, Keypair, PublicKey } from '@solana/web3.js';
import { TransferOptimizer } from '@/lib/blockchain/transferOptimizer';

// Mock constants for different speeds
const SPEED_CONFIGS: Record<TransactionSpeed, { networkFee: string; serviceFee: string; timePerTx: number }> = {
    slow: {
        networkFee: "0.0005", // 0.0005 ETH
        serviceFee: "0.0002", // 0.0002 ETH
        timePerTx: 2, // 2 minutes per transaction
    },
    medium: {
        networkFee: "0.001", // 0.001 ETH
        serviceFee: "0.0003", // 0.0003 ETH
        timePerTx: 1, // 1 minute per transaction
    },
    fast: {
        networkFee: "0.002", // 0.002 ETH
        serviceFee: "0.0004", // 0.0004 ETH
        timePerTx: 0.5, // 0.5 minute per transaction
    },
};

// Mock function for calculating distribution
const calculateDistribution = async (
    recipients: DistributionCalculationRequest["recipients"],
    speed: TransactionSpeed,
    network: WalletAdapterNetwork
): Promise<{
    totalTransactions: number;
    fees: {
        networkFee: string;
        serviceFee: string;
        total: string;
    };
    estimatedTime: string;
    network: WalletAdapterNetwork;
}> => {
    const config = SPEED_CONFIGS[speed];
    const totalTransactions = recipients.length;

    const networkFee = (parseFloat(config.networkFee) * totalTransactions).toFixed(6);
    const serviceFee = (parseFloat(config.serviceFee) * totalTransactions).toFixed(6);
    const totalFee = (parseFloat(networkFee) + parseFloat(serviceFee)).toFixed(6);
    const estimatedTime = (config.timePerTx * totalTransactions).toString();

    return {
        totalTransactions,
        fees: {
            networkFee,
            serviceFee,
            total: totalFee,
        },
        estimatedTime,
        network,
    };
};

export async function POST(request: Request) {
    try {
        const body = await request.json() as DistributionCalculationRequest;

        if (!body.recipients || !Array.isArray(body.recipients) || !body.network || !body.tokenMint) {
            return NextResponse.json(
                { error: "Invalid request body" },
                { status: 400 }
            );
        }

        if (!body.speed || !Object.values(TransactionSpeed).includes(body.speed)) {
            return NextResponse.json(
                { error: "Invalid speed parameter. Must be one of: slow, medium, fast" },
                { status: 400 }
            );
        }

        // Визначаємо endpoint Solana
        let endpoint = clusterApiUrl(body.network);
        const connection = new Connection(endpoint, 'confirmed');

        // Створюємо тимчасовий Keypair для feePayer (тільки для симуляції)
        const payer = Keypair.generate();
        const tokenMint = new PublicKey(body.tokenMint);
        const optimizer = new TransferOptimizer(connection, payer.publicKey);

        // recipients: { address, amount } -> { to, amount }
        const recipients = body.recipients.map(r => ({ to: r.address, amount: r.amount }));

        const simulationResult = await optimizer.simulateSplTokensWithServiceFee({
            recipients,
            tokenMint,
            speed: body.speed,
            depositKeypair: payer,
            withServiceFee: true,
        });

        return NextResponse.json({
            totalTransactions: recipients.length,
            fees: {
                networkFee: simulationResult.networkFee,
                serviceFee: simulationResult.serviceFee,
                total: simulationResult.totalFee,
                rentExemptFee: simulationResult.rentExemptFee,
                postTxBufferFee: simulationResult.postTxBufferFee,
            },
            estimatedTime: '', // можна додати оцінку часу, якщо потрібно
            network: body.network,
        });
    } catch (error) {
        console.error("Error simulating distribution:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
} 