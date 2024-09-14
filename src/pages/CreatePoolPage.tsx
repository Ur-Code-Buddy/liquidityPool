import React, { useState } from 'react';
import { PublicKey } from '@solana/web3.js';
import BN from 'bn.js';
import { createAmmPool } from '../raydium/createPool'; // Adjust path as needed

const CreatePoolPage: React.FC = () => {
  const [marketId, setMarketId] = useState<string>('');
  const [baseMint, setBaseMint] = useState<string>('');
  const [quoteMint, setQuoteMint] = useState<string>('');
  const [baseAmount, setBaseAmount] = useState<string>('');
  const [quoteAmount, setQuoteAmount] = useState<string>('');
  const [startTime, setStartTime] = useState<string>('0');
  const [useSOLBalance, setUseSOLBalance] = useState<boolean>(true);
  const [status, setStatus] = useState<string>('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // Convert inputs to appropriate types
      const marketPublicKey = new PublicKey(marketId);
      const baseMintPublicKey = new PublicKey(baseMint);
      const quoteMintPublicKey = new PublicKey(quoteMint);
      const baseAmountBN = new BN(baseAmount);
      const quoteAmountBN = new BN(quoteAmount);
      const startTimeBN = new BN(startTime);

      // Call the createAmmPool function with parameters
      await createAmmPool({
        marketId: marketPublicKey,
        baseMintInfo: {
          mint: baseMintPublicKey,
          decimals: 6 // Example; adjust if known
        },
        quoteMintInfo: {
          mint: quoteMintPublicKey,
          decimals: 6 // Example; adjust if known
        },
        baseAmount: baseAmountBN,
        quoteAmount: quoteAmountBN,
        startTime: startTimeBN,
        ownerInfo: {
          useSOLBalance
        }
      });
      setStatus('Pool creation successful!');
    } catch (error) {
      console.error('Error creating pool:', error);
      setStatus('Error creating pool. Check the console for details.');
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white p-4">
      <h1 className="text-3xl font-bold text-blue-400 mb-6">Create AMM Pool</h1>
      <form onSubmit={handleSubmit} className="w-full max-w-md bg-gray-800 shadow-md rounded-lg p-6 space-y-4">
        <div>
          <label htmlFor="marketId" className="block text-gray-300">Market ID:</label>
          <input
            type="text"
            id="marketId"
            value={marketId}
            onChange={(e) => setMarketId(e.target.value)}
            placeholder="Enter market ID"
            className="w-full px-3 py-2 border border-gray-600 rounded-md bg-gray-700 text-white"
            required
          />
        </div>
        <div>
          <label htmlFor="baseMint" className="block text-gray-300">Base Mint Address:</label>
          <input
            type="text"
            id="baseMint"
            value={baseMint}
            onChange={(e) => setBaseMint(e.target.value)}
            placeholder="Enter base mint address"
            className="w-full px-3 py-2 border border-gray-600 rounded-md bg-gray-700 text-white"
            required
          />
        </div>
        <div>
          <label htmlFor="quoteMint" className="block text-gray-300">Quote Mint Address:</label>
          <input
            type="text"
            id="quoteMint"
            value={quoteMint}
            onChange={(e) => setQuoteMint(e.target.value)}
            placeholder="Enter quote mint address"
            className="w-full px-3 py-2 border border-gray-600 rounded-md bg-gray-700 text-white"
            required
          />
        </div>
        <div>
          <label htmlFor="baseAmount" className="block text-gray-300">Base Amount:</label>
          <input
            type="number"
            id="baseAmount"
            value={baseAmount}
            onChange={(e) => setBaseAmount(e.target.value)}
            placeholder="Enter base amount"
            className="w-full px-3 py-2 border border-gray-600 rounded-md bg-gray-700 text-white"
            required
          />
        </div>
        <div>
          <label htmlFor="quoteAmount" className="block text-gray-300">Quote Amount:</label>
          <input
            type="number"
            id="quoteAmount"
            value={quoteAmount}
            onChange={(e) => setQuoteAmount(e.target.value)}
            placeholder="Enter quote amount"
            className="w-full px-3 py-2 border border-gray-600 rounded-md bg-gray-700 text-white"
            required
          />
        </div>
        <div>
          <label htmlFor="startTime" className="block text-gray-300">Start Time (in seconds):</label>
          <input
            type="number"
            id="startTime"
            value={startTime}
            onChange={(e) => setStartTime(e.target.value)}
            placeholder="Enter start time"
            className="w-full px-3 py-2 border border-gray-600 rounded-md bg-gray-700 text-white"
          />
        </div>
        <div>
          <label htmlFor="useSOLBalance" className="inline-flex items-center text-gray-300">
            <input
              type="checkbox"
              id="useSOLBalance"
              checked={useSOLBalance}
              onChange={(e) => setUseSOLBalance(e.target.checked)}
              className="form-checkbox text-blue-500"
            />
            <span className="ml-2">Use SOL Balance for Fees</span>
          </label>
        </div>
        <button 
          type="submit" 
          className="w-full py-2 px-4 bg-blue-500 text-white font-semibold rounded-lg shadow-md hover:bg-blue-600 transition"
        >
          Create Pool
        </button>
      </form>
      {status && (
        <div className="mt-4 text-center">
          <p className={`text-lg ${status.includes('successful') ? 'text-green-400' : 'text-red-400'}`}>
            {status}
          </p>
        </div>
      )}
    </div>
  );
};

export default CreatePoolPage;
