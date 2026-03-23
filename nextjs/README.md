This is a [RainbowKit](https://rainbowkit.com) + [wagmi](https://wagmi.sh) + [Next.js](https://nextjs.org/) project bootstrapped with [`create-rainbowkit`](/packages/create-rainbowkit).

## Getting Started

First, run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `pages/index.tsx`. The page auto-updates as you edit the file.

## Learn More

To learn more about this stack, take a look at the following resources:

- [RainbowKit Documentation](https://rainbowkit.com) - Learn how to customize your wallet connection flow.
- [wagmi Documentation](https://wagmi.sh) - Learn how to interact with Ethereum.
- [Next.js Documentation](https://nextjs.org/docs) - Learn how to build a Next.js application.

You can check out [the RainbowKit GitHub repository](https://github.com/rainbow-me/rainbowkit) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out the [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.

## 🔗 Smart Contract Integration

This project is integrated with the **Property NFT** and **Mock USDT** smart contracts.

### 📝 Contract Initializers
The contract instances are initialized using `viem` and can be found in `src/contracts/`:
- `src/contracts/propertyNFT.ts`: BaseErc721PropertyNFT contract instance.
- `src/contracts/mockUSDT.ts`: MockUSDT contract instance.

### 🍱 ABIs
The contract ABIs are stored as JSON files in `src/contracts/abis/`:
- `src/contracts/abis/BaseErc721PropertyNFT.json`
- `src/contracts/abis/MockUSDT.json`

### 🔑 Environment Variables
The following variables must be defined in your `.env` file (see `.env.example`):
- `NEXT_PUBLIC_PROPERTY_NFT_ADDRESS`: Deployed address of the Property NFT contract.
- `NEXT_PUBLIC_MOCK_USDT_ADDRESS`: Deployed address of the Mock USDT contract.

### 🪝 React Hooks
Custom hooks are available in `src/hooks/` for easy contract interaction:

#### `usePropertyNft()`
Provides data and functions for the Property NFT contract:
- **Data**: `name`, `symbol`, `maxSupply`, `mintPrice`, `propertyAddress`, `propertyValue`, `propertyType`, `propertyRooms`, `propertyBaths`, `description`.
- **Status**: `isLoading`, `isPending`, `isWaitingForTransaction`, `isSuccess`, `error`, `hash`.
- **Actions**:
  - `purchase()`: Purchase a new property NFT.
  - `updatePropertyMetadata(...)`: Update all property details (Owner only).

#### `useMockUsdt()`
Provides data and functions for the Mock USDT contract:
- **Data**: `balance`, `symbol`, `decimals`.
- **Functions**: `getAllowance(spender)`: Get allowance for a specific address.
- **Status**: `isLoading`, `isPending`, `isWaitingForTransaction`, `isSuccess`, `error`, `hash`.
- **Actions**:
  - `approve(spender, amount)`: Approve an address to spend USDT.
  - `mint(to, amount)`: Mint new mock USDT tokens.
  - `transfer(to, amount)`: Transfer USDT tokens.

### 💡 Example Usage

```tsx
import { usePropertyNft } from '../hooks/usePropertyNft';
import { useMockUsdt } from '../hooks/useMockUsdt';

const MyComponent = () => {
  const { propertyAddress, mintPrice, purchase } = usePropertyNft();
  const { balance, approve } = useMockUsdt();

  return (
    <div>
      <p>Property: {propertyAddress}</p>
      <p>Price: {mintPrice?.toString()} USDT</p>
      <p>Your Balance: {balance?.toString()} USDT</p>
      <button onClick={() => approve(PROPERTY_NFT_ADDRESS, mintPrice)}>1. Approve</button>
      <button onClick={() => purchase()}>2. Buy NFT</button>
    </div>
  );
};
```
