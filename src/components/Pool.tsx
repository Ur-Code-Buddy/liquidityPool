import React, { useState, useEffect } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { Connection, PublicKey } from '@solana/web3.js';
import axios from 'axios';

// Dummy token list for demonstration (you'll need actual token mint addresses)
const tokenList = [
  { name: 'SOL', address: 'So11111111111111111111111111111111111111112' },
  { name: 'USDC', address: 'Gh9ZwEmdLJ8DscKNTkTqPbNwLNNBjuSzaG9Vp2KGtKJr' },
  { name: 'RAY', address: '4k3Dyjzvzp8eLhHVdBeU67ecWtPqyT4m6tFaYyJ2F4vW' },
  { name: 'SRM', address: '2MsbQKuJHK9tKh7NCYmNYkD2cpbZYVnKsKuTDJtb8JGn' },
];

const API_BASE_URL = 'https://api-v3.raydium.io';

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

  useEffect(() => {
    if (publicKey && connected) {
      // Fetch balance for custom token 1
      if (customToken1) {
        fetchTokenBalance(customToken1, setBalance1);
      }
    }
  }, [customToken1]);

  useEffect(() => {
    if (publicKey && connected) {
      // Fetch balance for custom token 2
      if (customToken2) {
        fetchTokenBalance(customToken2, setBalance2);
      }
    }
  }, [customToken2]);

  const fetchTokenBalance = async (tokenAddress: string, setBalance: React.Dispatch<React.SetStateAction<number | null>>) => {
    try {
      if (!publicKey) return;
  
      // Handle SOL balance separately
      if (tokenAddress === tokenList[0].address) { // Assuming SOL address is the first in the list
        const balance = await connection.getBalance(publicKey);
        setBalance(balance / 1e9); // Convert from lamports to SOL
        return;
      }
      
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
  

  const fetchPoolInfo = async (tokenAddress1: string, tokenAddress2: string) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/pools`);
      const pools = response.data;

      // Find the pool with the selected token pair
      const pool = pools.find((p: any) => 
        (p.token1 === tokenAddress1 && p.token2 === tokenAddress2) ||
        (p.token1 === tokenAddress2 && p.token2 === tokenAddress1)
      );
      return pool;
    } catch (error) {
      console.error('Error fetching pool info:', error);
      return null;
    }
  };

  const handleAddLiquidity = async () => {
    if (!connected || !publicKey) {
      alert('Please connect your wallet');
      return;
    }

    if (balance1 === null || balance2 === null || parseFloat(amount1) > balance1 || parseFloat(amount2) > balance2) {
      alert('Insufficient balance for the selected tokens');
      return;
    }

    try {
      const pool = await fetchPoolInfo(token1, token2);
      if (!pool) {
        alert('Pool not found for the selected tokens');
        return;
      }

      const response = await axios.post(`${API_BASE_URL}/add-liquidity`, {
        walletAddress: publicKey.toBase58(),
        poolId: pool.id,
        token1,
        amount1,
        token2,
        amount2,
      });
      console.log('Add Liquidity Response:', response.data);
      alert('Liquidity added successfully');
    } catch (error) {
      console.error('Error adding liquidity:', error);
      alert('Failed to add liquidity');
    }
  };

  const handleRemoveLiquidity = async () => {
    if (!connected || !publicKey) {
      alert('Please connect your wallet');
      return;
    }

    try {
      const pool = await fetchPoolInfo(token1, token2);
      if (!pool) {
        alert('Pool not found for the selected tokens');
        return;
      }

      const response = await axios.post(`${API_BASE_URL}/remove-liquidity`, {
        walletAddress: publicKey.toBase58(),
        poolId: pool.id,
        token1,
        token2,
      });
      console.log('Remove Liquidity Response:', response.data);
      alert('Liquidity removed successfully');
    } catch (error) {
      console.error('Error removing liquidity:', error);
      alert('Failed to remove liquidity');
    }
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
                  onChange={(e) => {
                    setToken1(e.target.value);
                    if (e.target.value === '') {
                      setCustomToken1('');
                      setBalance1(null); // Reset balance when custom token is selected
                    }
                  }}
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
                  onChange={(e) => {
                    setToken2(e.target.value);
                    if (e.target.value === '') {
                      setCustomToken2('');
                      setBalance2(null); // Reset balance when custom token is selected
                    }
                  }}
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
