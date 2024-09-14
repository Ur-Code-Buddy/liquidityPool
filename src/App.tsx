import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import IndexPage from './pages/IndexPage';
import HomePage from './pages/Homepage';
import CreatePoolPage from './pages/CreatePoolPage';
import TransactionStatusPage from './pages/TransactionStatusPage';
import MintTokensPage from './pages/MintTokensPage';

// wallet adapter imports
import { ConnectionProvider, WalletProvider } from '@solana/wallet-adapter-react';
import {
    WalletModalProvider,
} from '@solana/wallet-adapter-react-ui';
import '@solana/wallet-adapter-react-ui/styles.css';
import SuccessPage from './pages/SuccessPage';

function App() {

  return (
    <ConnectionProvider endpoint="https://api.devnet.solana.com">
      <WalletProvider wallets={[]} autoConnect>
        <WalletModalProvider>
          {/* <div style={{ display: 'flex', justifyContent: 'space-between', padding: 5 }}>
            <WalletMultiButton />
            <WalletDisconnectButton />
          </div> */}
          <Router>
            <Routes>
              <Route path="/" element={<IndexPage />} />
              <Route path="/home" element={<HomePage />} />
              <Route path="/create-pool" element={<CreatePoolPage />} />
              <Route path="/transaction-status" element={<TransactionStatusPage />} />
              <Route path="/success" element={<SuccessPage />} />
              <Route path="/mint-tokens" element={<MintTokensPage />} />
            </Routes>
          </Router>
        </WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
}

export default App;
