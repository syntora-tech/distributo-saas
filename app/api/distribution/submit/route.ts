import { NextResponse } from 'next/server';
import { DistributionFormData } from '../../../types/distribution';
import prisma from '@/lib/prisma';
import { Connection, PublicKey } from '@solana/web3.js';

type TransactionSpeed = 'slow' | 'medium' | 'fast' | 'custom';

const SPEED_MULTIPLIERS: Record<TransactionSpeed, number> = {
    slow: 1,
    medium: 1.5,
    fast: 2,
    custom: 1,
};

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { distributionId, formData, transactionSpeed = 'medium', customMultiplier } = body as {
            distributionId: string;
            formData: DistributionFormData;
            transactionSpeed?: TransactionSpeed;
            customMultiplier?: number;
        };

        if (!distributionId || !formData) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        // Отримуємо базову вартість транзакції
        const connection = new Connection(process.env.NEXT_PUBLIC_SOLANA_RPC_URL || 'https://api.mainnet-beta.solana.com');
        const { feeCalculator } = await connection.getRecentBlockhash();
        const baseFee = feeCalculator.lamportsPerSignature;

        // Розраховуємо загальну вартість для всіх транзакцій
        const totalTransactions = formData.recipients.length;
        const multiplier = transactionSpeed === 'custom' && customMultiplier
            ? customMultiplier
            : SPEED_MULTIPLIERS[transactionSpeed];
        const totalFee = baseFee * totalTransactions * multiplier;

        // Оновлюємо статус дистрибуції
        const distribution = await prisma.distribution.update({
            where: { id: distributionId },
            data: {
                status: 'ACTIVE',
                recipients: {
                    create: formData.recipients.map((recipient: any) => ({
                        address: recipient.address,
                        amount: recipient.amount,
                    })),
                },
                transactionSpeed,
                customMultiplier: transactionSpeed === 'custom' ? customMultiplier : null,
                estimatedFee: totalFee,
            },
        });

        return NextResponse.json(distribution);
    } catch (error) {
        console.error('Error submitting distribution:', error);
        return NextResponse.json(
            { error: 'Failed to submit distribution' },
            { status: 500 }
        );
    }
} 