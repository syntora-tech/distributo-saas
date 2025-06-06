import { useState } from 'react';
import { DistributionFormData, Recipient } from '../../types/distribution';
import { DepositBlock } from '../DepositBlock';
import { useDistribution } from '@/hooks/useDistribution';
import { CalculationData } from './TransactionSpeedSelector';

interface DepositStepProps {
    formData: DistributionFormData;
    onNext: () => void;
    txSettings: CalculationData | null;
}

export default function DepositStep({ formData, onNext, txSettings }: DepositStepProps) {
    const { distribution } = useDistribution();
    const [isReadyToProceed, setIsReadyToProceed] = useState(false);


    if (!distribution) return null;

    const totalSplAmount = formData.recipients.reduce((sum: number, r: Recipient) => sum + r.amount, 0);

    return (
        <div className="space-y-8">
            <h2 className="text-2xl font-bold text-gray-900">Deposit Funds</h2>

            <div className="bg-white border-2 border-gray-100 rounded-xl p-8">
                <DepositBlock
                    splTokenAddress={formData.tokenAddress}
                    depositAddress={distribution.depositAddress}
                    solAmount={txSettings?.fees.total ? parseFloat(txSettings.fees.total) : 0}
                    splAmount={totalSplAmount}
                    onReadyToProceed={setIsReadyToProceed}
                />
            </div>
        </div>
    );
} 