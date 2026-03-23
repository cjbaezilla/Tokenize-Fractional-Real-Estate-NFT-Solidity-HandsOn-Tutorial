# Building a Fractional Real Estate NFT Platform: A Hands-On Tutorial for Tokenization on Ethereum using Solidity and Next.js

![Cover](./images/screenshot_main.png)

## Introduction: The Future of Property Investment

Imagine a world where you could own a piece of a luxury apartment building without needing to save hundreds of thousands of dollars. Picture being able to buy and sell your share of real estate as easily as trading digital collectibles. This vision is becoming reality through the powerful combination of blockchain technology and non-fungible tokens. In this comprehensive tutorial, we will explore how to build a complete decentralized application that tokenizes real estate into fractional ownership shares.

The project you are about to study represents a full-stack blockchain application that demonstrates Real World Asset tokenization at its core. This is not merely a theoretical concept but a working system that combines smart contracts with modern web technology to create something previously impossible: democratized access to real estate investment through digital tokens.

## What is Tokenization? (For Absolute Beginners)

Imagine a luxury apartment building costs $1,000,000. Only millionaires could buy it outright. But what if we could cut that building into 1,000 digital pieces, each worth $1,000? Now ordinary people can own a small share. This is called **tokenization** - turning a physical asset into digital tokens that represent ownership.

**Fractional ownership** means you don't own the whole building; you own a small slice. If the building earns rental income or increases in value, your slice grows too. It's like owning shares in a company, but for real estate.

**Blockchain** is just a secure, public digital ledger that records who owns which token. Think of it as a worldwide spreadsheet that everyone can see but no one can cheat on.

**NFTs (Non-Fungible Tokens)** are unique digital certificates. Each one proves you own a specific share of the property.

**Smart contracts** are automated programs that enforce the rules - like a vending machine that automatically gives you a token when you pay.

No technical knowledge needed to follow along - we'll explain everything as we go!

## The Concept of Fractional Ownership

Traditional real estate investment has always carried significant barriers to entry. The requirement for substantial capital, the complexity of legal agreements, and the illiquid nature of property have kept many potential investors on the sidelines. Fractional ownership attempts to solve these problems by dividing a single property into multiple digital shares, each represented as a unique token on the blockchain.

Each token represents a fractional stake in the underlying asset. When the property generates rental income or appreciates in value, the benefits flow proportionally to all token holders. This model mirrors real estate investment trusts but with the added benefits of blockchain: transparency, immediate settlement, and global accessibility.

Our tutorial implements a specific variant where a single property is represented as an NFT collection. The property itself is described through immutable metadata stored on-chain, while each minted token serves as proof of fractional ownership. The economic model is straightforward: participants pay a fixed price in USDT, a stablecoin pegged to the US dollar, to receive a token representing their share.

## Breaking Down the Technology Stack

Before diving into the code, let us understand the technologies that make this possible. The system consists of two major components that work in harmony: the blockchain layer built with Solidity and Hardhat, and the frontend application built with Next.js and modern Web3 libraries.

The blockchain layer runs on Ethereum or compatible networks. Smart contracts written in Solidity define the rules for ownership, payment processing, and metadata management. These contracts are deployed to the blockchain where they execute autonomously without any central authority. OpenZeppelin provides battle-tested implementations of standard token contracts that we build upon, ensuring security and compliance with established specifications.

The frontend layer provides the user interface that makes the system accessible. Built with Next.js, it offers server-side rendering, excellent performance, and a great developer experience. Web3 integration happens through wagmi and RainbowKit, which handle wallet connections, blockchain interactions, and state management. viem serves as the low-level Ethereum library that actually communicates with the blockchain network.

**Simple Analogy:**
- **Blockchain layer** = The secure vault and rulebook (immutable records)
- **Smart contracts** = Automated bankers that follow rules without human intervention
- **Frontend application** = The website or app you actually see and click buttons on
- **Wallet** = Your digital keychain that proves who you are and authorizes transactions

**Breaking it down further:**
- **Solidity** is like writing rules in a special programming language that lives on the blockchain forever
- **Ethereum** is the global computer network that runs these rules
- **Hardhat** is our testing ground - like a practice kitchen where we test recipes before serving
- **Next.js** is the framework that builds the pretty website you interact with
- **Web3 libraries** are translators that help the website talk to the blockchain

## The Smart Contract: Heart of the System

**Simple Explanation:** A smart contract is a digital agreement that lives on the blockchain and automatically enforces the rules. In this case, it's like a robot property manager that handles: (1) creating digital shares, (2) collecting payments, and (3) recording who owns what. No humans needed - the code runs itself.

Let us examine the main smart contract in detail. The BaseErc721PropertyNFT contract is an ERC721 implementation specifically designed for real estate tokenization. Its structure reveals several important patterns that are worth understanding thoroughly.

### Contract Structure and Inheritance

**What this section means:** The contract inherits capabilities from two parent contracts:
- **ERC721** gives it NFT functionality (creating unique tokens)
- **Ownable** gives it owner-only controls (like admin privileges)

The variables track everything: current token ID, maximum supply, price, accepted payment token, and all the property details.

### Simple Explanation of Core Ideas:
- **Token ID**: Each share gets a unique number (0, 1, 2, etc.)
- **Max Supply**: The total number of shares that will ever exist
- **Mint Price**: How much one share costs
- **USDT Token**: The stablecoin used for payment (1 USDT ≈ $1)

