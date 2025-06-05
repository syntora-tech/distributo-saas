import { Keypair, PublicKey } from '@solana/web3.js';
import * as bip39 from 'bip39';
import { derivePath } from 'ed25519-hd-key';

export interface DepositAddress {
    address: string;
    derivationPath: string;
    keypair: Keypair;
}

export function generateDepositAddress(
    mnemonic: string,
    userIndex: number,
    addressIndex: number
): DepositAddress {
    const derivationPath = `m/44'/501'/${userIndex}'/${addressIndex}'/0'`;
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