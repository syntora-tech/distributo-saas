import { NextResponse } from 'next/server';
import { Connection, PublicKey } from '@solana/web3.js';
import prisma from '@/lib/prisma';
import { Network, NETWORK_CONFIGS, isValidNetwork, getConnection } from '@/lib/blockchain/network';

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const address = searchParams.get('address');
        const network = searchParams.get('network') as Network || Network.SOLANA_MAINNET;

        if (!address) {
            return NextResponse.json({ error: 'Address is required' }, { status: 400 });
        }

        if (!isValidNetwork(network)) {
            return NextResponse.json({ error: 'Invalid network' }, { status: 400 });
        }

        // Отримуємо адресу з бази даних
        const depositAddress = await prisma.depositAddress.findUnique({
            where: { address: address },
            select: { address: true }
        });

        if (!depositAddress) {
            return NextResponse.json({ error: 'Deposit address not found' }, { status: 404 });
        }

        const connection = getConnection(network);
        const publicKey = new PublicKey(depositAddress.address);

        // Отримуємо баланс SOL
        const solBalance = await connection.getBalance(publicKey);

        // Отримуємо баланс SPL токенів
        const tokenAccounts = await connection.getParsedTokenAccountsByOwner(publicKey, {
            programId: new PublicKey('TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA'),
        });

        const balances = {
            sol: solBalance / 1e9, // Конвертуємо lamports в SOL
            spl: tokenAccounts.value.map(account => ({
                mint: account.account.data.parsed.info.mint,
                amount: account.account.data.parsed.info.tokenAmount.uiAmount,
            })),
            network: NETWORK_CONFIGS[network].name,
            explorer: NETWORK_CONFIGS[network].explorer,
        };

        return NextResponse.json(balances);
    } catch (error) {
        console.error('Error checking balances:', error);
        return NextResponse.json(
            { error: 'Failed to check balances' },
            { status: 500 }
        );
    }
} 