import { NextResponse } from "next/server";
import { DistributionCalculationRequest, DistributionCalculationResponse, TransactionSpeed } from "@/types/distribution";

// Mock constants for different speeds
const SPEED_CONFIGS: Record<TransactionSpeed, { networkFee: string; serviceFee: string; timePerTx: number }> = {
    slow: {
        networkFee: "0.0005", // 0.0005 ETH
        serviceFee: "0.0002", // 0.0002 ETH
        timePerTx: 5, // 5 minutes per transaction
    },
    medium: {
        networkFee: "0.001", // 0.001 ETH
        serviceFee: "0.0003", // 0.0003 ETH
        timePerTx: 2, // 2 minutes per transaction
    },
    fast: {
        networkFee: "0.002", // 0.002 ETH
        serviceFee: "0.0004", // 0.0004 ETH
        timePerTx: 1, // 1 minute per transaction
    },
};

// Mock function for calculating distribution
const calculateDistribution = async (
    recipients: DistributionCalculationRequest["recipients"],
    speed: TransactionSpeed
): Promise<DistributionCalculationResponse> => {
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
    };
};

export async function POST(request: Request) {
    try {
        const body = await request.json() as DistributionCalculationRequest;

        if (!body.recipients || !Array.isArray(body.recipients)) {
            return NextResponse.json(
                { error: "Invalid request body" },
                { status: 400 }
            );
        }

        if (!body.speed || !['slow', 'medium', 'fast'].includes(body.speed)) {
            return NextResponse.json(
                { error: "Invalid speed parameter. Must be one of: slow, medium, fast" },
                { status: 400 }
            );
        }

        const result = await calculateDistribution(body.recipients, body.speed);
        return NextResponse.json(result);
    } catch (error) {
        console.error("Error calculating distribution:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
} 