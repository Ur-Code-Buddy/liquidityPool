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
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
            <h1 className="text-3xl font-bold text-blue-600 mb-4">Welcome to the Raydium Launchpad</h1>
            <p className="text-lg text-gray-700 mb-6">Connect your wallet to get started.</p>
            <WalletMultiButton className="bg-blue-500 text-white py-2 px-4 rounded-lg shadow-md hover:bg-blue-600 transition" />
        </div>
    );
};

export default IndexPage;
