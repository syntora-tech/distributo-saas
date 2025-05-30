import { sign } from 'tweetnacl';
import bs58 from 'bs58';

export interface SignedMessage {
    message: string;
    signature: string;
    publicKey: string;
}

export function createDistributionMessage(tokenAddress: string, tokenName: string): string {
    const timestamp = new Date().toISOString();
    return `Create distribution for token ${tokenName} (${tokenAddress}) at ${timestamp}`;
}

export function verifySignature(message: string, signature: string, publicKey: string): boolean {
    try {
        const messageBytes = new TextEncoder().encode(message);
        const signatureBytes = bs58.decode(signature);
        const publicKeyBytes = bs58.decode(publicKey);

        return sign.detached.verify(messageBytes, signatureBytes, publicKeyBytes);
    } catch (error) {
        console.error('Signature verification failed:', error);
        return false;
    }
} 