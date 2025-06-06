// Optimized transaction formation for token transfer
// TODO: implement logic

import { PublicKey, ComputeBudgetProgram, SystemProgram, TransactionInstruction, Transaction, Keypair, sendAndConfirmTransaction, Connection } from '@solana/web3.js';
import { ASSOCIATED_TOKEN_PROGRAM_ID, TOKEN_PROGRAM_ID, createAssociatedTokenAccountInstruction, getAssociatedTokenAddress, createTransferInstruction, getMint } from '@solana/spl-token';
import { TransactionSpeed } from '../../types/distribution';
import { SPEED_TO_LAMPORTS, SERVICE_FEE_ADDRESS, SERVICE_FEE_SOL } from './config';

const PACKET_DATA_SIZE = 1280 - 40 - 8;
const LAMPORTS_PER_SOL = 1_000_000_000;

export enum typeOfTransaction {
    SPL_TRANSFER = 'spl_transfer',
    SERVICE_FEE = 'service_fee',
}

export interface SplTransferResult {
    type: typeOfTransaction;
    to: string;
    amount: number | string;
    txHash: string;
    timestamp: string;
    status?: 'success' | 'failed';
    error?: string;
}

export class TransferOptimizer {
    constructor(private connection: Connection, private payerPubkey: PublicKey) {
        // initialization if needed
    }

    // Method for forming optimized transactions
    optimizeTransfers(transfers: Array<any>): Array<any> {
        // TODO: implementation
        return [];
    }

    // Get ATA address for user and token (on-chain check)
    async getAssociatedTokenAddress(address: PublicKey, tokenMint: PublicKey): Promise<PublicKey | null> {
        const result = await this.connection.getTokenAccountsByOwner(
            address,
            { mint: tokenMint },
            { commitment: 'confirmed' }
        );
        if (result.value.length === 0) {
            return null;
        }
        return result.value[0].pubkey;
    }

    // Calculate ATA (pure, off-chain, canonical)
    async calcAssociatedTokenAddress(address: PublicKey, tokenMint: PublicKey): Promise<PublicKey> {
        return await getAssociatedTokenAddress(
            tokenMint,
            address,
            false,
            TOKEN_PROGRAM_ID,
            ASSOCIATED_TOKEN_PROGRAM_ID
        );
    }

    // Create instruction for creating ATA
    async createAssociatedTokenAccountTx(userPubkey: PublicKey, tokenMint: PublicKey) {
        const aTokenAddress = await this.calcAssociatedTokenAddress(userPubkey, tokenMint);
        const tx = createAssociatedTokenAccountInstruction(
            ASSOCIATED_TOKEN_PROGRAM_ID,
            TOKEN_PROGRAM_ID,
            tokenMint,
            aTokenAddress,
            userPubkey,
            this.payerPubkey
        );
        return {
            tx,
            aTokenAddress,
        };
    }

    // Public: get Priority Fee instruction by speed
    getPriorityFeeInstructionBySpeed(speed: TransactionSpeed) {
        const microLamports = SPEED_TO_LAMPORTS[speed] ?? SPEED_TO_LAMPORTS[TransactionSpeed.MEDIUM];
        return this.#createPriorityFeeInstruction(microLamports);
    }

