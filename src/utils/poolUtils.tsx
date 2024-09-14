import { useState } from 'react';
import { BN } from 'bn.js';
import { PublicKey } from '@solana/web3.js';
import { initSdk, txVersion } from '../raydium/config';
import { AMM_V4, OPEN_BOOK_PROGRAM, FEE_DESTINATION_ID } from '@raydium-io/raydium-sdk-v2';

export const useCreateAmmPool = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [txId, setTxId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const createAmmPool = async ({
    marketId,
    baseAmount,
    quoteAmount,
    useSOLBalance = false,
    walletPublicKey,
  }: {
    marketId: string;
    baseAmount: number;
    quoteAmount: number;
    useSOLBalance: boolean;
    walletPublicKey: PublicKey;
  }) => {
    setIsLoading(true);
    setError(null);

    try {
      const raydium = await initSdk(walletPublicKey);

      const marketPublicKey = new PublicKey(marketId);

      // Fetch market info from on-chain data (if needed for validation)
      const marketBufferInfo = await raydium.connection.getAccountInfo(marketPublicKey);
      if (!marketBufferInfo) {
        throw new Error('Failed to fetch market info');
      }

      // Directly use Raydium SDK to create the pool
      const { execute, extInfo } = await raydium.liquidity.createPoolV4({
        programId: AMM_V4,
        marketInfo: {
          marketId: marketPublicKey,
          programId: OPEN_BOOK_PROGRAM,
        },
        baseMintInfo: {
          mint: new PublicKey(marketId), // Replace with actual base mint
          decimals: 6, // Replace with actual decimals if known
        },
        quoteMintInfo: {
          mint: new PublicKey(marketId), // Replace with actual quote mint
          decimals: 6, // Replace with actual decimals if known
        },
        baseAmount: new BN(baseAmount),
        quoteAmount: new BN(quoteAmount),
        startTime: new BN(0), // Can be set if needed
        ownerInfo: {
          useSOLBalance,
        },
        associatedOnly: false,
        txVersion,
        feeDestinationId: FEE_DESTINATION_ID,
      });

      const { txId } = await execute({ sendAndConfirm: true });
      setTxId(txId);

      console.log('AMM pool created successfully! Transaction ID:', txId);
      console.log('Pool Keys:', Object.keys(extInfo.address).reduce((acc, cur) => ({
        ...acc,
        [cur]: extInfo.address[cur as keyof typeof extInfo.address].toBase58(),
      }), {}));

    } catch (err) {
      console.error('Error creating AMM pool:', err);
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setIsLoading(false);
    }
  };

  return { createAmmPool, isLoading, txId, error };
};
