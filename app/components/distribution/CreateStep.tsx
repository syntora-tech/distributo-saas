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

            <div className="bg-white border-2 border-gray-100 rounded-xl p-8">
                <div className="grid grid-cols-2 gap-6">
                    <Input
                        label="Token Address"
                        value={formData.tokenAddress}
                        onChange={e => onChange({ tokenAddress: e.target.value })}
                        placeholder="0x..."
                    />
                    <Input
                        label="Token Name"
                        value={formData.tokenName}
                        onChange={e => onChange({ tokenName: e.target.value })}
                        placeholder="Token Name"
                    />
                </div>
            </div>
        </div>
    );
} 