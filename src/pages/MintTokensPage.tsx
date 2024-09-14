import React, { useState } from 'react'; // Ensure React and useState are imported
import { Keypair, SystemProgram, Transaction } from '@solana/web3.js';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { 
    MINT_SIZE, TOKEN_2022_PROGRAM_ID, createMintToInstruction, 
    createAssociatedTokenAccountInstruction, createInitializeMintInstruction, 
    getAssociatedTokenAddressSync 
} from '@solana/spl-token';
import { useNavigate } from 'react-router-dom';

const MintTokensPage = () => {
    const { connection } = useConnection();
    const wallet = useWallet();
    const navigate = useNavigate();

    const [name, setName] = useState('');
    const [symbol, setSymbol] = useState('');
    const [imageUrl, setImageUrl] = useState('');
    const [initialSupply, setInitialSupply] = useState('');

    const handleMintToken = async () => {
        try {
            if (!wallet.publicKey) throw new Error('Wallet not connected');
            const mintKeypair = Keypair.generate();
            const associatedToken = getAssociatedTokenAddressSync(
                mintKeypair.publicKey,
                wallet.publicKey,
                false,
                TOKEN_2022_PROGRAM_ID,
            );

            const mintLen = MINT_SIZE;
            const lamports = await connection.getMinimumBalanceForRentExemption(mintLen);

            const transaction = new Transaction().add(
                SystemProgram.createAccount({
                    fromPubkey: wallet.publicKey,
                    newAccountPubkey: mintKeypair.publicKey,
                    space: mintLen,
                    lamports,
                    programId: TOKEN_2022_PROGRAM_ID,
                }),
                createInitializeMintInstruction(mintKeypair.publicKey, 9, wallet.publicKey, null, TOKEN_2022_PROGRAM_ID),
                createAssociatedTokenAccountInstruction(
                    wallet.publicKey,
                    associatedToken,
                    wallet.publicKey,
                    mintKeypair.publicKey,
                    TOKEN_2022_PROGRAM_ID,
                ),
                createMintToInstruction(mintKeypair.publicKey, associatedToken, wallet.publicKey, BigInt(initialSupply) * BigInt(10 ** 9), [], TOKEN_2022_PROGRAM_ID)
            );

            transaction.feePayer = wallet.publicKey;
            transaction.recentBlockhash = (await connection.getLatestBlockhash()).blockhash;
            transaction.partialSign(mintKeypair);

            await wallet.sendTransaction(transaction, connection);

            console.log(`Token mint created at ${mintKeypair.publicKey.toBase58()}`);
            console.log(`Associated Token Address: ${associatedToken.toBase58()}`);
            console.log("Minted!");

            // Redirect to success page with token mint and associated token addresses
            navigate('/success', {
                state: {
                    mintAddress: mintKeypair.publicKey.toBase58(),
                    associatedTokenAddress: associatedToken.toBase58()
                }
            });
        } catch (error) {
            console.error('Failed to mint token:', error);
            alert('Failed to mint token. Check the console for details.');
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white p-8 space-y-6">
            <button
                onClick={() => navigate('/home')}
                className="absolute top-4 left-4 px-4 py-2 bg-blue-500 text-white font-semibold rounded-lg shadow-md hover:bg-blue-600 transition"
            >
                Back to Home
            </button>
            <h1 className="text-3xl font-bold text-blue-400 mb-4">Mint a New Token</h1>
            <div className="w-full max-w-md space-y-4">
                <input
                    type="text"
                    placeholder="Token Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-4 py-2 rounded-lg bg-gray-800 border border-gray-700 text-white placeholder-gray-400"
                />
                <input
                    type="text"
                    placeholder="Token Symbol"
                    value={symbol}
                    onChange={(e) => setSymbol(e.target.value)}
                    className="w-full px-4 py-2 rounded-lg bg-gray-800 border border-gray-700 text-white placeholder-gray-400"
                />
                <input
                    type="text"
                    placeholder="Image URL"
                    value={imageUrl}
                    onChange={(e) => setImageUrl(e.target.value)}
                    className="w-full px-4 py-2 rounded-lg bg-gray-800 border border-gray-700 text-white placeholder-gray-400"
                />
                <input
                    type="number"
                    placeholder="Initial Supply"
                    value={initialSupply}
                    onChange={(e) => setInitialSupply(e.target.value)}
                    className="w-full px-4 py-2 rounded-lg bg-gray-800 border border-gray-700 text-white placeholder-gray-400"
                />
                <button
                    onClick={handleMintToken}
                    className="w-full px-4 py-2 bg-blue-500 text-white font-semibold rounded-lg shadow-md hover:bg-blue-600 transition"
                >
                    Create Token
                </button>
            </div>
        </div>
    );
};

export default MintTokensPage;
