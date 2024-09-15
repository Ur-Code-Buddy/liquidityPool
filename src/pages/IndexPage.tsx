import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { useWallet } from '@solana/wallet-adapter-react';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const IndexPage = () => {
    const { connected } = useWallet();
    const navigate = useNavigate();
    const [showPopup, setShowPopup] = useState(false);
    
    useEffect(() => {
        if (connected) {
            navigate('/home'); // Redirect to HomePage when connected
        }
    }, [connected, navigate]);

    const handleCreateWalletClick = () => {
        setShowPopup(true);
    };

    const handleClosePopup = () => {
        setShowPopup(false);
    };

    return (
        <div className="relative flex flex-col items-center justify-center min-h-screen bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 p-8 overflow-hidden">
            <div className="relative w-full max-w-md p-8 bg-opacity-90 bg-gray-900 rounded-lg shadow-xl z-10">
                <h1 className="text-4xl font-bold text-white mb-4">Welcome to the Raydium Launchpad</h1>
                <p className="text-lg text-gray-300 mb-6">
                    Connect your wallet to get started. For a seamless experience, ensure you have a DApp connected like Backpack or Phantom.
                </p>
                <WalletMultiButton className="w-full py-3 bg-blue-500 text-white font-semibold rounded-lg shadow-md hover:bg-blue-600 transition z-20" />
                {!connected && (
                    <button
                        onClick={handleCreateWalletClick}
                        className="block mt-4 px-4 py-2 text-center bg-green-500 text-white font-semibold rounded-lg shadow-md hover:bg-green-600 transition z-20 text-sm"
                    >
                        Create a Wallet
                    </button>
                )}
            </div>
            <div className="absolute inset-0 z-0">
                <svg className="absolute -bottom-10 -left-10 w-1/2 h-auto" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="100" cy="100" r="100" fill="rgba(255, 255, 255, 0.15)" />
                </svg>
                <svg className="absolute top-0 right-0 w-1/2 h-auto" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="100" cy="100" r="100" fill="rgba(255, 255, 255, 0.15)" />
                </svg>
            </div>
            {showPopup && (
                <div className="fixed inset-0 flex items-center justify-center z-30">
                    <div className="relative w-80 p-6 bg-gray-900 rounded-lg shadow-lg">
                        <button 
                            onClick={handleClosePopup} 
                            className="absolute top-2 right-2 text-white hover:text-gray-400"
                        >
                            &times;
                        </button>
                        <h2 className="text-xl font-bold text-white mb-4">Create a Wallet</h2>
                        <p className="text-gray-300 mb-4">
                            To use the Raydium Launchpad, you need a Solana wallet like Backpack or Phantom. 
                            If you just want to create a wallet and have fun, use the link below:
                        </p>
                        <div className="flex gap-4 mt-4">
                            <button 
                                onClick={handleClosePopup}
                                className="w-full py-2 px-4 bg-gray-500 text-white font-semibold rounded-lg shadow-md hover:bg-gray-600 transition"
                            >
                                Cancel
                            </button>
                            <a 
                                href="https://solanawallet.baivabprojects.site/" 
                                className="w-full py-2 px-4 bg-blue-500 text-white font-semibold rounded-lg shadow-md hover:bg-blue-600 transition"
                                target="_blank" 
                                rel="noopener noreferrer"
                            >
                                Create a Wallet
                            </a>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default IndexPage;
