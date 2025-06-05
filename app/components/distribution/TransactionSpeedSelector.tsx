import { useState, useEffect } from 'react';
import { TransactionSpeed } from '@/types/distribution';
import { NETWORK_TOKENS } from '@/lib/blockchain/config';

export interface CalculationData {
    totalTransactions: number;
    speed: TransactionSpeed;
    fees: {
        networkFee: string;
        serviceFee: string;
        total: string;
    };
    estimatedTime: string;
}

interface TransactionSpeedSelectorProps {
    recipients: { address: string; amount: number }[];
    onTxSettingsChange: (data: CalculationData) => void;
    initialSpeed: TransactionSpeed;
    networkToken?: keyof typeof NETWORK_TOKENS;
}

export function TransactionSpeedSelector({
    recipients,
    onTxSettingsChange,
    initialSpeed,
    networkToken = 'SOL'
}: TransactionSpeedSelectorProps) {
    const [selectedSpeed, setSelectedSpeed] = useState<TransactionSpeed>(initialSpeed);
    const [calculation, setCalculation] = useState<CalculationData | null>(null);

    const calculateFees = async (speed: TransactionSpeed) => {
        try {
            const response = await fetch('/api/distribution/calculate', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    recipients: recipients.map(r => ({
                        ...r,
                        amount: r.amount.toString()
                    })),
                    speed,
                }),
            });

            if (!response.ok) {
                throw new Error('Failed to calculate fees');
            }

            const data = await response.json();
            setCalculation({
                ...data,
                speed
            });
        } catch (error) {
            console.error('Error calculating fees:', error);
        }
    };

    const handleTxSettingsChange = async (speed: TransactionSpeed) => {
        setSelectedSpeed(speed);
        await calculateFees(speed);
    };

    useEffect(() => {
        if (calculation) {
            onTxSettingsChange(calculation);
        }
    }, [calculation]);

    useEffect(() => {
        calculateFees(selectedSpeed);
    }, []);

    const tokenSymbol = NETWORK_TOKENS[networkToken].symbol;

    return (
        <div className="space-y-4">
            <div className="flex gap-4">
                {Object.values(TransactionSpeed).map((speed) => (
                    <button
                        key={speed}
                        onClick={() => handleTxSettingsChange(speed)}
                        className={`px-4 py-2 rounded-lg border ${selectedSpeed === speed
                            ? 'bg-blue-500 text-white border-blue-500'
                            : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                            }`}
                    >
                        {speed.charAt(0).toUpperCase() + speed.slice(1)}
                    </button>
                ))}
            </div>

            {calculation && (
                <div className="bg-gray-50 p-4 rounded-lg space-y-2">
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <p className="text-sm text-gray-500">Total Transactions</p>
                            <p className="text-lg font-semibold">{calculation.totalTransactions}</p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">Estimated Time</p>
                            <p className="text-lg font-semibold">{calculation.estimatedTime} minutes</p>
                        </div>
                    </div>
                    <div className="border-t pt-2 mt-2">
                        <p className="text-sm text-gray-500 mb-2">Fee Breakdown</p>
                        <div className="space-y-1">
                            <div className="flex justify-between">
                                <span>Network Fee</span>
                                <span>{calculation.fees.networkFee} {tokenSymbol}</span>
                            </div>
                            <div className="flex justify-between">
                                <span>Service Fee</span>
                                <span>{calculation.fees.serviceFee} {tokenSymbol}</span>
                            </div>
                            <div className="flex justify-between font-semibold border-t pt-1">
                                <span>Total Fee</span>
                                <span>{calculation.fees.total} {tokenSymbol}</span>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
} 