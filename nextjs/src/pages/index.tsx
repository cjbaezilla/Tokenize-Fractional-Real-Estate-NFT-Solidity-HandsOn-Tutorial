import { ConnectButton } from '@rainbow-me/rainbowkit';
import type { NextPage } from 'next';
import Head from 'next/head';
import { useEffect, useState } from 'react';
import { useAccount, useReadContract } from 'wagmi';
import { useQueryClient } from '@tanstack/react-query';
import { formatEther } from 'viem';
import styles from '../styles/Home.module.css';
import { usePropertyNft } from '../hooks/usePropertyNft';
import { useMockUsdt } from '../hooks/useMockUsdt';
import { PROPERTY_NFT_ADDRESS } from '../contracts/propertyNFT';
import { MOCK_USDT_ADDRESS } from '../contracts/mockUSDT';
import nftAbi from '../contracts/abis/BaseErc721PropertyNFT.json';

const Home: NextPage = () => {
  const { address, isConnected } = useAccount();
  const queryClient = useQueryClient();
  const [transactions, setTransactions] = useState<Array<{type: string; hash: string; time: Date}>>([]);
  const [isApproving, setIsApproving] = useState(false);
   
  const {
    balance: usdtBalance,
    symbol: usdtSymbol,
    decimals: usdtDecimals,
    isLoading: usdtLoading,
    useAllowance,
    approve: approveUsdt,
    isSuccess: isApproveSuccess,
    hash: approveHash,
    error: usdtError,
  } = useMockUsdt();

  const {
    name,
    symbol,
    maxSupply,
    mintPrice,
    propertyAddress,
    propertyValue,
    propertyType,
    propertyRooms,
    propertyBaths,
    description,
    imageData,
    externalUrl,
    isSuccess,
    hash,
    isPending,
    error,
    purchase
  } = usePropertyNft();

  // Debug: log balance changes
  useEffect(() => {
    console.log('USDT Balance:', usdtBalance, 'Decimals:', usdtDecimals, 'Formatted:', formatUSDT(usdtBalance, usdtDecimals));
  }, [usdtBalance, usdtDecimals]);

  // Get allowance for NFT contract to spend user's USDT
  const { data: allowance, refetch: refetchAllowance } = useAllowance(PROPERTY_NFT_ADDRESS);

  // Fetch NFT balance for connected user
  const { data } = useReadContract({
    address: PROPERTY_NFT_ADDRESS,
    abi: nftAbi,
    functionName: 'balanceOf',
    args: address ? [address] : undefined,
    query: {
      enabled: !!address,
    },
  });
  const nftBalance = data as bigint | undefined;

  // Track successful mint transactions and invalidate USDT balance query
  useEffect(() => {
    if (isSuccess && hash) {
      setTransactions(prev => [{
        type: 'Mint NFT',
        hash,
        time: new Date()
      }, ...prev].slice(0, 5));
      console.log('Mint transaction successful, hash:', hash);
      // Invalidate and refetch USDT balance after successful mint
      console.log('Invalidating USDT balance queries...');
      queryClient.invalidateQueries({
        predicate: (query) => {
          const [key, params] = query.queryKey as [string, any];
          return (
            key === 'readContract' &&
            params?.address?.toLowerCase() === MOCK_USDT_ADDRESS?.toLowerCase() &&
            params?.functionName === 'balanceOf'
          );
        }
      }).then(() => {
        console.log('Queries invalidated, refetch triggered');
      }).catch(err => {
        console.error('Error invalidating queries:', err);
      });
    }
  }, [isSuccess, hash, queryClient]);

  // Refetch allowance and invalidate balance after approval and track approval transaction
  useEffect(() => {
    if (isApproveSuccess && approveHash) {
      refetchAllowance();
      // Also invalidate USDT balance query
      queryClient.invalidateQueries({
        predicate: (query) => {
          const [key, params] = query.queryKey as [string, any];
          return (
            key === 'readContract' &&
            params?.address?.toLowerCase() === MOCK_USDT_ADDRESS?.toLowerCase() &&
            params?.functionName === 'balanceOf'
          );
        }
      });
      setTransactions(prev => [{
        type: 'Approve USDT',
        hash: approveHash,
        time: new Date()
      }, ...prev].slice(0, 5));
    }
  }, [isApproveSuccess, approveHash, refetchAllowance, queryClient]);

  const truncateAddress = (addr: string) => {
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  };

  const formatUSDT = (value: bigint | undefined, decimals: bigint | undefined) => {
    if (!value || !decimals) return '0';
    const formattedValue = (Number(value) / Math.pow(10, Number(decimals))).toFixed(2);
    // Parse the number to add proper formatting
    const numberValue = parseFloat(formattedValue);
    return numberValue.toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  };

  const formatAllowance = (value: bigint | undefined, decimals: bigint | undefined) => {
    if (!value || !decimals) return '0';
    const formattedValue = (Number(value) / Math.pow(10, Number(decimals))).toFixed(2);
    const numberValue = parseFloat(formattedValue);
    return numberValue.toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  };

  const isAllowanceSufficient = allowance && mintPrice && usdtDecimals
    ? Number(allowance) >= Number(mintPrice)
    : false;

  const handleMint = async () => {
    if (!isConnected) {
      alert('Please connect your wallet first');
      return;
    }
    try {
      await purchase();
    } catch (err) {
      console.error('Mint error:', err);
    }
  };

  const handleApprove = async () => {
    if (!isConnected || !mintPrice) {
      alert('Please connect your wallet and ensure mint price is loaded');
      return;
    }
    try {
      setIsApproving(true);
      await approveUsdt(PROPERTY_NFT_ADDRESS, mintPrice);
    } catch (err) {
      console.error('Approve error:', err);
    } finally {
      setIsApproving(false);
    }
  };

  const propertyImage = imageData || 'data:image/svg+xml,' + encodeURIComponent(`
    <svg xmlns="http://www.w3.org/2000/svg" width="800" height="600" viewBox="0 0 800 600">
      <rect fill="#1e293b" width="800" height="600"/>
      <text fill="#94a3b8" x="50%" y="50%" text-anchor="middle" font-size="24">Property Image</text>
    </svg>
  `);

  return (
    <div className={styles.container}>
      <Head>
        <title>Fractional Real Estate NFT RWA Tokenization Dashboard</title>
        <meta name="description" content="Tokenize and invest in fractional real estate NFT RWA tokenization" />
        <link href="/favicon.ico" rel="icon" />
      </Head>

      <header className={styles.header}>
        <div className={styles.logo}>
          <div className={styles.logoIcon}>🏠</div>
          <span>Fractional Real Estate NFT RWA Tokenization</span>
        </div>
        <div className={styles.walletInfo}>
          <div className={styles.connectButton}>
            <ConnectButton />
          </div>
        </div>
      </header>

      <main className={styles.main}>
        {!isConnected ? (
          <div className={styles.section}>
            <div className={styles.loading}>
              <h2>Welcome to Fractional Real Estate NFT RWA Tokenization</h2>
              <p>Connect your wallet to access the dashboard</p>
            </div>
          </div>
         ) : (
           <div className={styles.dashboard}>
             {/* Top Sections Grid */}
             <div className={styles.topSectionsGrid}>
               {/* Stats Overview */}
               <div className={styles.section}>
                 <h2 className={styles.sectionTitle}>
                   <div className={styles.sectionIcon}>📊</div>
                   Portfolio Overview
                 </h2>
                 <div className={styles.statsGrid}>
                   <div className={styles.statCard}>
                     <div className={styles.statValue}>{nftBalance ? Number(nftBalance) : 0}</div>
                     <div className={styles.statLabel}>NFTs Owned</div>
                   </div>
                   <div className={styles.statCard}>
                     <div className={styles.statValue}>{formatUSDT(usdtBalance, usdtDecimals)}</div>
                     <div className={styles.statLabel}>USDT Balance</div>
                   </div>
                   <div className={styles.statCard}>
                     <div className={styles.statValue}>{maxSupply ? Number(maxSupply.toString()) : 'N/A'}</div>
                     <div className={styles.statLabel}>Max Supply</div>
                   </div>
                   <div className={styles.statCard}>
                     <div className={styles.statValue}>{formatUSDT(mintPrice, usdtDecimals)}</div>
                     <div className={styles.statLabel}>Mint Price (USDT)</div>
                   </div>
                 </div>
               </div>

                {/* Minting Section */}
                <div className={styles.section}>
                  <h2 className={styles.sectionTitle}>
                    <div className={styles.sectionIcon}>🪙</div>
                    Mint New NFT
                  </h2>
                  <div className={styles.mintSection}>
                    <div className={styles.mintInfo}>
                      <p>Purchase a fractional share of this property as an NFT.</p>
                      <div className={styles.mintPrice}>
                        {mintPrice && usdtDecimals ? `${formatUSDT(mintPrice, usdtDecimals)} ${usdtSymbol || 'USDT'}` : 'Loading...'}
                      </div>
                      <p style={{ color: 'var(--text-secondary)', marginTop: '1rem' }}>
                        {maxSupply ? `Total Supply: ${Number(maxSupply.toString())} NFTs` : 'Loading...'}
                      </p>
                      
                      {/* Allowance Display */}
                      <div style={{ 
                        marginTop: '1rem', 
                        padding: '0.75rem', 
                        background: 'var(--bg-secondary)',
                        borderRadius: '8px',
                        border: '1px solid var(--border-color)'
                      }}>
                        <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: '0.25rem' }}>
                          Current USDT Allowance for NFT Contract
                        </div>
                        <div style={{ fontSize: '1.25rem', fontWeight: 600 }}>
                          {usdtDecimals && allowance !== undefined 
                            ? `${formatAllowance(allowance, usdtDecimals)} ${usdtSymbol || 'USDT'}`
                            : 'Loading...'
                          }
                        </div>
                        {allowance !== undefined && mintPrice && usdtDecimals && (
                          <div style={{ 
                            fontSize: '0.875rem', 
                            marginTop: '0.5rem',
                            color: isAllowanceSufficient ? 'var(--success)' : 'var(--warning)'
                          }}>
                            {isAllowanceSufficient 
                              ? '✓ Sufficient allowance for minting'
                              : `⚠ Insufficient allowance (need ${formatUSDT(mintPrice, usdtDecimals)} ${usdtSymbol})`
                            }
                          </div>
                        )}
                      </div>
                    </div>
                    
                    {!isAllowanceSufficient ? (
                      <button
                        className={styles.mintButton}
                        onClick={handleApprove}
                        disabled={isApproving || !isConnected}
                        style={{ background: 'var(--warning)' }}
                      >
                        {isApproving ? 'Approving...' : 'Approve USDT'}
                      </button>
                    ) : (
                      <button
                        className={styles.mintButton}
                        onClick={handleMint}
                        disabled={isPending || !isConnected}
                      >
                        {isPending ? 'Processing...' : 'Mint NFT Now'}
                      </button>
                    )}
                    
                    {isApproveSuccess && (
                      <div style={{
                        background: 'rgba(59, 130, 246, 0.1)',
                        border: '1px solid var(--primary)',
                        color: 'var(--primary)',
                        padding: '1rem',
                        borderRadius: '12px',
                        marginTop: '1rem'
                      }}>
                        ✓ USDT approved successfully!
                        <div style={{ fontFamily: 'monospace', fontSize: '0.875rem', marginTop: '0.5rem' }}>
                          Transaction: {truncateAddress(approveHash || '')}
                        </div>
                      </div>
                    )}
                    
                    {error && (
                      <div className={styles.error}>
                        Error: {error.message}
                      </div>
                    )}
                    
                    {usdtError && (
                      <div className={styles.error}>
                        USDT Error: {usdtError.message}
                      </div>
                    )}
                    
                    {isSuccess && (
                      <div style={{
                        background: 'rgba(16, 185, 129, 0.1)',
                        border: '1px solid var(--success)',
                        color: 'var(--success)',
                        padding: '1rem',
                        borderRadius: '12px',
                        marginTop: '1rem'
                      }}>
                        ✓ NFT minted successfully!
                        <div style={{ fontFamily: 'monospace', fontSize: '0.875rem', marginTop: '0.5rem' }}>
                          Transaction: {truncateAddress(hash || '')}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
            </div>

             {/* Property Details & Minting */}
             <div className={styles.propertyGrid}>
              <div className={styles.section}>
                <h2 className={styles.sectionTitle}>
                  <div className={styles.sectionIcon}>🏘️</div>
                  Property Details
                </h2>
                <a 
                  href={externalUrl || '#'} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  style={{ display: 'block', textDecoration: 'none' }}
                >
                  <img 
                    src={propertyImage || '/property.jpg'} 
                    alt="Property" 
                    className={styles.propertyImage}
                    onError={(e) => {
                      e.currentTarget.src = 'data:image/svg+xml,' + encodeURIComponent(`
                        <svg xmlns="http://www.w3.org/2000/svg" width="800" height="600" viewBox="0 0 800 600">
                          <rect fill="#1e293b" width="800" height="600"/>
                          <text fill="#94a3b8" x="50%" y="50%" text-anchor="middle" font-size="24">Property Image</text>
                        </svg>
                      `);
                    }}
                    style={{ cursor: externalUrl ? 'pointer' : 'default' }}
                  />
                </a>
              </div>

              <div className={styles.section}>
                <h2 className={styles.sectionTitle}>
                  <div className={styles.sectionIcon}>📋</div>
                  Property Information
                </h2>
                <div className={styles.propertyDetails}>
                  <div>
                   <h1 style={{ fontSize: '1.875rem', fontWeight: 700, marginBottom: '0.5rem' }}>
                     {name || 'Loading...'}
                   </h1>
                     <p className={styles.description}>
                       {description || 'No description available'}
                     </p>
                  </div>

                  <div className={styles.propertyInfo}>
                     <div className={styles.infoCard}>
                       <div className={styles.infoLabel}>Address</div>
                       <div className={styles.infoValue}>{propertyAddress || 'N/A'}</div>
                     </div>
                     <div className={styles.infoCard}>
                       <div className={styles.infoLabel}>Property Value</div>
                        <div className={`${styles.infoValue} ${styles.highlight}`}>
                          {propertyValue ? `US$${Number(propertyValue).toLocaleString('en-US')}` : 'N/A'}
                        </div>
                     </div>
                    <div className={styles.infoCard}>
                      <div className={styles.infoLabel}>Type</div>
                      <div className={styles.infoValue}>{propertyType || 'N/A'}</div>
                    </div>
                    <div className={styles.infoCard}>
                      <div className={styles.infoLabel}>Rooms</div>
                      <div className={styles.infoValue}>{propertyRooms !== undefined ? Number(propertyRooms) : 'N/A'}</div>
                    </div>
                    <div className={styles.infoCard}>
                      <div className={styles.infoLabel}>Baths</div>
                      <div className={styles.infoValue}>{propertyBaths !== undefined ? Number(propertyBaths) : 'N/A'}</div>
                    </div>
                    {externalUrl && (
                      <div className={styles.infoCard}>
                        <div className={styles.infoLabel}>External Link</div>
                        <a href={externalUrl} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--primary)' }}>
                          View Details →
                        </a>
                      </div>
                    )}
                  </div>
                </div>
              </div>
             </div>

             {/* Contract Information */}
            <div className={styles.section}>
              <h2 className={styles.sectionTitle}>
                <div className={styles.sectionIcon}>📜</div>
                Contract Information
              </h2>
              <div className={styles.contractInfo}>
                <div className={styles.contractCard}>
                  <div className={styles.contractLabel}>Property NFT Contract</div>
                  <div className={styles.contractValue}>{PROPERTY_NFT_ADDRESS}</div>
                </div>
                <div className={styles.contractCard}>
                  <div className={styles.contractLabel}>Mock USDT Contract</div>
                  <div className={styles.contractValue}>{MOCK_USDT_ADDRESS}</div>
                </div>
                 <div className={styles.contractCard}>
                   <div className={styles.contractLabel}>Token Name</div>
                   <div className={styles.contractValue}>{name || 'Loading...'}</div>
                 </div>
                 <div className={styles.contractCard}>
                   <div className={styles.contractLabel}>Token Symbol</div>
                   <div className={styles.contractValue}>{symbol || 'Loading...'}</div>
                 </div>
              </div>
            </div>

            {/* Recent Transactions */}
            {transactions.length > 0 && (
              <div className={styles.section}>
                <h2 className={styles.sectionTitle}>
                  <div className={styles.sectionIcon}>📝</div>
                  Recent Transactions
                </h2>
                <div className={styles.transactions}>
                  {transactions.map((tx, index) => (
                    <div key={index} className={styles.transactionItem}>
                      <div>
                        <div className={styles.transactionType}>{tx.type}</div>
                        <div className={styles.transactionHash}>{truncateAddress(tx.hash)}</div>
                      </div>
                      <div className={styles.transactionTime}>
                        {tx.time.toLocaleTimeString()}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </main>

      <footer className={styles.footer}>
        <p>© 2024 Fractional Real Estate NFT RWA Tokenization.</p>
      </footer>
    </div>
  );
};

export default Home;
