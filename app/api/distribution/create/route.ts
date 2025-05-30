import { NextRequest } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { sign } from 'tweetnacl';
import { Network } from '@/lib/blockchain/network';
import { generateDepositAddress } from '@/lib/blockchain/deposit';

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { name, tokenAddress, walletAddress, signature, message, network } = body;

        if (!name || !tokenAddress || !walletAddress || !network) {
            return new Response(JSON.stringify({ error: 'Missing required fields' }), { status: 400 });
        }

        if (network !== Network.SOLANA_DEVNET) {
            if (!signature || !message) {
                return new Response(JSON.stringify({ error: 'Missing signature or message' }), { status: 400 });
            }
            const messageBytes = new TextEncoder().encode(message);
            const signatureBytes = new Uint8Array(signature.split(',').map(Number));
            const publicKeyBytes = new Uint8Array(walletAddress.split(',').map(Number));
            const isValid = sign.detached.verify(messageBytes, signatureBytes, publicKeyBytes);
            if (!isValid) {
                return new Response(JSON.stringify({ error: 'Invalid signature' }), { status: 400 });
            }
        }

        let user = await prisma.user.findUnique({ where: { walletAddress } });
        if (!user) {
            user = await prisma.user.create({ data: { walletAddress } });
        }

        const lastAddress = await prisma.depositAddress.findFirst({
            where: { userId: user.id },
            orderBy: { createdAt: 'desc' }
        });
        const index = lastAddress ? parseInt(lastAddress.derivationPath.split('/')[3]) + 1 : 0;

        const mnemonic = process.env.MNEMONIC;
        if (!mnemonic) {
            throw new Error('MNEMONIC is not set in environment variables');
        }
        const depositAddress = generateDepositAddress(mnemonic, user.id, index);

        const savedAddress = await prisma.depositAddress.create({
            data: {
                userId: user.id,
                address: depositAddress.address,
                derivationPath: depositAddress.derivationPath,
                status: 'ACTIVE'
            }
        });

        const distribution = await prisma.distribution.create({
            data: {
                name,
                tokenAddress,
                userId: user.id,
                depositAddressId: savedAddress.id,
                status: 'PENDING'
            },
            include: {
                depositAddress: true
            }
        });

        return new Response(JSON.stringify(distribution), { status: 201 });
    } catch (error) {
        return new Response(JSON.stringify({ error: 'Failed to create distribution' }), { status: 500 });
    }
} 