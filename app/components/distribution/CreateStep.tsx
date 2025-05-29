'use client';

import { DistributionFormData } from '../../types/distribution';
import Input from '../Input';

interface CreateStepProps {
    formData: DistributionFormData;
    onChange: (data: Partial<DistributionFormData>) => void;
}

export default function CreateStep({ formData, onChange }: CreateStepProps) {
    return (
        <div className="space-y-8">
            <h2 className="text-2xl font-bold text-gray-900">Create Distribution</h2>
            <div className="space-y-6">
                <Input
                    label="Token Address"
                    value={formData.tokenAddress}
                    onChange={(e) => onChange({ tokenAddress: e.target.value })}
                    placeholder="0x..."
                    required
                />
                <Input
                    label="Token Name"
                    value={formData.tokenName}
                    onChange={(e) => onChange({ tokenName: e.target.value })}
                    placeholder="Enter token name"
                    required
                />
                <Input
                    label="Funding Amount"
                    type="number"
                    value={formData.fundingAmount}
                    onChange={(e) => onChange({ fundingAmount: parseFloat(e.target.value) })}
                    placeholder="Enter funding amount"
                    required
                />
            </div>
        </div>
    );
} 