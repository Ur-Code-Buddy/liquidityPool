import { FC, useMemo } from 'react';
import { WalletProvider, ConnectionProvider } from '@solana/wallet-adapter-react';
import { WalletModalProvider, WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { PhantomWalletAdapter, SolflareWalletAdapter } from '@solana/wallet-adapter-wallets'; // Updated import
import { clusterApiUrl } from '@solana/web3.js';

import Pool from './components/Pool';
import '@solana/wallet-adapter-react-ui/styles.css'; // Default styles for wallet button

const App: FC = () => {
  const network = 'devnet'; // Use string for network
  const endpoint = clusterApiUrl(network); // Get the correct endpoint
  const wallets = useMemo(
    () => [
      new PhantomWalletAdapter(),
      new SolflareWalletAdapter(), // Use SolflareWalletAdapter
    ],
    []
  );

  return (
    <ConnectionProvider endpoint={endpoint}>
      <WalletProvider wallets={wallets} autoConnect>
        <WalletModalProvider>
          <div className="App">
            <header className="App-header">
              <h1>Liquidity Pool Interface</h1>
              <WalletMultiButton />
              <Pool />
            </header>
          </div>
        </WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
};

export default App;
