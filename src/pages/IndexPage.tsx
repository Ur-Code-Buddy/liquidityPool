import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { useWallet } from '@solana/wallet-adapter-react';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const IndexPage = () => {
    const { connected } = useWallet();
    const navigate = useNavigate();
    
    useEffect(() => {
        if (connected) {
            navigate('/home'); // Redirect to HomePage when connected
        }
    }, [connected, navigate]);

    return (
        <div className="relative flex flex-col items-center justify-center min-h-screen bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 p-8 overflow-hidden">
            <div className="relative w-full max-w-md p-8 bg-opacity-90 bg-gray-900 rounded-lg shadow-xl z-10">
                <h1 className="text-4xl font-bold text-white mb-4">Welcome to the Raydium Launchpad</h1>
                <p className="text-lg text-gray-300 mb-6">Connect your wallet to get started.</p>
                <WalletMultiButton className="w-full py-3 bg-blue-500 text-white font-semibold rounded-lg shadow-md hover:bg-blue-600 transition z-20" />
            </div>
            <div className="absolute inset-0 z-0">
                <svg className="absolute -bottom-10 -left-10 w-1/2 h-auto" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="100" cy="100" r="100" fill="rgba(255, 255, 255, 0.15)" />
                </svg>
                <svg className="absolute top-0 right-0 w-1/2 h-auto" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="100" cy="100" r="100" fill="rgba(255, 255, 255, 0.15)" />
                </svg>
            </div>
        </div>
    );
};

export default IndexPage;
