import { useReadContract, useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import abi from '../contracts/abis/BaseErc721PropertyNFT.json';
import { PROPERTY_NFT_ADDRESS } from '../contracts/propertyNFT';

export const usePropertyNft = () => {
  const { writeContract, data: hash, error, isPending } = useWriteContract();

  const { isLoading: isWaitingForTransaction, isSuccess } = useWaitForTransactionReceipt({
    hash,
  });

  // Read functions
  const name = useReadContract({
    address: PROPERTY_NFT_ADDRESS,
    abi,
    functionName: 'name',
  });

  const symbol = useReadContract({
    address: PROPERTY_NFT_ADDRESS,
    abi,
    functionName: 'symbol',
  });

  const maxSupply = useReadContract({
    address: PROPERTY_NFT_ADDRESS,
    abi,
    functionName: 'maxSupply',
  });

  const mintPrice = useReadContract({
    address: PROPERTY_NFT_ADDRESS,
    abi,
    functionName: 'mintPrice',
  });

  const propertyAddress = useReadContract({
    address: PROPERTY_NFT_ADDRESS,
    abi,
    functionName: 'getPropertyAddress',
  });

  const propertyValue = useReadContract({
    address: PROPERTY_NFT_ADDRESS,
    abi,
    functionName: 'getPropertyValue',
  });

  const propertyType = useReadContract({
    address: PROPERTY_NFT_ADDRESS,
    abi,
    functionName: 'getPropertyType',
  });

  const propertyRooms = useReadContract({
    address: PROPERTY_NFT_ADDRESS,
    abi,
    functionName: 'getPropertyRooms',
  });

  const propertyBaths = useReadContract({
    address: PROPERTY_NFT_ADDRESS,
    abi,
    functionName: 'getPropertyBaths',
  });

  const description = useReadContract({
    address: PROPERTY_NFT_ADDRESS,
    abi,
    functionName: 'getDescription',
  });

  // Write functions
  const purchase = () => {
    writeContract({
      address: PROPERTY_NFT_ADDRESS,
      abi,
      functionName: 'purchase',
    });
  };

  const updatePropertyMetadata = (
    address: string,
    value: bigint,
    type: string,
    rooms: bigint,
    baths: bigint,
    desc: string,
    image: string,
    url: string
  ) => {
    writeContract({
      address: PROPERTY_NFT_ADDRESS,
      abi,
      functionName: 'updatePropertyMetadata',
      args: [address, value, type, rooms, baths, desc, image, url],
    });
  };

  return {
    // Data
    name: name.data,
    symbol: symbol.data,
    maxSupply: maxSupply.data,
    mintPrice: mintPrice.data,
    propertyAddress: propertyAddress.data,
    propertyValue: propertyValue.data,
    propertyType: propertyType.data,
    propertyRooms: propertyRooms.data,
    propertyBaths: propertyBaths.data,
    description: description.data,
    
    // Status
    isLoading: name.isLoading || symbol.isLoading || maxSupply.isLoading || mintPrice.isLoading,
    isPending,
    isWaitingForTransaction,
    isSuccess,
    error,
    hash,

    // Actions
    purchase,
    updatePropertyMetadata,
  };
};
