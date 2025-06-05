import { useState, useEffect } from 'react';
import { DistributionFormData } from '@/app/types/distribution';
import useSWR from 'swr';

interface Recipient {
    address: string;
    amount: number;
}

interface Distribution {
    tokenAddress: string;
    tokenName: string;
    depositAddress: string;
}

const fetcher = async (url: string) => {
    const response = await fetch(url);
    if (!response.ok) {
        throw new Error('Failed to fetch distribution data');
    }
    return response.json();
};

export function useDistribution(storageKey?: string) {
    const [distribution, setDistribution] = useState<Distribution | null>(null);
    const [recipients, setRecipients] = useState<Recipient[]>([]);

    // Якщо ключ не передано, шукаємо перший доступний
    const key = storageKey || Object.keys(localStorage).find(key => key.startsWith('distribution_'));

    const { data, error, isLoading } = useSWR(
        key ? `/api/distribution/${key.split('_')[1]}` : null,
        fetcher
    );

    useEffect(() => {
        if (key) {
            const savedData = localStorage.getItem(key);
            if (savedData) {
                const { formData } = JSON.parse(savedData);
                setDistribution({
                    tokenAddress: formData.tokenAddress,
                    tokenName: formData.tokenName || 'Unknown Token',
                    depositAddress: formData.depositAddress || ''
                });
                setRecipients(formData.recipients);
            }
        }
    }, [key]);

    return {
        distribution,
        recipients,
        setDistribution,
        setRecipients,
        isLoading,
        error,
        serverData: data
    };
} 