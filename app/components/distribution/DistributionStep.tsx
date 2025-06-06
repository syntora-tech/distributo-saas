'use client';

import { useEffect, useState } from 'react';
import { useNetwork } from '../../hooks/useWallet';

interface DistributionStepProps {
    depositAddress: string;
    txSettings: { totalTransactions: number };
}

export default function DistributionStep({ depositAddress, txSettings }: DistributionStepProps) {
    const network = useNetwork();
    const [completedTxs, setCompletedTxs] = useState(0);
    const [txs, setTxs] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        let interval: NodeJS.Timeout;
        const fetchTxs = async () => {
            setLoading(true);
            setError(null);
            try {
                // API повертає distribution з transactions
                const res = await fetch(`/api/distribution/by-deposit?address=${depositAddress}&network=${network}`);
                if (!res.ok) throw new Error('Failed to fetch transactions');
                const data = await res.json();
                const filtered = data.transactions.filter((tx: any) => tx.status === 'COMPLETED' && tx.walletAddress && tx.walletAddress !== process.env.SERVICE_FEE_ADDRESS);
                setTxs(filtered);
                setCompletedTxs(filtered.length);
            } catch (e: any) {
                setError(e.message);
            } finally {
                setLoading(false);
            }
        };
        fetchTxs();
        interval = setInterval(fetchTxs, 10000);
        return () => clearInterval(interval);
    }, [depositAddress, network]);

    const progress = Math.min(100, Math.round((completedTxs / txSettings.totalTransactions) * 100));

    return (
        <div className="space-y-8">
            <div>
                <h2 className="text-lg font-semibold text-gray-900">Роздача в процесі</h2>
                <p className="text-gray-600 mt-2">
                    {loading ? 'Оновлення статусу...' : `Виконано ${completedTxs} з ${txSettings.totalTransactions} транзакцій`}
                </p>
                {error && <div className="text-red-500 text-sm mt-2">{error}</div>}
            </div>

            <div className="space-y-4">
                <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Прогрес</span>
                    <span className="text-sm font-medium text-gray-900">{progress}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                    <div
                        className={`h-3 rounded-full transition-all duration-500 ${progress === 100 ? 'bg-green-500 animate-pulse' : 'bg-blue-600'}`}
                        style={{ width: `${progress}%` }}
                    />
                </div>
            </div>

            <div className="bg-blue-50 rounded-lg p-4">
                <div className="flex items-center space-x-3">
                    <svg className="h-6 w-6 text-blue-400 animate-spin" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                    </svg>
                    <div>
                        <h3 className="text-sm font-medium text-blue-800">Моніторинг роздачі</h3>
                        <div className="mt-1 text-sm text-blue-700">
                            <p>Не закривайте цю сторінку, поки всі транзакції не будуть виконані.</p>
                        </div>
                    </div>
                </div>
                <div className="mt-4">
                    <div className="text-xs text-gray-500 mb-2">Останні транзакції:</div>
                    <ul className="max-h-40 overflow-y-auto divide-y divide-blue-100">
                        {txs.slice(-5).reverse().map((tx, i) => (
                            <li key={tx.hash + i} className="py-1 flex items-center space-x-2">
                                <span className="inline-block w-2 h-2 rounded-full bg-green-500" />
                                <span className="font-mono text-xs">{tx.walletAddress}</span>
                                <span className="text-xs text-gray-400">{Number(tx.amount).toLocaleString()} токенів</span>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
    );
} 