import { useReadContract, useWriteContract, useWaitForTransactionReceipt, useAccount } from 'wagmi';
import abi from '../contracts/abis/MockUSDT.json';
import { MOCK_USDT_ADDRESS } from '../contracts/mockUSDT';

export const useMockUsdt = () => {
  const { address: userAddress } = useAccount();
  const { writeContract, data: hash, error, isPending } = useWriteContract();

  const { isLoading: isWaitingForTransaction, isSuccess } = useWaitForTransactionReceipt({
    hash,
  });

  // Read functions
  const balance = useReadContract({
    address: MOCK_USDT_ADDRESS,
    abi,
    functionName: 'balanceOf',
    args: userAddress ? [userAddress] : undefined,
    query: {
      enabled: !!userAddress,
    },
  });

  const symbol = useReadContract({
    address: MOCK_USDT_ADDRESS,
    abi,
    functionName: 'symbol',
  });

  const decimals = useReadContract({
    address: MOCK_USDT_ADDRESS,
    abi,
    functionName: 'decimals',
  });

  const useAllowance = (spender: string) => useReadContract({
    address: MOCK_USDT_ADDRESS,
    abi,
    functionName: 'allowance',
    args: userAddress && spender ? [userAddress, spender] : undefined,
    query: {
      enabled: !!userAddress && !!spender,
    },
  });

  // Write functions
  const approve = (spender: string, amount: bigint) => {
    writeContract({
      address: MOCK_USDT_ADDRESS,
      abi,
      functionName: 'approve',
      args: [spender, amount],
    });
  };

  const mint = (to: string, amount: bigint) => {
    writeContract({
      address: MOCK_USDT_ADDRESS,
      abi,
      functionName: 'mint',
      args: [to, amount],
    });
  };

  const transfer = (to: string, amount: bigint) => {
    writeContract({
      address: MOCK_USDT_ADDRESS,
      abi,
      functionName: 'transfer',
      args: [to, amount],
    });
  };

  return {
    // Data with type assertions
    balance: balance.data as bigint | undefined,
    symbol: symbol.data as string | undefined,
    decimals: decimals.data as bigint | undefined,
    useAllowance,
    
    // Status
    isLoading: balance.isLoading || symbol.isLoading || decimals.isLoading,
    isPending,
    isWaitingForTransaction,
    isSuccess,
    error,
    hash,

    // Actions
    approve,
    mint,
    transfer,
  };
};