```solidity
contract BaseErc721PropertyNFT is ERC721, Ownable {
    uint256 private _nextTokenId;
    uint256 public immutable maxSupply;
    uint256 public mintPrice; 
    IERC20 public usdtToken;
    
    string private _propertyAddress;
    uint256 private _propertyValue;
    string private _propertyType;
    uint256 private _propertyRooms;
    uint256 private _propertyBaths;
    string private _description;
    string private _imageData;
    string private _externalUrl;

    event Purchased(address indexed buyer, uint256 tokenId, uint256 price);
```

The contract inherits from ERC721, which provides the standard NFT functionality, and Ownable, which gives us access control capabilities through the onlyOwner modifier. The inheritance syntax in Solidity allows a contract to inherit multiple base contracts, combining their functionality. The order of inheritance matters for linearization, but in this case both parent contracts are independent.

The state variables store all the information needed to operate the system. The `_nextTokenId` counter tracks which token IDs have been used. Because we start at zero and increment sequentially, we automatically enforce that tokens are unique and ordered by creation time. The `maxSupply` parameter is marked as immutable, meaning it can only be set in the constructor and never changed afterward. This provides gas savings compared to regular storage variables and adds guarantees about the total supply cap.

The `mintPrice` variable holds the cost to purchase a token in wei units. Remember that USDT uses 6 decimals instead of the 18 decimals used by ETH, so this price must be handled carefully when converting between human-readable amounts and internal representation. The `usdtToken` variable stores the address of the ERC20 token that will be used for payments.

Property metadata occupies eight separate variables. This design choice makes updating individual fields straightforward, though it does consume more gas than a packed structure might. The metadata is global rather than per-token, meaning all tokens in this collection share the same property description. This reflects the business model where one property generates multiple fractional ownership tokens.

The Purchased event logs successful transactions. Events in Solidity serve as indexed logs that applications can efficiently filter and retrieve. The indexed `buyer` parameter allows quick lookups of all tokens purchased by a given address, while the tokenId and price provide additional context.

### Constructor: Initializing the Contract

```solidity
constructor(
    address initialOwner,
    string memory name,
    string memory ticker,
    uint256 _maxSupply,
    uint256 _mintPrice,
    address _usdtToken
)
    ERC721(name, ticker)
    Ownable(initialOwner)
{
    maxSupply = _maxSupply;
    mintPrice = _mintPrice;
    usdtToken = IERC20(_usdtToken);
}
```

The constructor runs exactly once when the contract is deployed. It receives several parameters that configure the contract for a specific property. The name and ticker become the NFT collection name and symbol, appearing in wallets and marketplaces. The maximum supply sets an absolute upper bound on how many tokens can ever exist. The mint price determines the cost of each fractional share. The USDT token address specifies which ERC20 token to accept for payment.

Notice how the constructor calls the parent constructors using the unusual syntax where they appear after the constructor declaration but before the opening brace. This is how Solidity handles constructor chaining in multiple inheritance scenarios. The Ownable constructor receives the initial owner address, establishing who has administrative privileges.

### The Minting Functions

Two separate functions exist for creating new tokens, each serving a different purpose and accessible to different callers.

```solidity
function safeMint(address to) public onlyOwner returns (uint256) {
    require(_nextTokenId < maxSupply, "Max supply exceeded");
    uint256 tokenId = _nextTokenId++;
    _safeMint(to, tokenId);
    return tokenId;
}
```

The safeMint function allows the contract owner to create tokens at will. This serves several purposes: initial distribution, promotional giveaways, or creating tokens for later sale through secondary markets. The onlyOwner modifier restricts this powerful function to the designated administrator. The require statement checks whether we have reached the maximum supply limit, reverting the transaction if tokens are no longer available. The `_safeMint` function actually creates the token and assigns it to the recipient address. Using safeMint rather than the simpler _mint provides an additional safety check: if the recipient is a smart contract, it will be queried to ensure it can handle ERC721 tokens properly, preventing accidental loss of tokens to contracts that do not implement the receiver interface.

```solidity
function purchase() public returns (uint256) {
    require(_nextTokenId < maxSupply, "Max supply exceeded");
    
    // Transfer USDT from buyer to owner
    bool transferred = usdtToken.transferFrom(msg.sender, owner(), mintPrice);
    require(transferred, "USDT transfer failed");
    
    uint256 tokenId = _nextTokenId++;
    _safeMint(msg.sender, tokenId);
    
    emit Purchased(msg.sender, tokenId, mintPrice);
    
    return tokenId;
}
```

The purchase function implements the public buying mechanism. Anyone can call this function to buy a token directly. The first requirement checks supply limits as before. Then comes the critical payment step: we call `transferFrom` on the USDT token contract. This ERC20 standard function moves tokens from the caller to the specified recipient. However, this only works if the caller has first approved the NFT contract to spend their tokens. We will examine this two-step approval pattern in more detail later.

The transferFrom function returns a boolean indicating success. The require statement checks this return value; if the transfer failed for any reason (insufficient balance, insufficient allowance, or contract failure), the entire transaction reverts. This pattern follows the Checks-Effects-Interactions principle where we validate conditions before making state changes or external calls. In this function we actually perform the external call before minting, but because USDT is a well-audited standard token and we are only transferring a fixed price, the risk is minimal. More complex contracts might implement reentrancy guards or use the Checks-Effects-Interactions ordering more strictly.

