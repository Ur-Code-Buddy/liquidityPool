import { Link, useNavigate } from 'react-router-dom';
import { useWallet } from '@solana/wallet-adapter-react';

const HomePage = () => {
    const navigate = useNavigate(); // Hook for navigation
    const { disconnect } = useWallet(); // Hook for wallet actions

    const handleDisconnectAndNavigate = async () => {
        try {
            await disconnect(); // Disconnect the wallet
            navigate('/'); // Navigate to the home page
        } catch (error) {
            console.error('Failed to disconnect:', error);
        }
    };

    return (
        <div className="relative flex flex-col items-start justify-center min-h-screen bg-gray-900 text-white p-8 space-y-6">
            <button
                onClick={handleDisconnectAndNavigate}
                className="absolute top-4 left-4 px-4 py-2 bg-blue-500 text-white font-semibold rounded-lg shadow-md hover:bg-blue-600 transition"
            >
                Disconnect & Back
            </button>
            <a 
                href="https://github.com/raydium-io/raydium-sdk-V2-demo/blob/master/src/amm/createAmmPool.ts" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="absolute top-4 right-4 px-3 py-1 bg-blue-500 text-white font-semibold rounded-lg shadow-md hover:bg-blue-600 transition text-xs"
            >
                Raydium Demo Code
            </a>
            <h2 className="text-4xl font-bold text-blue-400 mb-4">Home</h2>
            <div className="w-full max-w-md space-y-4">
                <Link 
                    to="/mint-tokens" 
                    className="block text-lg font-semibold text-blue-300 hover:text-blue-500 transition px-6 py-2 rounded-lg bg-gray-800 shadow-md hover:bg-gray-700"
                >
                    Mint Tokens
                </Link>
                <p className="text-gray-400 mb-4">Create and mint new tokens on the Solana blockchain.</p>

                <Link 
                    to="/create-pool" 
                    className="block text-lg font-semibold text-blue-300 hover:text-blue-500 transition px-6 py-2 rounded-lg bg-gray-800 shadow-md hover:bg-gray-700"
                >
                    Create Pool
                </Link>
                <p className="text-gray-400 mb-4">Create a new AMM liquidity pool on Solana.</p>
                
                <Link 
                    to="/transaction-status" 
                    className="block text-lg font-semibold text-blue-300 hover:text-blue-500 transition px-6 py-2 rounded-lg bg-gray-800 shadow-md hover:bg-gray-700"
                >
                    Transaction Status
                </Link>
                <p className="text-gray-400 mb-4">Check the status of your recent transactions.</p>
            </div>
        </div>
    );
};

export default HomePage;
