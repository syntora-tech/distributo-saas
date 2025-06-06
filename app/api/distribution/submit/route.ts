import { NextResponse } from 'next/server';
import { DistributionFormData } from '../../../types/distribution';
import prisma from '@/lib/prisma';
import { PublicKey, Keypair } from '@solana/web3.js';
import { derivePath } from 'ed25519-hd-key';
import * as bip39 from 'bip39';
import { TransferOptimizer } from '@/lib/blockchain/transferOptimizer';
import { TransactionSpeed } from '@/types/distribution';
import { getConnection, Network } from '@/lib/blockchain/network';
import { SERVICE_FEE_ADDRESS } from '@/lib/blockchain/config';

function generateKeypairFromMnemonicAndPath(mnemonic: string, derivationPath: string): Keypair {
    const seed = bip39.mnemonicToSeedSync(mnemonic);
    const { key } = derivePath(derivationPath, seed.toString('hex'));
    return Keypair.fromSeed(key);
}

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { distributionAddress, formData, transactionSpeed = 'medium', network = Network.SOLANA_DEVNET } = body as {
            distributionAddress: string;
            formData: DistributionFormData;
            transactionSpeed?: TransactionSpeed;
            customMultiplier?: number;
            network?: string;
        };

        if (!distributionAddress || !formData) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        // 1. Дістаємо distribution через depositAddress.address
        const depositAddress = await prisma.depositAddress.findUnique({
            where: { address: distributionAddress },
            include: { distributions: true }
        });
        if (!depositAddress || !depositAddress.distributions.length) {
            return NextResponse.json({ error: 'Distribution not found for this address' }, { status: 404 });
        }
        // Беремо останню дистрибуцію для цієї адреси (або уточнити логіку)
        const distribution = depositAddress.distributions[depositAddress.distributions.length - 1];
        const derivationPath = depositAddress.derivationPath;

        // 2. Дістаємо mnemonic з env
        const mnemonic = process.env.MNEMONIC;
        if (!mnemonic) {
            return NextResponse.json({ error: 'Mnemonic not set in env' }, { status: 500 });
        }

        // 3. Генеруємо Keypair напряму з mnemonic та derivationPath
        const keypair = generateKeypairFromMnemonicAndPath(mnemonic, derivationPath);

        // 4. Викликаємо TransferOptimizer
        const connection = getConnection(network as Network);
        const optimizer = new TransferOptimizer(connection, keypair.publicKey);
        const recipients = formData.recipients.map(r => ({ to: r.address, amount: r.amount }));
        const tokenMint = new PublicKey(formData.tokenAddress);
        const speed = transactionSpeed.toUpperCase() as TransactionSpeed || TransactionSpeed.MEDIUM;
        const results = await optimizer.distributeSplTokensWithServiceFee({
            recipients,
            tokenMint,
            speed,
            depositKeypair: keypair,
            withServiceFee: true
        });

        // 5. Зберігаємо txHash-и у базу (Transaction)
        for (const res of results) {
            if (res.txHash && res.status === 'success' && res.to.toLocaleLowerCase() !== SERVICE_FEE_ADDRESS.toLocaleLowerCase()) {
                await prisma.transaction.create({
                    data: {
                        hash: res.txHash,
                        status: 'COMPLETED',
                        amount: Number(res.amount),
                        walletAddress: res.to,
                        distributionId: distribution.id,
                        userId: distribution.userId,
                    }
                });
            }
        }

        return NextResponse.json({ distributionId: distribution.id, results });
    } catch (error) {
        console.error('Error submitting distribution:', error);
        return NextResponse.json(
            { error: 'Failed to submit distribution' },
            { status: 500 }
        );
    }
} 