After the payment succeeds, we increment the token ID and mint the token to the purchaser. The Purchased event logs the transaction details for off-chain indexing. Finally, the tokenId is returned to the caller, which can be useful for immediate UI updates without requiring another blockchain query.

### Metadata Management

The contract provides extensive metadata management capabilities through multiple update functions. The batch update function allows changing all property details at once:

```solidity
function updatePropertyMetadata(
    string memory propertyAddress,
    uint256 propertyValue,
    string memory propertyType,
    uint256 propertyRooms,
    uint256 propertyBaths,
    string memory description,
    string memory imageData,
    string memory externalUrl
) public onlyOwner {
    _propertyAddress = propertyAddress;
    _propertyValue = propertyValue;
    _propertyType = propertyType;
    _propertyRooms = propertyRooms;
    _propertyBaths = propertyBaths;
    _description = description;
    _imageData = imageData;
    _externalUrl = externalUrl;
}
```

Individual update functions for each field provide granular control. All these functions are restricted to the contract owner, ensuring that only authorized personnel can modify the property representation. The separation between global property metadata and individual token ownership is an important design choice. All tokens in the collection refer to the same underlying property, so the metadata describing that property is naturally shared. If you wanted each token to represent different properties, you would need to redesign this architecture.

### Token URI and NFT Standards

The tokenURI function generates the metadata that NFT marketplaces and wallets will display. It must return a JSON string conforming to the ERC721 metadata standard, optionally extended with OpenSea attributes:

```solidity
function tokenURI(uint256 tokenId) public view override returns (string memory) {
    require(tokenId < _nextTokenId, "Token does not exist");
    
    string memory json = string(abi.encodePacked(
        '{"name": "Property #', 
        Strings.toString(tokenId), 
        '", "description": "', 
        _description, 
        '", "image": "', 
        _imageData, 
        '", "external_url": "',
        _externalUrl,
        '", "attributes": [',
        '{"trait_type": "Type", "value": "', _propertyType, '"},',
        '{"trait_type": "Value", "value": ', Strings.toString(_propertyValue), '},',
        '{"trait_type": "Address", "value": "', _propertyAddress, '"},',
        '{"trait_type": "Rooms", "value": ', Strings.toString(_propertyRooms), '},',
        '{"trait_type": "Bathrooms", "value": ', Strings.toString(_propertyBaths), '}',
        ']}'
    ));
    
    return json;
}
```

This implementation constructs the JSON directly on-chain using string concatenation. The `abi.encodePacked` function packs multiple strings and values together efficiently, though care must be taken with special characters that could break JSON structure. The `Strings.toString` helper converts numeric values to their string representation. Notice that numeric attributes like property value, rooms, and bathrooms are emitted as numbers in the JSON (without quotes around them) rather than strings, which is correct for NFT attribute standards.

The function first checks that the requested token exists by comparing the tokenId against `_nextTokenId`. Since we only increment token IDs when minting and never reuse them, any tokenId less than the current `_nextTokenId` exists, while any greater or equal does not.

### Getters for Read Access

Numerous getter functions provide read access to contract state:

```solidity
function getPropertyAddress() public view returns (string memory) {
    return _propertyAddress;
}

function getPropertyValue() public view returns (uint256) {
    return _propertyValue;
}

// ... and similar for other fields

function mintPrice() public view returns (uint256) {
    return mintPrice;
}
```

Some variables like `maxSupply` and `mintPrice` are already public, which automatically generates getter functions with matching names. For private state variables, we need to explicitly define view functions to expose their values. This gives us control over naming and allows us to add additional logic later if needed.

## The Mock USDT Token: Testing Payments

**Simple Explanation:** In testing, we don't want to use real money. So we create a "fake USDT" that acts exactly like the real stablecoin but with unlimited supply. This lets us experiment without spending actual dollars. Think of it like using play money in a board game.

The second contract, MockUSDT, serves as a test double for the real USDT token. It implements the ERC20 standard with the correct 6-decimal precision that actual USDT uses.

```solidity
contract MockUSDT is ERC20, Ownable {
    uint8 private constant DECIMALS = 6;

    constructor(address initialOwner) ERC20("Tether USD", "USDT") Ownable(initialOwner) {
        _mint(initialOwner, 1000000 * 10 ** DECIMALS); // 1M USDT
    }

    function decimals() public view virtual override returns (uint8) {
        return DECIMALS;
    }

    function mint(address to, uint256 amount) public onlyOwner {
        _mint(to, amount);
    }
}
```

This mock token demonstrates several important patterns. The `decimals` function overrides the default 18 decimals from ERC20 to return 6, which matches the real USDT implementation. The constructor mints an initial supply of one million tokens to the deployer, giving us plenty of test currency. The additional `mint` function allows the owner to create more tokens as needed during testing, which is invaluable for simulating various user scenarios.

In a production deployment, you would use the actual USDT token address on your chosen network. For testing and educational purposes, the mock provides full control and eliminates dependencies on external systems.

## Testing Strategy: Ensuring Correct Behavior

**Why We Test:** Smart contracts are immutable once deployed. If there's a bug, real money could be lost. Testing is like practicing every possible scenario with pretend money first. The test suite here has 35 different test cases covering: successful purchases, failed payments, access controls, and edge cases. Passing all tests gives us confidence the system works as intended.

The test file contains 606 lines across 35 individual tests organized into nine categories. This comprehensive test suite serves both as verification and as documentation of expected behavior.

