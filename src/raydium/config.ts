import { Raydium, TxVersion, parseTokenAccountResp } from '@raydium-io/raydium-sdk-v2';
import { Connection, Keypair, clusterApiUrl } from '@solana/web3.js';
import { TOKEN_PROGRAM_ID, TOKEN_2022_PROGRAM_ID } from '@solana/spl-token';
import bs58 from 'bs58';


// Replace with your wallet secret key
export const owner: Keypair = Keypair.fromSecretKey(bs58.decode('kABkm2pQGjN3Cto8m13Na8PXzT6GArEfZ4GS1dZsiqYav8gGMNRaYYRZPveR6acBTyrdf49jDNT1fEj8FNS95Sh'));

// Use Devnet RPC URL
export const connection = new Connection(clusterApiUrl('devnet'));

export const txVersion = TxVersion.V0; // or TxVersion.LEGACY
const cluster = 'devnet'; // Set cluster to 'devnet'

let raydium: Raydium | undefined;

export const initSdk = async (params?: { loadToken?: boolean }) => {
  if (raydium) return raydium;
  
  console.log(`Connecting to RPC ${connection.rpcEndpoint} in ${cluster}`);
  
  raydium = await Raydium.load({
    owner,
    connection,
    cluster,
    disableFeatureCheck: true,
    disableLoadToken: !params?.loadToken,
    blockhashCommitment: 'finalized',
    // urlConfigs: {
    //   BASE_HOST: '<API_HOST>', // api url configs, currently api doesn't support devnet
    // },
  });

  /**
   * By default: sdk will automatically fetch token account data when needed or any sol balance changed.
   * If you want to handle token accounts by yourself, set token account data after init sdk.
   * Note: after calling raydium.account.updateTokenAccount, raydium will not automatically fetch token account.
   */
  /*
  raydium.account.updateTokenAccount(await fetchTokenAccountData());
  connection.onAccountChange(owner.publicKey, async () => {
    raydium!.account.updateTokenAccount(await fetchTokenAccountData());
  });
  */

  return raydium;
}

export const fetchTokenAccountData = async () => {
  const solAccountResp = await connection.getAccountInfo(owner.publicKey);
  const tokenAccountResp = await connection.getTokenAccountsByOwner(owner.publicKey, { programId: TOKEN_PROGRAM_ID });
  const token2022Req = await connection.getTokenAccountsByOwner(owner.publicKey, { programId: TOKEN_2022_PROGRAM_ID });
  
  const tokenAccountData = parseTokenAccountResp({
    owner: owner.publicKey,
    solAccountResp,
    tokenAccountResp: {
      context: tokenAccountResp.context,
      value: [...tokenAccountResp.value, ...token2022Req.value],
    },
  });
  
  return tokenAccountData;
}
