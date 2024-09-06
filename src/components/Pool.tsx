import React, { useState, useEffect } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { Connection, PublicKey } from '@solana/web3.js';

// Dummy token list for demonstration (you'll need actual token mint addresses)
const tokenList = [
  { name: 'SOL', address: 'So11111111111111111111111111111111111111112' },
  { name: 'USDC', address: 'Gh9ZwEmdLJ8DscKNTkTqPbNwLNNBjuSzaG9Vp2KGtKJr' },
  { name: 'RAY', address: '4k3Dyjzvzp8eLhHVdBeU67ecWtPqyT4m6tFaYyJ2F4vW' },
  { name: 'SRM', address: '2MsbQKuJHK9tKh7NCYmNYkD2cpbZYVnKsKuTDJtb8JGn' },
];

const Pool: React.FC = () => {
  const { publicKey, connected } = useWallet();
  const [amount1, setAmount1] = useState('');
  const [amount2, setAmount2] = useState('');
  const [token1, setToken1] = useState(tokenList[0].address);
  const [token2, setToken2] = useState(tokenList[1].address);
  const [balance1, setBalance1] = useState<number | null>(null);
  const [balance2, setBalance2] = useState<number | null>(null);
  const [customToken1, setCustomToken1] = useState('');
  const [customToken2, setCustomToken2] = useState('');

  const connection = new Connection('https://api.devnet.solana.com', 'confirmed');

  useEffect(() => {
    if (publicKey && connected) {
      // Fetch balance for token 1
      fetchTokenBalance(token1, setBalance1);
      // Fetch balance for token 2
      fetchTokenBalance(token2, setBalance2);
    }
  }, [publicKey, connected, token1, token2]);

  const fetchTokenBalance = async (tokenAddress: string, setBalance: React.Dispatch<React.SetStateAction<number | null>>) => {
    try {
      if (!publicKey) return;
      
      const mintPublicKey = new PublicKey(tokenAddress);
      const tokenAccounts = await connection.getParsedTokenAccountsByOwner(publicKey, { mint: mintPublicKey });
      
      if (tokenAccounts.value.length > 0) {
        const balance = tokenAccounts.value[0].account.data.parsed.info.tokenAmount.uiAmount;
        setBalance(balance);
      } else {
        setBalance(0); // No balance
      }
    } catch (error) {
      console.error('Error fetching token balance:', error);
    }
  };

  const handleAddLiquidity = async () => {
    if (!connected || !publicKey) {
      alert('Please connect your wallet');
      return;
    }

    // Check if user has enough balance
    if (balance1 === null || balance2 === null || parseFloat(amount1) > balance1 || parseFloat(amount2) > balance2) {
      alert('Insufficient balance for the selected tokens');
      return;
    }

    // Add liquidity logic
    console.log('Add Liquidity with Token Pair:', token1, amount1, token2, amount2);
  };

  const handleRemoveLiquidity = async () => {
    if (!connected || !publicKey) {
      alert('Please connect your wallet');
      return;
    }
    // Remove liquidity logic
    console.log('Remove Liquidity for pair:', token1, token2);
  };

  return (
    <div style={{ textAlign: 'center', marginTop: '20px' }}>
      <h3>This is running on devnet</h3>
      <h4>Add Your mint address in custom option</h4>
      <h2>Manage Your Liquidity</h2>
      {connected ? (
        <div>
          <h3>Wallet: {publicKey?.toBase58()}</h3>

          {/* Token Selection */}
          <div style={{ margin: '20px 0' }}>
            <h4>Select Token Pair</h4>
            <div>
              <label>
                Token 1:
                <select
                  value={token1}
                  onChange={(e) => setToken1(e.target.value)}
                  style={{ margin: '10px', padding: '10px' }}
                >
                  {tokenList.map((token) => (
                    <option key={token.address} value={token.address}>
                      {token.name}
                    </option>
                  ))}
                  <option value="">Custom Token</option>
                </select>
              </label>
              {token1 === '' && (
                <input
                  type="text"
                  placeholder="Custom Token 1 Address"
                  value={customToken1}
                  onChange={(e) => setCustomToken1(e.target.value)}
                  style={{ padding: '10px', margin: '10px' }}
                />
              )}
              <input
                type="text"
                placeholder="Amount"
                value={amount1}
                onChange={(e) => setAmount1(e.target.value)}
                style={{ padding: '10px', margin: '10px' }}
              />
              {balance1 !== null && <p>Balance: {balance1}</p>}
            </div>

            <div>
              <label>
                Token 2:
                <select
                  value={token2}
                  onChange={(e) => setToken2(e.target.value)}
                  style={{ margin: '10px', padding: '10px' }}
                >
                  {tokenList.map((token) => (
                    <option key={token.address} value={token.address}>
                      {token.name}
                    </option>
                  ))}
                  <option value="">Custom Token</option>
                </select>
              </label>
              {token2 === '' && (
                <input
                  type="text"
                  placeholder="Custom Token 2 Address"
                  value={customToken2}
                  onChange={(e) => setCustomToken2(e.target.value)}
                  style={{ padding: '10px', margin: '10px' }}
                />
              )}
              <input
                type="text"
                placeholder="Amount"
                value={amount2}
                onChange={(e) => setAmount2(e.target.value)}
                style={{ padding: '10px', margin: '10px' }}
              />
              {balance2 !== null && <p>Balance: {balance2}</p>}
            </div>

            <button
              onClick={handleAddLiquidity}
              style={{
                padding: '10px 20px',
                backgroundColor: '#4CAF50',
                color: 'white',
                border: 'none',
                cursor: 'pointer',
              }}
            >
              Add Liquidity
            </button>
          </div>

          <div>
            <h4>Remove Liquidity</h4>
            <button
              onClick={handleRemoveLiquidity}
              style={{
                padding: '10px 20px',
                backgroundColor: '#f44336',
                color: 'white',
                border: 'none',
                cursor: 'pointer',
              }}
            >
              Remove Liquidity
            </button>
          </div>
        </div>
      ) : (
        <p>Please connect your wallet to manage liquidity.</p>
      )}
    </div>
  );
};

export default Pool;