```javascript
describe("BaseErc721PropertyNFT", function () {
  let BaseErc721PropertyNFT;
  let MockUSDT;
  let baseErc721PropertyNFT;
  let usdt;
  let owner;
  let nonOwner;
  let anotherUser;

  const NAME = "TestPropertyNFT";
  const SYMBOL = "TPNFT";
  const MAX_SUPPLY = 100;
  const MINT_PRICE_USDT = ethers.parseUnits("100", 6); // 100 USDT (6 decimals)
```

The test setup follows the Arrange-Act-Assert pattern consistently. Before each test group, the `beforeEach` hook deploys fresh contract instances, ensuring test isolation. The `ethers.parseUnits("100", 6)` call shows the correct way to handle token decimals: convert human-readable amounts to the smallest unit by specifying the token's decimal places. Hardhat's ethers.js integration provides this utility.

The deployment of the NFT contract passes the USDT token address as a constructor argument, establishing the dependency between the two contracts. Tests then proceed to verify each aspect of system behavior:

### Deployment Tests

These verify that the constructor correctly initializes all parameters:

```javascript
it("Should set the correct name and symbol", async function () {
    expect(await baseErc721PropertyNFT.name()).to.equal(NAME);
    expect(await baseErc721PropertyNFT.symbol()).to.equal(SYMBOL);
});

it("Should set the correct max supply", async function () {
    expect(await baseErc721PropertyNFT.maxSupply()).to.equal(MAX_SUPPLY);
});
```

### Owner Minting Tests

These validate the safeMint function's behavior, including access control, token ID sequencing, and supply limits:

```javascript
it("Should mint a token to the owner (onlyOwner)", async function () {
    await expect(baseErc721PropertyNFT.connect(nonOwner).safeMint(nonOwner.address))
        .to.be.reverted; // Only owner can mint

    const tx = await baseErc721PropertyNFT.safeMint(nonOwner.address);
    await tx.wait();

    expect(await baseErc721PropertyNFT.ownerOf(0)).to.equal(nonOwner.address);
    expect(await baseErc721PropertyNFT.balanceOf(nonOwner.address)).to.equal(1);
});
```

The test first checks that a non-owner cannot mint (expecting a revert), then actually performs a mint and verifies that token ID zero is assigned to the recipient. Testing both success and failure paths is crucial.

### Purchase Tests

The most extensive category covers the public purchase flow. These tests examine the complete interaction where a user with USDT tokens buys an NFT:

```javascript
it("Should allow anyone to purchase a token with correct USDT payment", async function () {
    const purchasePrice = await baseErc721PropertyNFT.mintPrice();

    await expect(baseErc721PropertyNFT.connect(nonOwner).purchase())
        .to.emit(baseErc721PropertyNFT, "Purchased")
        .withArgs(nonOwner.address, 0, purchasePrice)
        .and.to.emit(baseErc721PropertyNFT, "Transfer")
        .withArgs(ethers.ZeroAddress, nonOwner.address, 0);

    expect(await baseErc721PropertyNFT.ownerOf(0)).to.equal(nonOwner.address);
    expect(await baseErc721PropertyNFT.balanceOf(nonOwner.address)).to.equal(1);
});
```

This test simultaneously verifies the Purchased event emissions and checks that the standard Transfer event also occurs. ERC721 expects Transfer events for all ownership changes, including minting from the zero address. The chain of assertions proves that payment processing, token creation, and event emission all happen correctly.

The tests also cover failure scenarios:

```javascript
it("Should reject if insufficient USDT allowance", async function () {
    // Revoke allowance
    await usdt.connect(nonOwner).approve(
        await baseErc721PropertyNFT.getAddress(),
        0
    );

    await expect(
        baseErc721PropertyNFT.connect(nonOwner).purchase()
    ).to.be.revertedWithCustomError(usdt, "ERC20InsufficientAllowance");
});
```

This test reveals the two-step approval pattern's importance. The user must first call approve on the USDT token, granting the NFT contract permission to spend their tokens. Without this, transferFrom fails with a specific error.

The balance change test proves that money actually moves:

```javascript
it("Should transfer USDT from buyer to owner upon purchase", async function () {
    const purchasePrice = await baseErc721PropertyNFT.mintPrice();
    const ownerUSDTBefore = await usdt.balanceOf(owner.address);
    const buyerUSDTBefore = await usdt.balanceOf(nonOwner.address);

    await baseErc721PropertyNFT.connect(nonOwner).purchase();

    const ownerUSDTAfter = await usdt.balanceOf(owner.address);
    const buyerUSDTAfter = await usdt.balanceOf(nonOwner.address);

    expect(ownerUSDTAfter - ownerUSDTBefore).to.equal(purchasePrice);
    expect(buyerUSDTBefore - buyerUSDTAfter).to.equal(purchasePrice);
});
```

### Metadata Tests

These verify that property information can be set and retrieved correctly:

```javascript
it("Should update all property metadata (onlyOwner)", async function () {
    await expect(
        baseErc721PropertyNFT.connect(nonOwner).updatePropertyMetadata(...)
    ).to.be.reverted;

    const tx = await baseErc721PropertyNFT.updatePropertyMetadata(...);
    await tx.wait();

    expect(await baseErc721PropertyNFT.getPropertyAddress()).to.equal(PROPERTY_ADDRESS);
    expect(await baseErc721PropertyNFT.getPropertyValue()).to.equal(PROPERTY_VALUE);
    // ... more assertions
});
```

The tests check access control first, then verify each getter returns the updated values. Individual update functions receive similar treatment.

