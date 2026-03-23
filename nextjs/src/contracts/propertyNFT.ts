import { createPublicClient, http, getContract } from 'viem';
import { sepolia } from 'viem/chains';
import abi from './abis/BaseErc721PropertyNFT.json';

const publicClient = createPublicClient({
  chain: sepolia,
  transport: http(),
});

export const PROPERTY_NFT_ADDRESS = process.env.NEXT_PUBLIC_PROPERTY_NFT_ADDRESS as `0x${string}`;

export const propertyNftContract = getContract({
  address: PROPERTY_NFT_ADDRESS,
  abi: abi,
  client: publicClient,
});
