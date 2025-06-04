import { useState, useEffect } from 'react';
import { DistributionFormData } from '../../types/distribution';
import { DepositBlock } from '../DepositBlock';

interface DepositStepProps {
    formData: DistributionFormData;
    onNext: () => void;
}

export default function DepositStep({ formData, onNext }: DepositStepProps) {
    const [isLoading, setIsLoading] = useState(false);

    const handleDeposit = async () => {
        setIsLoading(true);
        try {
            // TODO: Implement deposit logic
            onNext();
        } catch (error) {
            console.error('Error depositing:', error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="space-y-8">
            <h2 className="text-2xl font-bold text-gray-900">Deposit Funds</h2>

            <div className="bg-white border-2 border-gray-100 rounded-xl p-8">
                <DepositBlock
                    splTokenAddress={formData.tokenAddress}
                    depositAddress={formData.depositAddressId || ''}
                    solAmount={0}
                    splAmount={formData.recipients.reduce((sum, r) => sum + r.amount, 0)}
                    onDepositComplete={handleDeposit}
                />
            </div>
        </div>
    );
} 