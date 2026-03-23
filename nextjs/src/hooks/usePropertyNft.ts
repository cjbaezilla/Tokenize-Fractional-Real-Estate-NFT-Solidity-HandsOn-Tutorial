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

  const imageData = useReadContract({
    address: PROPERTY_NFT_ADDRESS,
    abi,
    functionName: 'getImageData',
  });

  const externalUrl = useReadContract({
    address: PROPERTY_NFT_ADDRESS,
    abi,
    functionName: 'getExternalUrl',
  });

  return {
    // Data with type assertions
    name: name.data as string | undefined,
    symbol: symbol.data as string | undefined,
    maxSupply: maxSupply.data as bigint | undefined,
    mintPrice: mintPrice.data as bigint | undefined,
    propertyAddress: propertyAddress.data as string | undefined,
    propertyValue: propertyValue.data as bigint | undefined,
    propertyType: propertyType.data as string | undefined,
    propertyRooms: propertyRooms.data as bigint | undefined,
    propertyBaths: propertyBaths.data as bigint | undefined,
    description: description.data as string | undefined,
    imageData: imageData.data as string | undefined,
    externalUrl: externalUrl.data as string | undefined,
    
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
