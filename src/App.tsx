// src/App.tsx
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import IndexPage from './pages/IndexPage';
import HomePage from './pages/Homepage';
import CreatePoolPage from './pages/CreatePoolPage';
import TransactionStatusPage from './pages/TransactionStatusPage';

// wallet adapter imports
import { ConnectionProvider, WalletProvider } from '@solana/wallet-adapter-react';
import {
    WalletModalProvider,
    WalletDisconnectButton,
    WalletMultiButton
} from '@solana/wallet-adapter-react-ui';
import '@solana/wallet-adapter-react-ui/styles.css';

;

function App() {

  return (
    <ConnectionProvider endpoint="https://api.devnet.solana.com">
      <WalletProvider wallets={[]} autoConnect>
        <WalletModalProvider>
          <div style={{ display: 'flex', justifyContent: 'space-between', padding: 20 }}>
            <WalletMultiButton />
            <WalletDisconnectButton />
          </div>
          <Router>
            <Routes>
              <Route path="/" element={<IndexPage />} />
              <Route path="/home" element={<HomePage />} />
              <Route path="/create-pool" element={<CreatePoolPage />} />
              <Route path="/transaction-status" element={<TransactionStatusPage />} />
            </Routes>
          </Router>
        </WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
}
export default App;
