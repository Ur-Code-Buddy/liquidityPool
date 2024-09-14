import React from 'react';
import { useLocation } from 'react-router-dom';

const SuccessPage = () => {
    const location = useLocation();
    const { mintAddress, associatedTokenAddress } = location.state as {
        mintAddress: string;
        associatedTokenAddress: string;
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white p-8 space-y-6">
            <h1 className="text-4xl font-extrabold text-blue-400 mb-6">
                🎉 Token Minted Successfully!
            </h1>
            <div className="w-full max-w-lg bg-gray-800 p-6 rounded-lg shadow-lg space-y-4">
                <p className="text-xl font-semibold">Token mint created at:</p>
                <p className="text-lg font-mono text-blue-300 break-all">{mintAddress}</p>
                <p className="text-xl font-semibold">Associated Token Address:</p>
                <p className="text-lg font-mono text-blue-300 break-all">{associatedTokenAddress}</p>
                <div className="flex flex-col space-y-2">
                    <a
                        href={`https://explorer.solana.com/address/${mintAddress}?cluster=devnet`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg shadow-md transition duration-300"
                    >
                        View Mint Token on Solana Explorer
                    </a>
                    <a
                        href={`https://explorer.solana.com/address/${associatedTokenAddress}?cluster=devnet`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg shadow-md transition duration-300"
                    >
                        View Associated Token on Solana Explorer
                    </a>
                </div>
            </div>
        </div>
    );
};

export default SuccessPage;
