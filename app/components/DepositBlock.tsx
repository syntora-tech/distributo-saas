import { useEffect, useState } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { PublicKey, Transaction, SystemProgram, LAMPORTS_PER_SOL, Connection } from '@solana/web3.js';
import { TOKEN_PROGRAM_ID, createTransferInstruction } from '@solana/spl-token';
import { QRCodeSVG } from 'qrcode.react';

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
    const connection = new Connection(process.env.NEXT_PUBLIC_SOLANA_RPC_URL || 'https://api.mainnet-beta.solana.com');

    useEffect(() => {
        const checkBalances = async () => {
            try {
                const response = await fetch(`/api/check-balances?address=${depositAddress}`);
                const data = await response.json();

                setSolBalance(data.solBalance);
                setSplBalance(data.splBalance);

                if (data.solBalance >= solAmount && data.splBalance >= splAmount) {
                    onDepositComplete();
                }
            } catch (error) {
                console.error('Error checking balances:', error);
            }
        };

        const interval = setInterval(checkBalances, 15000);
        return () => clearInterval(interval);
    }, [depositAddress, solAmount, splAmount, onDepositComplete]);

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
            const transaction = new Transaction().add(
                createTransferInstruction(
                    new PublicKey(splTokenAddress), // source token account
                    new PublicKey(depositAddress), // destination token account
                    publicKey, // owner of source account
                    splAmount * Math.pow(10, 9), // amount (assuming 9 decimals)
                    [], // multisig signers
                    TOKEN_PROGRAM_ID
                )
            );

            const signature = await sendTransaction(transaction, connection);
            console.log('SPL transfer signature:', signature);
        } catch (error) {
            console.error('Error sending SPL tokens:', error);
        }
    };

    return (
        <div className="p-6 bg-white rounded-lg shadow-lg">
            <div className="flex justify-between mb-4">
                <h2 className="text-2xl font-bold">Deposit Funds</h2>
                <div className="space-x-2">
                    <button
                        onClick={() => setViewMode('wallet')}
                        className={`px-4 py-2 rounded ${viewMode === 'wallet' ? 'bg-blue-500 text-white' : 'bg-gray-200'
                            }`}
                    >
                        Wallet
                    </button>
                    <button
                        onClick={() => setViewMode('qr')}
                        className={`px-4 py-2 rounded ${viewMode === 'qr' ? 'bg-blue-500 text-white' : 'bg-gray-200'
                            }`}
                    >
                        QR Code
                    </button>
                </div>
            </div>

            {viewMode === 'wallet' ? (
                <div className="space-y-4">
                    <div className="p-4 border rounded">
                        <p className="font-semibold">Deposit Address:</p>
                        <p className="text-sm break-all">{depositAddress}</p>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="p-4 border rounded">
                            <p className="font-semibold">SOL Amount:</p>
                            <p>{solAmount} SOL</p>
                            <button
                                onClick={handleSolDeposit}
                                className="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                                disabled={!publicKey}
                            >
                                Deposit SOL
                            </button>
                        </div>

                        <div className="p-4 border rounded">
                            <p className="font-semibold">SPL Token Amount:</p>
                            <p>{splAmount} tokens</p>
                            <button
                                onClick={handleSplDeposit}
                                className="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                                disabled={!publicKey}
                            >
                                Deposit SPL
                            </button>
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