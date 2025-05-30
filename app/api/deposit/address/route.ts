import { NextRequest } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { generateDepositAddress } from '@/lib/blockchain/deposit';

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { userId } = body;

        if (!userId) {
            return new Response(JSON.stringify({ error: 'Missing userId' }), { status: 400 });
        }

        const mnemonic = process.env.WALLET_MNEMONIC;
        if (!mnemonic) {
            throw new Error('WALLET_MNEMONIC is not set in environment variables');
        }

        // Get the last used index for this user
        const lastAddress = await prisma.depositAddress.findFirst({
            where: { userId },
            orderBy: { createdAt: 'desc' }
        });

        const index = lastAddress ? parseInt(lastAddress.derivationPath.split('/')[2]) + 1 : 0;

        // Generate new address
        const depositAddress = generateDepositAddress(mnemonic, userId, index);

        // Save to database
        const savedAddress = await prisma.depositAddress.create({
            data: {
                userId,
                address: depositAddress.address,
                derivationPath: depositAddress.derivationPath,
                status: 'ACTIVE'
            }
        });

        return new Response(JSON.stringify(savedAddress), { status: 201 });
    } catch (error) {
        console.error('Error generating deposit address:', error);
        return new Response(JSON.stringify({ error: 'Failed to generate deposit address' }), { status: 500 });
    }
} 