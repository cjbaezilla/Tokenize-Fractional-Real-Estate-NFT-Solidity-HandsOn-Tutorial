import { createPublicClient, http, getContract } from 'viem';
import { sepolia } from 'viem/chains';
import abi from './abis/MockUSDT.json';

const publicClient = createPublicClient({
  chain: sepolia,
  transport: http(),
});

export const MOCK_USDT_ADDRESS = process.env.NEXT_PUBLIC_MOCK_USDT_ADDRESS as `0x${string}`;

export const mockUsdtContract = getContract({
  address: MOCK_USDT_ADDRESS,
  abi: abi,
  client: publicClient,
});