    // Public: create SOL transfer instruction for ServiceFee
    createServiceFeeTransferInstruction(amount: number): TransactionInstruction {
        return this.#createNativeTransferInstruction(
            this.payerPubkey,
            new PublicKey(SERVICE_FEE_ADDRESS),
            amount
        );
    }

    // Public: create SPL transfer instructions (with optional ATA creation)
    async createSplTransferInstructions(
        sourceOwner: PublicKey,
        destinationOwner: PublicKey,
        tokenMint: PublicKey,
        amount: bigint | number
    ): Promise<{ instructions: TransactionInstruction[]; size: number }> {
        console.log('amount', amount);
        const sourceAta = await this.calcAssociatedTokenAddress(sourceOwner, tokenMint);
        const destinationAta = await this.calcAssociatedTokenAddress(destinationOwner, tokenMint);
        const destinationAtaExists = await this.getAssociatedTokenAddress(destinationOwner, tokenMint);

        const instructions: TransactionInstruction[] = [];
        if (!destinationAtaExists) {
            instructions.push(
                createAssociatedTokenAccountInstruction(
                    this.payerPubkey,
                    destinationAta,
                    destinationOwner,
                    tokenMint,
                    TOKEN_PROGRAM_ID,
                    ASSOCIATED_TOKEN_PROGRAM_ID
                )
            );
        }
        instructions.push(
            this.#createSplTransferInstruction(
                sourceAta,
                destinationAta,
                sourceOwner,
                amount
            )
        );

        // Estimate transaction size
        const tx = new Transaction();
        for (const ix of instructions) {
            tx.add(ix);
        }
        // Use payerPubkey as feePayer for size estimation
        tx.feePayer = this.payerPubkey;
        // Mock blockhash for size estimation
        tx.recentBlockhash = '11111111111111111111111111111111';
        const size = tx.serializeMessage().length + (tx.signatures.length + 1) * 64 + 1; // +1 for signature count varint

        return { instructions, size };
    }

    // Private: create Priority Fee instruction
    #createPriorityFeeInstruction(microLamports: number) {
        return ComputeBudgetProgram.setComputeUnitPrice({ microLamports });
    }

    // Private: create SOL transfer instruction
    #createNativeTransferInstruction(from: PublicKey, to: PublicKey, lamports: number): TransactionInstruction {
        return SystemProgram.transfer({
            fromPubkey: from,
            toPubkey: to,
            lamports,
        });
    }

    // Private: create SPL token transfer instruction (between known ATAs)
    #createSplTransferInstruction(
        sourceAta: PublicKey,
        destinationAta: PublicKey,
        owner: PublicKey,
        amount: bigint | number
    ): TransactionInstruction {
        return createTransferInstruction(
            sourceAta,
            destinationAta,
            owner,
            amount,
            [],
            TOKEN_PROGRAM_ID
        );
    }

    // Get decimals for SPL token
    async getTokenDecimals(tokenMint: PublicKey): Promise<number> {
        const mintInfo = await getMint(this.connection, tokenMint);
        return mintInfo.decimals;
    }

    // Validate address and amount
    #validateRecipient(to: string, amount: number | string): { valid: boolean; error?: string } {
        try {
            const pubkey = new PublicKey(to);
            const num = typeof amount === 'string' ? Number(amount) : amount;
            if (!Number.isFinite(num) || num <= 0) return { valid: false, error: 'Invalid amount' };
            return { valid: true };
        } catch {
            return { valid: false, error: 'Invalid address' };
        }
    }

    // Check if payer has enough SOL for all fees
    async #validateBalance(payer: PublicKey, totalFeeLamports: number): Promise<{ valid: boolean; error?: string }> {
        try {
            const balance = await this.connection.getBalance(payer);
            if (balance < totalFeeLamports) {
                return { valid: false, error: `Insufficient SOL for fees: required ${totalFeeLamports}, have ${balance}` };
            }
            return { valid: true };
        } catch (err) {
            return { valid: false, error: (err as Error).message };
        }
    }

    // Головна функція для масового переказу SPL з ServiceFee
    async distributeSplTokensWithServiceFee({
        recipients,
        tokenMint,
        speed,
        depositKeypair,
        withServiceFee = true
    }: {
        recipients: { to: string; amount: number | string }[];
        tokenMint: PublicKey;
        speed: TransactionSpeed;
        depositKeypair: Keypair;
        withServiceFee?: boolean;
    }): Promise<SplTransferResult[]> {
        const results: SplTransferResult[] = [];
        const priorityFeeIx = this.getPriorityFeeInstructionBySpeed(speed);
        const payer = depositKeypair;
        const payerPubkey = payer.publicKey;
        console.log('payerPubkey', payerPubkey.toBase58());

        // Get decimals for token
        const decimals = await this.getTokenDecimals(tokenMint);

        // Validate recipients
        for (const recipient of recipients) {
            const { valid, error } = this.#validateRecipient(recipient.to, recipient.amount);
            if (!valid) {
                results.push({
                    to: recipient.to,
                    amount: recipient.amount,
                    type: typeOfTransaction.SPL_TRANSFER,
                    txHash: '',
                    timestamp: new Date().toISOString(),
                    status: 'failed',
                    error
                });
            }
        }
        if (results.some(r => r.status === 'failed')) return results;

        // Готуємо всі інструкції для кожного отримувача
        const allInstructions: { to: string; amount: number | string; ixs: TransactionInstruction[]; needsAta: boolean }[] = [];
        let ataCreateCount = 0;
        for (const recipient of recipients) {
            const toPubkey = new PublicKey(recipient.to);
            // ensure amount is number, convert to lamports with decimals
            const parsedAmount = typeof recipient.amount === 'string' ? Number(recipient.amount) : recipient.amount;
            const lamportsAmount = Math.round(parsedAmount * Math.pow(10, decimals));
            const destinationAta = await this.calcAssociatedTokenAddress(toPubkey, tokenMint);
            const destinationAtaExists = await this.getAssociatedTokenAddress(toPubkey, tokenMint);
            const needsAta = !destinationAtaExists;
            if (needsAta) ataCreateCount++;
            const { instructions } = await this.createSplTransferInstructions(
                payerPubkey,
                toPubkey,
                tokenMint,
                lamportsAmount
            );
            allInstructions.push({ to: recipient.to, amount: lamportsAmount, ixs: instructions, needsAta });
        }

        // Chunking інструкцій у транзакції
        const txChunks: TransactionInstruction[][] = [];
        let currentChunk: TransactionInstruction[] = [priorityFeeIx];
        let currentSize = this.#estimateInstructionsSize(currentChunk);
        let chunkRecipients: { to: string; amount: number | string }[] = [];
        const chunkRecipientsArr: { to: string; amount: number | string }[][] = [];
        console.log('allInstructions', allInstructions);
        for (const { to, amount, ixs } of allInstructions) {
            for (const ix of ixs) {
                const estimatedSize = this.#estimateInstructionsSize([...currentChunk, ix]);
                if (estimatedSize > PACKET_DATA_SIZE) {
                    txChunks.push(currentChunk);
                    chunkRecipientsArr.push(chunkRecipients);
                    currentChunk = [priorityFeeIx, ix];
                    currentSize = this.#estimateInstructionsSize(currentChunk);
                } else {
                    currentChunk.push(ix);
                    currentSize = estimatedSize;
                }
            }
            if (chunkRecipients.length === 0) {
                chunkRecipients = [{ to, amount }];
            } else {
                chunkRecipients.push({ to, amount });
            }
        }
        if (currentChunk.length > 1) {
            txChunks.push(currentChunk);
            chunkRecipientsArr.push(chunkRecipients);
        }

        let totalChanks = txChunks.length;
        let serviceFeeLamports = Math.ceil(SERVICE_FEE_SOL * LAMPORTS_PER_SOL * totalChanks);
        let serviceFeeIx: TransactionInstruction | null = null;
        if (withServiceFee) {
            serviceFeeIx = this.createServiceFeeTransferInstruction(serviceFeeLamports);
            const lastChunkIdx = txChunks.length - 1;
            if (lastChunkIdx >= 0 && this.#estimateInstructionsSize([...txChunks[lastChunkIdx], serviceFeeIx]) <= PACKET_DATA_SIZE) {
                txChunks[lastChunkIdx].push(serviceFeeIx);
            } else {
                totalChanks++;
                serviceFeeLamports = Math.ceil(SERVICE_FEE_SOL * LAMPORTS_PER_SOL * totalChanks);
                const updatedServiceFeeIx = this.createServiceFeeTransferInstruction(serviceFeeLamports);
                txChunks.push([priorityFeeIx, updatedServiceFeeIx]);
                chunkRecipientsArr.push([]); // no SPL recipients in this chunk
            }
        }

        // Додаємо rent-exempt для ATA
        const rentExemptLamports = ataCreateCount > 0 ? await this.connection.getMinimumBalanceForRentExemption(165) * ataCreateCount : 0;

        // Estimate total fee (грубо: 5000 lamports за транзакцію + serviceFeeLamports + rent-exempt)
        const totalFeeLamports = totalChanks * 5000 + (withServiceFee ? serviceFeeLamports : 0) + rentExemptLamports;
        const balanceCheck = await this.#validateBalance(payerPubkey, totalFeeLamports);
        if (!balanceCheck.valid) {
            return recipients.map(r => ({
                to: r.to,
                amount: r.amount,
                txHash: '',
                timestamp: new Date().toISOString(),
                status: 'failed',
                error: balanceCheck.error
            }));
        }

        // Відправляємо транзакції з ретраями
        for (let i = 0; i < txChunks.length; i++) {
            const tx = new Transaction();
            for (const ix of txChunks[i]) {
                tx.add(ix);
            }
            tx.feePayer = payerPubkey;
            tx.recentBlockhash = (await this.connection.getLatestBlockhash()).blockhash;

            // Логування для дебагу
            const chunkAtaCount = tx.instructions.filter(ix => ix.programId.equals(ASSOCIATED_TOKEN_PROGRAM_ID)).length;
            const rentExemptForChunk = chunkAtaCount > 0 ? await this.connection.getMinimumBalanceForRentExemption(165) * chunkAtaCount : 0;
            const chunkHasServiceFee = withServiceFee && tx.instructions.some(ix => ix.programId.equals(SystemProgram.programId) && ix.keys.some(k => k.pubkey.toBase58() === SERVICE_FEE_ADDRESS));
            const chunkServiceFee = chunkHasServiceFee ? serviceFeeLamports : 0;
            const chunkFee = 5000;
            const balanceBefore = await this.connection.getBalance(payerPubkey);
            console.log('--- TRANSACTION CHUNK DEBUG ---');
            console.log('Chunk', i + 1, '/', txChunks.length);
            console.log('Balance before:', balanceBefore);
            console.log('ATA to create:', chunkAtaCount);
            console.log('Rent-exempt for chunk:', rentExemptForChunk);
            console.log('ServiceFee in chunk:', chunkServiceFee);
            console.log('Fee for chunk:', chunkFee);
            console.log('Instructions:', tx.instructions.map(ix => ix.programId.toBase58()));
            console.log('-------------------------------');

            try {
                const sendResult = await this.#sendWithRetry(tx, [payer], 3);
                const now = new Date().toISOString();
                for (const r of chunkRecipientsArr[i]) {
                    results.push({
                        type: typeOfTransaction.SPL_TRANSFER,
                        to: r.to,
                        amount: r.amount,
                        txHash: sendResult.txHash,
                        timestamp: now,
                        status: 'success'
                    });
                }
                // Якщо це транзакція з ServiceFee, додаємо окремий запис
                if (withServiceFee && txChunks[i].some(ix => ix.programId && ix.programId.equals(SystemProgram.programId) && ix.keys.some(k => k.pubkey.toBase58() === SERVICE_FEE_ADDRESS))) {
                    results.push({
                        type: typeOfTransaction.SERVICE_FEE,
                        to: SERVICE_FEE_ADDRESS,
                        amount: Math.ceil(SERVICE_FEE_SOL * LAMPORTS_PER_SOL * totalChanks),
                        txHash: sendResult.txHash,
                        timestamp: now,
                        status: 'success'
                    });
                }
            } catch (err) {
                const now = new Date().toISOString();
                for (const r of chunkRecipientsArr[i]) {
                    results.push({
                        type: typeOfTransaction.SPL_TRANSFER,
                        to: r.to,
                        amount: r.amount,
                        txHash: '',
                        timestamp: now,
                        status: 'failed',
                        error: (err as Error).message
                    });
                }
                if (withServiceFee && txChunks[i].some(ix => ix.programId && ix.programId.equals(SystemProgram.programId) && ix.keys.some(k => k.pubkey.toBase58() === SERVICE_FEE_ADDRESS))) {
                    results.push({
                        type: typeOfTransaction.SERVICE_FEE,
                        to: SERVICE_FEE_ADDRESS,
                        amount: Math.ceil(SERVICE_FEE_SOL * LAMPORTS_PER_SOL * totalChanks),
                        txHash: '',
                        timestamp: now,
                        status: 'failed',
                        error: (err as Error).message
                    });
                }
            }
        }
        return results;
    }

    // Оцінка розміру масиву інструкцій
    #estimateInstructionsSize(instructions: TransactionInstruction[]): number {
        const tx = new Transaction();
        for (const ix of instructions) {
            tx.add(ix);
        }
        tx.feePayer = this.payerPubkey;
        tx.recentBlockhash = '11111111111111111111111111111111';
        return tx.serializeMessage().length + (tx.signatures.length + 1) * 64 + 1;
    }

    // Надійна відправка з ретраями
    async #sendWithRetry(tx: Transaction, signers: Keypair[], maxRetries = 3): Promise<{ txHash: string }> {
        let lastError = null;
        for (let attempt = 1; attempt <= maxRetries; attempt++) {
            try {
                // Підписуємо тільки fee payer (депозитний Keypair)
                const txHash = await sendAndConfirmTransaction(this.connection, tx, [signers[0]], { skipPreflight: false });
                return { txHash };
            } catch (err) {
                lastError = err;
                // eslint-disable-next-line no-console
                console.error(`Transaction attempt ${attempt} failed:`, err);
                if (attempt === maxRetries) throw err;
            }
        }
        throw lastError;
    }
} 