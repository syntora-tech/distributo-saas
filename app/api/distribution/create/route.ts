import { NextRequest } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { sign } from 'tweetnacl';
import { WalletAdapterNetwork } from '@solana/wallet-adapter-base';
import { generateDepositAddress } from '@/lib/blockchain/deposit';
import { z } from 'zod';
import { createHash } from 'crypto';

const prisma = new PrismaClient();

// Validation schema for create distribution request
const createDistributionSchema = z.object({
    name: z.string().min(1, 'Name is required'),
    tokenAddress: z.string().min(1, 'Token address is required'),
    walletAddress: z.string().min(1, 'Wallet address is required'),
    network: z.nativeEnum(WalletAdapterNetwork),
    signature: z.string().optional(),
    message: z.string().optional(),
}).refine(data => {
    if (data.network !== WalletAdapterNetwork.Devnet) {
        return !!data.signature && !!data.message;
    }
    return true;
}, {
    message: 'Signature and message are required for non-devnet networks'
});

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();

        // Check if body exists
        if (!body) {
            return new Response(JSON.stringify({
                error: 'Request body is required'
            }), {
                status: 400,
                headers: { 'Content-Type': 'application/json' }
            });
        }

        // Validate request body
        const validationResult = createDistributionSchema.safeParse(body);
        if (!validationResult.success) {
            return new Response(JSON.stringify({
                error: 'Invalid request data',
                details: validationResult.error.errors
            }), {
                status: 400,
                headers: { 'Content-Type': 'application/json' }
            });
        }

        const { name, tokenAddress, walletAddress, signature, message, network } = validationResult.data;

        if (network !== WalletAdapterNetwork.Devnet) {
            const messageBytes = new TextEncoder().encode(message);
            const signatureBytes = new Uint8Array(signature!.split(',').map(Number));
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

        // Генеруємо унікальний індекс користувача через хеш
        const userIndexHash = createHash('sha256').update(user.id).digest();
        const userIndex = userIndexHash.readUInt32BE(0) & 0x7FFFFFFF; // Обмежуємо до 2^31-1

        // Знаходимо останній адрес тільки для цього користувача
        const lastAddress = await prisma.depositAddress.findFirst({
            where: {
                userId: user.id,
                status: 'ACTIVE'
            },
            orderBy: { createdAt: 'desc' }
        });

        // Індекс адреси в контексті користувача
        const addressIndex = lastAddress
            ? parseInt(lastAddress.derivationPath.split('/')[4]) + 1
            : 0;

        console.log('Generated indices:', {
            userId: user.id,
            walletAddress: user.walletAddress,
            userIndex,
            addressIndex,
            lastAddressPath: lastAddress?.derivationPath
        });

        const mnemonic = process.env.MNEMONIC;
        if (!mnemonic) {
            throw new Error('MNEMONIC is not set in environment variables');
        }
        const depositAddress = generateDepositAddress(mnemonic, userIndex, addressIndex);

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
            select: {
                id: true,
                name: true,
                tokenAddress: true,
                status: true,
                depositAddress: {
                    select: {
                        id: true,
                        address: true
                    }
                }
            }
        });

        return new Response(JSON.stringify({
            id: distribution.id,
            name: distribution.name,
            tokenAddress: distribution.tokenAddress,
            status: distribution.status,
            depositAddress: distribution.depositAddress
        }), { status: 201 });
    } catch (error) {
        console.error('Error creating distribution:', error);
        return new Response(JSON.stringify({ error: 'Failed to create distribution' }), { status: 500 });
    }
} 