### Token URI Tests

These ensure that the JSON metadata format matches what NFT platforms expect:

```javascript
it("Should return correct JSON format with updated metadata", async function () {
    await baseErc721PropertyNFT.safeMint(nonOwner.address);
    await baseErc721PropertyNFT.updatePropertyMetadata(...);

    const tokenURI = await baseErc721PropertyNFT.tokenURI(0);
    const parsed = JSON.parse(tokenURI);

    expect(parsed.name).to.equal("Property #0");
    expect(parsed.description).to.equal(DESCRIPTION);
    expect(parsed.attributes).to.be.an("array").with.lengthOf(5);

    expect(parsed.attributes[0]).to.deep.equal({
        trait_type: "Type",
        value: PROPERTY_TYPE
    });
    // ... more attribute checks
});
```

Parsing the returned JSON and asserting on its structure proves that the on-chain string construction produces valid, well-formed metadata.

### Edge Cases

The final category tests behaviors that might not be obvious:

```javascript
it("Should maintain metadata separately from token existence", async function () {
    await baseErc721PropertyNFT.updatePropertyMetadata("Address 1", ...);
    await baseErc721PropertyNFT.safeMint(nonOwner.address);
    let tokenURI = await baseErc721PropertyNFT.tokenURI(0);
    expect(tokenURI).to.include("Address 1");

    // Update metadata after minting
    await baseErc721PropertyNFT.updatePropertyMetadata("Address 2", ...);

    // New token should have new metadata (since it's global)
    await baseErc721PropertyNFT.safeMint(anotherUser.address);
    tokenURI = await baseErc721PropertyNFT.tokenURI(1);
    expect(tokenURI).to.include("Address 2");
});
```

This test confirms that property metadata is indeed global: changing it affects all subsequently minted tokens but does not retroactively change already-minted tokens. This behavior matches the intended design where the property description might evolve over time.

## The Frontend Application: Making Blockchain Accessible

**Simple Explanation:** Most people don't want to type commands or understand code. They want a website with buttons and clear information. This frontend translates the complex blockchain into a simple dashboard: it shows your balance, lets you click "Approve" and "Buy", and displays your property details in plain English. It's the friendly face of the technology.

The Next.js application brings the smart contract to life with a user-friendly interface. Let us examine its architecture and key patterns.

### Project Structure

The frontend follows Next.js Pages Router conventions with TypeScript for type safety. The most important files include:

- `pages/index.tsx`: Main dashboard component (499 lines)
- `hooks/usePropertyNft.ts`: Custom hook for NFT contract interactions (139 lines)
- `hooks/useMockUsdt.ts`: Custom hook for USDT token interactions (98 lines)
- `contracts/propertyNFT.ts` and `contracts/mockUSDT.ts`: Type-safe contract wrappers
- `styles/Home.module.css`: Scoped styling with CSS modules

### Web3 Configuration

The wagmi configuration in `wagmi.ts` sets up the blockchain connection:

```typescript
import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import { sepolia } from 'wagmi/chains';

export const config = getDefaultConfig({
    appName: 'RainbowKit App',
    projectId: 'YOUR_PROJECT_ID',
    chains: [sepolia],
    ssr: true,
});
```

The configuration specifies that we will interact with the Sepolia testnet, an Ethereum network used for testing with free fake ETH. The `ssr: true` setting enables server-side rendering compatibility, which is important for Next.js applications that might render on the server. The projectId comes from WalletConnect Cloud and enables mobile wallet connections.

The React provider structure in `_app.tsx` wraps the entire application:

```typescript
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { WagmiProvider } from 'wagmi';
import { RainbowKitProvider } from '@rainbow-me/rainbowkit';

const client = new QueryClient();

function MyApp({ Component, pageProps }: AppProps) {
    return (
        <WagmiProvider config={config}>
            <QueryClientProvider client={client}>
                <RainbowKitProvider>
                    <Component {...pageProps} />
                </RainbowKitProvider>
            </QueryClientProvider>
        </WagmiProvider>
    );
}
```

The nesting order matters: Wagmi must be outermost because it provides context that RainbowKit relies on. TanStack Query manages data fetching and caching separately. This architecture separates concerns while allowing all components to access the necessary context.

### Custom Hook Pattern

The `usePropertyNft` hook demonstrates an excellent pattern for blockchain interactions:

```typescript
export const usePropertyNft = () => {
    const { writeContract, data: hash, error, isPending } = useWriteContract();
    const { isLoading: isWaitingForTransaction, isSuccess } = useWaitForTransactionReceipt({ hash });

    // Read hooks for all contract getters
    const name = useReadContract({ address, abi, functionName: 'name' });
    const maxSupply = useReadContract({ address, abi, functionName: 'maxSupply' });
    const propertyAddress = useReadContract({ address, abi, functionName: 'getPropertyAddress' });
    // ... more read hooks

    return {
        name: name.data as string | undefined,
        maxSupply: maxSupply.data as bigint | undefined,
        // ... mapped data with type assertions
        purchase: () => writeContract({ address, abi, functionName: 'purchase' }),
        // ... other actions
    };
};
```

This pattern consolidates all contract interactions into a single reusable hook. The `useReadContract` hook automatically handles caching, loading states, and error management for view functions. The `useWriteContract` hook manages transaction submission, while `useWaitForTransactionReceipt` polls for confirmation. Type assertions (`as string | undefined`) bridge the gap between wagmi's generic return types and our specific contract interface.

