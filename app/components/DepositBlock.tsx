import { useEffect, useState } from 'react';
import { useWallet, useConnection } from '@solana/wallet-adapter-react';
import { PublicKey, Transaction, SystemProgram, LAMPORTS_PER_SOL } from '@solana/web3.js';
import { TOKEN_PROGRAM_ID, createTransferInstruction, getAssociatedTokenAddress, createAssociatedTokenAccountInstruction } from '@solana/spl-token';
import { QRCodeSVG } from 'qrcode.react';
import { Network } from '@/lib/blockchain/network';

interface DepositBlockProps {
    depositAddress: string;
    solAmount: number;
    splAmount: number;
    splTokenAddress: string;
    onDepositComplete: () => void;
}

export const DepositBlock = ({
    depositAddress,
    solAmount,
    splAmount,
    splTokenAddress,
    onDepositComplete,
}: DepositBlockProps) => {
    const [viewMode, setViewMode] = useState<'wallet' | 'qr'>('wallet');
    const [solBalance, setSolBalance] = useState<number>(0);
    const [splBalance, setSplBalance] = useState<number>(0);
    const { publicKey, sendTransaction } = useWallet();
    const { connection } = useConnection();

    useEffect(() => {
        const checkBalances = async () => {
            try {
                const network = connection.rpcEndpoint.includes('devnet') ? Network.SOLANA_DEVNET : Network.SOLANA_MAINNET;
                const response = await fetch(`/api/check-balances?address=${depositAddress}&network=${network}`);
                const data = await response.json();

                setSolBalance(data.sol);
                setSplBalance(data.spl[0]?.amount || 0);

                if (data.sol >= solAmount && (data.spl[0]?.amount || 0) >= splAmount) {
                    onDepositComplete();
                }
            } catch (error) {
                console.error('Error checking balances:', error);
            }
        };

        checkBalances();
        const interval = setInterval(checkBalances, 15000);
        return () => clearInterval(interval);
    }, [depositAddress, solAmount, splAmount, onDepositComplete, connection]);

    const handleSolDeposit = async () => {
        if (!publicKey || !sendTransaction) return;

        try {
            const transaction = new Transaction().add(
                SystemProgram.transfer({
                    fromPubkey: publicKey,
                    toPubkey: new PublicKey(depositAddress),
                    lamports: solAmount * LAMPORTS_PER_SOL,
                })
            );

            const signature = await sendTransaction(transaction, connection);
            console.log('SOL transfer signature:', signature);
        } catch (error) {
            console.error('Error sending SOL:', error);
        }
    };

    const handleSplDeposit = async () => {
        if (!publicKey || !sendTransaction) return;

        try {
            const mintPubkey = new PublicKey(splTokenAddress);
            const destinationPubkey = new PublicKey(depositAddress);

            // Отримуємо адреси токен-акаунтів
            const sourceTokenAccount = await getAssociatedTokenAddress(
                mintPubkey,
                publicKey
            );

            const destinationTokenAccount = await getAssociatedTokenAddress(
                mintPubkey,
                destinationPubkey
            );

            const transaction = new Transaction();

            // Перевіряємо чи існує токен-акаунт отримувача
            const destinationAccount = await connection.getAccountInfo(destinationTokenAccount);

            // Якщо токен-акаунт не існує, створюємо його
            if (!destinationAccount) {
                transaction.add(
                    createAssociatedTokenAccountInstruction(
                        publicKey, // payer
                        destinationTokenAccount, // ata
                        destinationPubkey, // owner
                        mintPubkey // mint
                    )
                );
            }

            // Додаємо інструкцію передачі токенів
            transaction.add(
                createTransferInstruction(
                    sourceTokenAccount, // source
                    destinationTokenAccount, // destination
                    publicKey, // owner
                    splAmount * Math.pow(10, 9) // amount
                )
            );

            const signature = await sendTransaction(transaction, connection);
            console.log('SPL transfer signature:', signature);
        } catch (error) {
            console.error('Error sending SPL tokens:', error);
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-center space-x-4">
                <button
                    onClick={() => setViewMode('wallet')}
                    className={`px-4 py-2 rounded-lg ${viewMode === 'wallet'
                        ? 'bg-blue-500 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                >
                    Wallet
                </button>
                <button
                    onClick={() => setViewMode('qr')}
                    className={`px-4 py-2 rounded-lg ${viewMode === 'qr'
                        ? 'bg-blue-500 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                >
                    QR Code
                </button>
            </div>

            {viewMode === 'wallet' ? (
                <div className="space-y-4">
                    <div className="p-4 border rounded">
                        <p className="font-semibold">Deposit Address:</p>
                        <p className="text-sm break-all">{depositAddress}</p>
                    </div>

                    <div className="bg-yellow-50 p-4 rounded">
                        <p className="text-yellow-800">
                            ⚠️ Please double-check the address before sending funds!
                        </p>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="p-4 border rounded">
                            <p className="font-semibold">Required SOL:</p>
                            <p>{solAmount} SOL</p>
                            {publicKey && (
                                <button
                                    onClick={handleSolDeposit}
                                    className="mt-2 w-full bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                                >
                                    Send SOL
                                </button>
                            )}
                        </div>

                        <div className="p-4 border rounded">
                            <p className="font-semibold">Required SPL Tokens:</p>
                            <p>{splAmount} tokens</p>
                            {publicKey && (
                                <button
                                    onClick={handleSplDeposit}
                                    className="mt-2 w-full bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                                >
                                    Send SPL
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            ) : (
                <div className="space-y-4">
                    <div className="flex justify-center">
                        <QRCodeSVG value={depositAddress} size={256} />
                    </div>

                    <div className="p-4 border rounded">
                        <p className="font-semibold">Deposit Address:</p>
                        <p className="text-sm break-all">{depositAddress}</p>
                    </div>

                    <div className="bg-yellow-50 p-4 rounded">
                        <p className="text-yellow-800">
                            ⚠️ Please double-check the address before sending funds!
                        </p>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="p-4 border rounded">
                            <p className="font-semibold">Required SOL:</p>
                            <p>{solAmount} SOL</p>
                        </div>

                        <div className="p-4 border rounded">
                            <p className="font-semibold">Required SPL Tokens:</p>
                            <p>{splAmount} tokens</p>
                        </div>
                    </div>
                </div>
            )}

            <div className="mt-4">
                <p className="text-sm text-gray-600">
                    Current Balance: {solBalance} SOL, {splBalance} SPL tokens
                </p>
            </div>
        </div>
    );
}; 