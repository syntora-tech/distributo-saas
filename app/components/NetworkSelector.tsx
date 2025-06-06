import { useSolanaNetwork } from "../context/SolanaNetworkContext";

export default function NetworkSelector() {
    const { network } = useSolanaNetwork();

    return (
        <span className="text-xs px-2 py-1 rounded bg-gray-100 text-gray-700 font-mono">
            {network.toUpperCase()}
        </span>
    );
} 