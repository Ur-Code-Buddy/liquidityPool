import { AMM_V4, AMM_STABLE, DEVNET_PROGRAM_ID } from '@raydium-io/raydium-sdk-v2';

const VALID_PROGRAM_IDS = new Set([
  AMM_V4.toBase58(),
  AMM_STABLE.toBase58(),
  DEVNET_PROGRAM_ID.AmmV4.toBase58(),
  DEVNET_PROGRAM_ID.AmmStable.toBase58(),
]);

// Check if a given AMM pool is valid based on its program ID
export const isValidAmm = (id: string): boolean => VALID_PROGRAM_IDS.has(id);
