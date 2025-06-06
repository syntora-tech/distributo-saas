'use client';

import { DistributionFormData } from '../../types/distribution';
import Table from '../Table';
import { useEffect, useState } from 'react';
import { useDistribution } from '@/hooks/useDistribution';
import { TransactionSpeedSelector } from './TransactionSpeedSelector';
import { TransactionSpeed } from '@/types/distribution';
import { NETWORK_TOKENS } from '@/lib/blockchain/config';
import { CalculationData } from './TransactionSpeedSelector';

interface ReviewStepProps {
    formData: DistributionFormData;
    txSettings: CalculationData | null;
    onTxSettingsChange?: (data: CalculationData) => void;
}

export default function ReviewStep({
    formData,
    txSettings,
    onTxSettingsChange,
}: ReviewStepProps) {
    const { distribution, recipients } = useDistribution();

    const totalAmount = formData.recipients.reduce((sum, r) => sum + r.amount, 0);

    if (!distribution || !recipients?.length) return null;
    return (
        <div className="space-y-4">
            <div className="grid gap-4">
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <p className="text-sm text-gray-500 mb-1">Token Address</p>
                        <p className="font-mono text-sm text-gray-900">{distribution.tokenAddress}</p>
                    </div>
                    <div>
                        <p className="text-sm text-gray-500 mb-1">Distribution Name</p>
                        <p className="font-mono text-sm text-gray-900">{distribution.tokenName}</p>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <p className="text-sm text-gray-500 mb-1">Total Recipients</p>
                        <p className="text-2xl font-bold text-gray-900">{recipients.length}</p>
                    </div>
                    <div>
                        <p className="text-sm text-gray-500 mb-1">Total Amount</p>
                        <p className="text-2xl font-bold text-gray-900">{totalAmount}</p>
                    </div>
                </div>

                <div className="mt-4">
                    <p className="text-sm text-gray-500 mb-2">Transaction Speed</p>
                    <TransactionSpeedSelector
                        recipients={formData.recipients}
                        onTxSettingsChange={onTxSettingsChange || (() => { })}
                        initialSpeed={txSettings?.speed || TransactionSpeed.MEDIUM}
                    />
                </div>

                <div className="mt-4">
                    <p className="text-sm text-gray-500 mb-2">Recipients</p>
                    <Table
                        headers={['Address', 'Amount']}
                        data={recipients}
                        columnWidths={[8, 4]}
                        renderRow={(recipient, index) => (
                            <div key={index} className="grid grid-cols-12 gap-4 p-4 items-center hover:bg-gray-50">
                                <div className="col-span-8 font-mono text-sm text-gray-900">{recipient.address}</div>
                                <div className="col-span-4 text-sm text-gray-900">{recipient.amount}</div>
                            </div>
                        )}
                    />
                </div>
            </div>
        </div>
    );
} 