import { Keypair, PublicKey } from '@solana/web3.js';
import * as bip39 from 'bip39';
import { derivePath } from 'ed25519-hd-key';
import { createHash } from 'crypto';

export interface DepositAddress {
    address: string;
    derivationPath: string;
    keypair: Keypair;
}

function getUserIdIndex(userId: string): number {
    // Надійно отримуємо hardened індекс з UUID/userId через sha256
    const hash = createHash('sha256').update(userId).digest();
    // uint32, обмеження до 2^31-1 (hardened BIP32)
    return hash.readUInt32BE(0) & 0x7FFFFFFF;
}

export function generateDepositAddress(
    mnemonic: string,
    userId: string,
    index: number
): DepositAddress {
    const userIdIndex = getUserIdIndex(userId);
    const derivationPath = `m/44'/501'/${userIdIndex}'/${index}'/0'`;
    const seed = bip39.mnemonicToSeedSync(mnemonic);
    const { key } = derivePath(derivationPath, seed.toString('hex'));
    const keypair = Keypair.fromSeed(key);
    return {
        address: keypair.publicKey.toString(),
        derivationPath,
        keypair
    };
}

export function validateDepositAddress(address: string): boolean {
    try {
        new PublicKey(address);
        return true;
    } catch {
        return false;
    }
} 