The hook returns both the data and the status flags, allowing the UI to react appropriately to loading states, errors, and success conditions.

### Main Dashboard Layout

The `index.tsx` component renders a comprehensive dashboard organized into logical sections:

1. **Header**: Contains the application title and the RainbowKit ConnectButton for wallet connection.
2. **Portfolio Overview**: Displays the connected user's NFT count, USDT balance, total supply, and mint price in a grid of statistics.
3. **Minting Interface**: Shows purchase information and provides buttons for approval and minting.
4. **Property Details**: Presents the property metadata including image, address, value, rooms, bathrooms, and description.
5. **Contract Information**: Shows deployment addresses and token details.
6. **Recent Transactions**: Lists the last five user transactions with timestamps.

The component heavily uses conditional rendering based on `isConnected` to show different content before and after wallet connection. The approval and minting logic implements a state machine:

```typescript
const isAllowanceSufficient = allowance && mintPrice && usdtDecimals
    ? Number(allowance) >= Number(mintPrice)
    : false;
```

When allowance is insufficient, the interface shows an "Approve USDT" button that triggers the token approval transaction. After approval succeeds, the allowance increases and the interface automatically switches to show the "Mint NFT Now" button. This two-step flow is necessary because ERC20 tokens require prior authorization before a contract can spend them.

### Transaction Handling

The component maintains a `transactions` state array that tracks recent activity:

```typescript
const [transactions, setTransactions] = useState<Array<{type: string; hash: string; time: Date}>>([]);
```

Effects monitor the success states from both purchase and approval operations:

```typescript
useEffect(() => {
    if (isSuccess && hash) {
        setTransactions(prev => [{
            type: 'Mint NFT',
            hash,
            time: new Date()
        }, ...prev].slice(0, 5));
        
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
    }
}, [isSuccess, hash, queryClient]);
```

This pattern accomplishes two purposes: it displays recent transactions to the user, and it invalidates cached USDT balance data so the UI refreshes to show the new balance after a purchase. The query invalidation uses a predicate function to selectively target only balance queries for the USDT token, leaving other cached data untouched.

### Number Formatting

The component includes utility functions to convert token amounts from their raw wei representation to human-readable USDT amounts:

```typescript
const formatUSDT = (value: bigint | undefined, decimals: bigint | undefined) => {
    if (!value || !decimals) return '0';
    const formattedValue = (Number(value) / Math.pow(10, Number(decimals))).toFixed(2);
    const numberValue = parseFloat(formattedValue);
    return numberValue.toLocaleString('en-US', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    });
};
```

This conversion handles the division by 10^decimals to convert from the smallest token unit to the display unit, then formats with exactly two decimal places and comma separators for thousands.

## Running the Project: Step-by-Step Guide

