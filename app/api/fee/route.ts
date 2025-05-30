import { NextRequest } from 'next/server';
import { getConnection, Network, isValidNetwork } from '@/lib/blockchain/network';
import { getNetworkFees } from '@/lib/blockchain/fee';

export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url);
    const network = (searchParams.get('network') as Network) || Network.SOLANA_MAINNET;

    if (!isValidNetwork(network)) {
        return new Response(JSON.stringify({ error: 'Invalid network' }), { status: 400 });
    }

    try {
        const connection = getConnection(network);
        const fees = await getNetworkFees(connection, network);
        return new Response(JSON.stringify(fees), { status: 200 });
    } catch (error) {
        return new Response(JSON.stringify({ error: 'Failed to get fees' }), { status: 500 });
    }
} 