**What We're Doing:** This section is the setup manual. We'll install software, deploy the smart contract to a test blockchain (so we're not using real money), start the website, and walk through buying your first share. Think of it as assembling furniture - follow the steps and you'll have a working system.

Now let us walk through the complete process of getting this project running on your local machine. This guide assumes you have no prior experience with blockchain development but can follow basic command line instructions.

### Prerequisites Installation

First, ensure Node.js version 18 or later is installed. You can verify by running:

```bash
node --version
```

If the output shows a version earlier than 18, visit nodejs.org to download the latest LTS version. Node.js includes npm, the package manager we will use to install dependencies.

### Smart Contract Setup

Navigate to the `hardhat2` directory and install the required packages:

```bash
cd hardhat2
npm install
```

This reads the `package.json` file and downloads all dependencies into a `node_modules` folder. The project relies on Hardhat for compilation and testing, OpenZeppelin for secure contract templates, and various Hardhat plugins for verification, coverage, and gas reporting.

Create an environment configuration file by copying the example:

```bash
cp .env.example .env
```

Then edit the `.env` file to add your Sepolia RPC endpoint and private key. You can obtain a free RPC URL from services like Alchemy or Infura by creating a project and selecting the Sepolia network. Your private key should come from a cryptocurrency wallet like MetaMask. **Important**: Use a wallet that contains only test ETH on Sepolia, never a wallet with real funds. You can get free test ETH from a faucet such as sepoliafaucet.com.

The `.env` file should look like:

```
SEPOLIA_RPC_URL=https://eth-sepolia.g.alchemy.com/v2/your-api-key
PRIVATE_KEY=abc123def456... (your 64-character hex string without 0x prefix)
ETHERSCAN_API_KEY=YourEtherscanAPIKey
```

Compile the contracts to check for syntax errors and generate the artifact files:

```bash
npx hardhat compile
```

You should see output showing compilation of both contracts. The compiled bytecode and ABI (Application Binary Interface) are saved in the `artifacts` directory. These artifacts are essential for both testing and frontend integration.

### Running Tests

Execute the comprehensive test suite:

```bash
npx hardhat test
```

Watch as the terminal displays each test's progress. You should see 35 tests passing. The tests cover every important function and edge case in the contract. If any test fails, the output will indicate which assertion failed and why. This immediate feedback is invaluable during development.

For a coverage report showing what percentage of your contract code is exercised by tests:

```bash
npx hardhat coverage
```

The coverage report generates an HTML file you can open in a browser, highlighting which lines are covered by tests and which remain untested.

### Local Deployment

Start a local Ethereum node for development:

```bash
npx hardhat node
```

This command starts a local blockchain that mimics Ethereum but uses fake accounts with unlimited test ETH. The node runs on http://127.0.0.1:8545 and will display the accounts and their private keys in the terminal. Keep this process running in one terminal window.

In another terminal, deploy the contracts to your local network:

```bash
cd hardhat2
npx hardhat ignition:deploy ./ignition/modules/BaseErc721PropertyNFT.ts --network localhost
```

Hardhat Ignition provides a declarative deployment system that tracks deployed contracts and their relationships. The deployment will output the contract addresses. Make note of these addresses, as you will need them for frontend configuration.

The deployment also records the addresses in `ignition/deployments/chain-31337/deployed_addresses.json` for reproducibility.

### Frontend Setup

Switch to the `nextjs` directory and install dependencies:

```bash
cd ../nextjs
npm install
```

Create a `.env.local` file from the example:

```bash
cp .env.example .env.local
```

Edit `.env.local` to include your deployed contract addresses:

```
NEXT_PUBLIC_PROPERTY_NFT_ADDRESS=0x5FbDB2315678afecb367f032d93F642f64180aa3
NEXT_PUBLIC_MOCK_USDT_ADDRESS=0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512
```

These are example addresses from the localhost deployment; use the actual addresses from your deployment output.

You also need a WalletConnect Project ID to enable wallet connections. Register for free at walletconnect.com/cloud and create a new project. Then add this to your `.env.local`:

```
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=your-project-id-here
```

Update the `wagmi.ts` file to use this environment variable for the projectId setting.

### Starting the Frontend

Run the development server:

```bash
npm run dev
```

Open your browser to http://localhost:3000. You should see the dashboard interface. Click the "Connect Wallet" button in the top right to connect your Web3 wallet. Make sure your wallet is configured to use the localhost network (or Sepolia if you deployed there).

The dashboard will load and display the property details, contract information, and your balances. You can now interact with the system.

### Making a Test Purchase

To test the complete purchase flow:

1. Ensure you are connected to the same network where the contracts are deployed.
2. Verify you have test ETH for gas fees (if on localhost, use one of the accounts shown by `npx hardhat node`; import its private key into your wallet).
3. Check that your wallet shows some USDT balance. If using the mock USDT, you may need to mint tokens to your address by calling the `mint` function. For simplicity, you could add a minting function to the frontend or use a test script.
4. Click "Approve USDT" to authorize the NFT contract to spend your tokens. Confirm the transaction in your wallet.
5. After approval completes, the button changes to "Mint NFT Now". Click it to purchase a token.
6. Confirm the second transaction. Upon success, you should see a success message and your NFT balance should increase to 1.

View the minted NFT in your wallet by switching to the NFTs tab. You may need to add the NFT contract address manually if your wallet does not auto-detect it.

### The Purchase Lifecycle: Step-by-Step Visual Guide

The actual purchase process involves a clear sequence of interactions between the user, wallet, and smart contracts. Let's examine each step with visual references from a typical testnet transaction.

#### Step 1: Approving USDT Token

Before the NFT contract can transfer your USDT tokens, you must first grant it permission. This is done through the standard ERC20 `approve` function. Click the "Approve USDT" button in your wallet interface to authorize the spending.

![Approving USDT for purchase](./images/screenshot_approving_purchase.png)

This approval transaction costs gas and creates an allowance entry in the USDT token contract, allowing the NFT contract to spend up to the specified amount from your wallet.

#### Step 2: Purchasing Tokens

Once the approval transaction confirms, the interface switches to show the "Mint NFT Now" button. Clicking this triggers the purchase function, which calls `transferFrom` on the USDT contract to move the required payment to the contract owner, then mints the NFT to your address.

![Purchasing tokens](./images/screenshot_purchasing.png)

The purchase transaction executes two critical operations atomically: the USDT transfer and the NFT minting. Both succeed or fail together, ensuring consistency.

#### Step 3: Viewing Minted Tokens in Wallet

After the transaction confirms (typically within seconds on testnet), the newly minted NFT appears in your wallet under the NFTs tab. Each token represents your fractional ownership stake in the property.

![Minted tokens in wallet](./images/screenshot_final_minted_tokens.png)

The wallet may require a manual refresh to detect the new NFT. You can add the NFT contract address to your wallet's watch list if it doesn't appear automatically.

#### Step 4: Transaction Details on Block Explorer

Every blockchain transaction is permanently recorded and publicly viewable. You can examine the complete transaction details, including gas costs, timestamps, and internal calls, using a block explorer like Etherscan.

![Transaction details](./images/purchase_transaction.png)

[View on Sepolia Etherscan](https://sepolia.etherscan.io/tx/0x83e90fca156ee8bf93fddc33a4dcbce9eda83d36f1ce6ea5c97d38ac1bd2400e)

The transaction log shows all events emitted during the purchase, including the Transfer event (NFT minting) and the ERC20 Approval and Transfer events. This transparency is a key benefit of blockchain technology.

### Testnet Deployment

When you are ready to deploy to Sepolia testnet, you will need real test ETH from a faucet. Update your `.env` with a Sepolia RPC URL and your private key containing test ETH. Then run:

```bash
npx hardhat ignition:deploy ./ignition/modules/BaseErc721PropertyNFT.ts --network sepolia
```

Take note of the deployed addresses and update your frontend `.env.local` to point to Sepolia contracts. You can then deploy the frontend to Vercel or any hosting service to make it publicly accessible.

## Understanding the Payment Flow in Depth

**The Two-Key Problem:** Imagine you give your friend a key to your house so they can water plants while you're away. But you don't want them to have unlimited access. So you give them a key that only works on certain days. Blockchain payments work similarly - you must first give permission (the "key") before someone can take your money.

The two-step approval mechanism used in this system deserves special attention because it represents a fundamental pattern in ERC20 interactions.

When a user wants to purchase an NFT using USDT, the NFT contract needs to transfer tokens from the user's wallet to the owner's wallet. However, the user's wallet is controlled by their private key, not by the NFT contract. The ERC20 standard addresses this through an authorization system.

The first step is approval: the user calls `usdt.approve(nftContractAddress, amount)`. This tells the USDT token contract: "Allow the specified address to spend up to amount tokens from my account." The token contract records this allowance in its storage, mapping from the spender address to the allowed amount.

The second step is purchase: the user calls `nft.purchase()`. Inside this function, the NFT contract calls `usdt.transferFrom(userAddress, ownerAddress, mintPrice)`. The token contract checks whether the NFT contract's allowance for the user is at least mintPrice. If so, it executes the transfer, moving tokens from user to owner.

This pattern has several advantages. The user can set an exact spending limit, revoke the allowance at any time, and review the allowance amount before approving. The approval transaction itself costs gas, but subsequent purchases from the same allowance do not require re-approval until the allowance is exhausted or changed.

In our frontend, we check the allowance before deciding which button to show. If `allowance < mintPrice`, we display the approval button. If `allowance >= mintPrice`, we show the purchase button. After an approval transaction completes, we immediately refetch the allowance to reflect the new value, then the UI switches to the purchase button.

## Security Considerations

While this educational project demonstrates correct patterns, a production deployment would require additional safeguards.

The contract implements access control through Ownable, but it does not include a timelock for administrative functions. In production, any function that can change critical parameters like mint price or property metadata should have a delay between proposal and execution, giving users time to react.

Emergency pause functionality would allow administrators to suspend operations if something goes wrong. This typically involves a Pausable modifier that can be toggled by a multisig wallet or governance system.

The minting function uses `_safeMint`, which protects against accidental token loss to non-receiver contracts. However, the purchase function could be vulnerable to reentrancy if the USDT token were malicious. In this case we are using a standard token, but a more defensive approach would use a reentrancy guard or follow Checks-Effects-Interactions more strictly.

The global metadata design means that all tokens share the same property information. If you needed per-token uniqueness, you would redesign the metadata storage. The current design suits fractional ownership of a single property but cannot represent multiple distinct properties in one collection.

## Extending the Project

This tutorial provides a complete working system, but numerous enhancements are possible. You might add a function to withdraw collected USDT from the contract to the owner, implementing a revenue collection mechanism. You could create a mechanism for distributing rental income proportionally to all token holders, requiring calculation of each holder's percentage and iteration through all owners.

Enhancing the metadata to include per-token uniqueness would enable representing multiple properties. This would involve storing property details in a mapping keyed by token ID rather than as global variables. You might also integrate with decentralized storage solutions like IPFS or Arweave for larger image files and detailed property documentation.

The frontend could be expanded with pagination for large collections, filtering and sorting capabilities, and integration with NFT marketplaces like OpenSea via their API. Adding historical price charts, tenant information, and financial statements would make this a full-featured real estate investment platform.

## Conclusion: Your Journey Begins

This tutorial has walked you through a complete decentralized application for fractional real estate tokenization. You have seen how smart contracts define the rules of ownership and payment, how tests ensure correctness, and how a modern web application makes blockchain functionality accessible to ordinary users.

The concepts covered here extend beyond this specific project. The patterns of ERC721 and ERC20 integration, two-step approvals, custom hooks for blockchain interactions, and comprehensive testing apply to countless other Web3 applications. Understanding this codebase gives you a solid foundation for building your own tokenization projects, whether for real estate, art, intellectual property, or any other asset class.

Remember that blockchain development requires both technical precision and thoughtful security design. Always test thoroughly on testnets before considering any mainnet deployment. Consider professional audits for production systems handling real value. The tools and patterns you've learned here will serve you well as you continue exploring the intersection of finance and technology.

The code is ready to run, modify, and extend. Experiment with changing the property details. Adjust the mint price. Add new features. The best way to learn is by building. Good luck on your journey into decentralized real estate tokenization.

---

## Quick Reference Glossary

**Tokenization**: Converting a physical asset (like a building) into digital tokens that represent ownership shares.

**Fractional Ownership**: Owning a small percentage of an asset rather than the whole thing.

**Blockchain**: A secure, decentralized digital ledger that records transactions permanently.

**NFT (Non-Fungible Token)**: A unique digital certificate proving ownership of a specific item or share.

**Smart Contract**: Self-executing code that automatically enforces agreements without intermediaries.

**ERC721**: A standard for creating NFTs on Ethereum.

**ERC20**: A standard for creating fungible tokens (like currencies) on Ethereum.

**Solidity**: The programming language used to write Ethereum smart contracts.

**Hardhat**: A development environment for building and testing Ethereum applications.

**MetaMask**: A digital wallet that lets you interact with blockchain applications.

**Gas Fee**: The small payment required to execute transactions on the blockchain.

**Testnet**: A practice blockchain where you can experiment with fake money.

**DApp (Decentralized Application)**: An application that runs on a blockchain instead of a central server.

**Wagmi/RainbowKit**: Tools that help websites connect to users' crypto wallets.

**Decimals**: The number of decimal places a token uses (USDT uses 6, ETH uses 18).