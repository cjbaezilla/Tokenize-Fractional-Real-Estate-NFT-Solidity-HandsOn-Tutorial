# Smart Contract Documentation

## BaseErc721PropertyNFT.sol

### Overview
BaseErc721PropertyNFT is an ERC721-compliant NFT contract for tokenizing real estate properties. It supports purchasing properties with USDT and stores comprehensive property metadata.

### Inherited Contracts
- **ERC721**: Standard NFT functionality
- **Ownable**: Ownership control with initial owner set at deployment

### State Variables

#### Public/Immutable
- `maxSupply` (uint256, immutable): Maximum number of tokens that can be minted
- `mintPrice` (uint256): Price in wei for purchasing a property token (6 decimals for USDT)
- `usdtToken` (IERC20): Address of the USDT token contract for payments

#### Private Property Metadata
- `_propertyAddress` (string): Physical address of the property
- `_propertyValue` (uint256): Monetary value of the property
- `_propertyType` (string): Type of property (e.g., "House", "Apartment")
- `_propertyRooms` (uint256): Number of rooms
- `_propertyBaths` (uint256): Number of bathrooms
- `_description` (string): Description of the property
- `_imageData` (string): IPFS hash or URL to property image
- `_externalUrl` (string): External link to property details
- `_nextTokenId` (uint256, private): Counter for token IDs

### Events

#### Purchased
```solidity
event Purchased(address indexed buyer, uint256 tokenId, uint256 price);
```
- Emitted when a property is successfully purchased
- Parameters:
  - `buyer`: Address of the purchaser
  - `tokenId`: ID of the minted token
  - `price`: Purchase price in wei

### Constructor
```solidity
constructor(
    address initialOwner,
    string memory name,
    string memory ticker,
    uint256 _maxSupply,
    uint256 _mintPrice,
    address _usdtToken
)
```
- Initializes the ERC721 and Ownable contracts
- Sets initial parameters for the NFT collection
- Parameters:
  - `initialOwner`: Owner address with administrative privileges
  - `name`: Name of the NFT collection
  - `ticker`: Token symbol
  - `_maxSupply`: Maximum number of tokens
  - `_mintPrice`: Purchase price per token
  - `_usdtToken`: USDT token contract address

### Write Functions (State-Changing)

#### safeMint
```solidity
function safeMint(address to) public onlyOwner returns (uint256)
```
- Mint a new token to specified address (owner only)
- Returns the minted token ID
- Requirements: `_nextTokenId < maxSupply`

#### purchase
```solidity
function purchase() public returns (uint256)
```
- Purchase a property token with USDT
- Transfers `mintPrice` USDT from buyer to contract owner
- Mints token to `msg.sender`
- Returns the minted token ID
- Requirements: `_nextTokenId < maxSupply`, USDT transfer must succeed

#### updatePropertyMetadata
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
) public onlyOwner
```
- Update all property metadata fields at once (owner only)

#### Individual Metadata Update Functions (Owner Only)
- `updatePropertyAddress(string memory propertyAddress)`
- `updatePropertyValue(uint256 propertyValue)`
- `updatePropertyType(string memory propertyType)`
- `updatePropertyRooms(uint256 propertyRooms)`
- `updatePropertyBaths(uint256 propertyBaths)`
- `updateDescription(string memory description)`
- `updateImageData(string memory imageData)`
- `updateExternalUrl(string memory externalUrl)`

#### setMintPrice
```solidity
function setMintPrice(uint256 _mintPrice) public onlyOwner
```
- Update the minting price (owner only)

### Read/View Functions (State-Querying)

#### ERC721 Standard Functions
- `balanceOf(address owner)`: Returns number of tokens owned by address
- `ownerOf(uint256 tokenId)`: Returns owner of specified token
- `approve(address to, uint256 tokenId)`: Approve token for transfer
- `getApproved(uint256 tokenId)`: Get approved address for token
- `setApprovalForAll(address operator, bool approved)`: Set operator approvals
- `isApprovedForAll(address owner, address operator)`: Check approval status
- `transferFrom(address from, address to, uint256 tokenId)`: Transfer token (requires approval)
- `safeTransferFrom(address from, address to, uint256 tokenId)`: Safe transfer
- `safeTransferFrom(address from, address to, uint256 tokenId, bytes memory data)`: Safe transfer with data

#### Property Metadata Getters
- `getPropertyAddress()`: Returns property address (string)
- `getPropertyValue()`: Returns property value (uint256)
- `getPropertyType()`: Returns property type (string)
- `getPropertyRooms()`: Returns number of rooms (uint256)
- `getPropertyBaths()`: Returns number of bathrooms (uint256)
- `getDescription()`: Returns property description (string)
- `getImageData()`: Returns image data/URL (string)
- `getExternalUrl()`: Returns external URL (string)

#### Token Metadata
- `tokenURI(uint256 tokenId)`: Returns JSON metadata for token (includes all property metadata)
- `totalSupply()`: Returns total number of minted tokens
- `name()`: Returns NFT collection name
- `symbol()`: Returns NFT ticker symbol

#### Contract Info
- `usdtToken()`: Returns USDT token address
- `maxSupply()`: Returns maximum token supply
- `mintPrice()`: Returns current minting price

---

## MockUSDT.sol

### Overview
MockUSDT is a mock implementation of the USDT (Tether USD) ERC20 token for testing purposes. It has 6 decimals and allows the owner to mint additional tokens.

### Inherited Contracts
- **ERC20**: Standard token functionality
- **Ownable**: Ownership control

### State Variables

#### Constants
- `DECIMALS` (uint8, private constant): Fixed at 6 (standard for USDT)

#### Inherited
- `name()`: Returns "Tether USD"
- `symbol()`: Returns "USDT"
- `totalSupply()`: Total supply of tokens

### Constructor
```solidity
constructor(address initialOwner) 
```
- Creates 1,000,000 USDT (with 6 decimals = 1,000,000 * 10^6 units) and assigns to `initialOwner`

### Write Functions (State-Changing)

#### mint
```solidity
function mint(address to, uint256 amount) public onlyOwner
```
- Mint new USDT tokens to specified address
- Only callable by contract owner
- `amount` is in smallest unit (with 6 decimals)

### Read/View Functions (State-Querying)

#### decimals
```solidity
function decimals() public view virtual override returns (uint8)
```
- Returns token decimals: 6

#### Standard ERC20 Functions
- `balanceOf(address account)`: Returns token balance of account
- `transfer(address recipient, uint256 amount)`: Transfer tokens
- `allowance(address owner, address spender)`: Returns spending allowance
- `approve(address spender, uint256 amount)`: Approve spender
- `transferFrom(address sender, address recipient, uint256 amount)`: Transfer from using allowance
- `increaseAllowance(address spender, uint256 addedValue)`: Increase allowance
- `decreaseAllowance(address spender, uint256 subtractedValue)`: Decrease allowance

#### Events (ERC20 Standard)
- `Transfer(address indexed from, address indexed to, uint256 value)`
- `Approval(address indexed owner, address indexed spender, uint256 value)`

---

## Usage Notes

### BaseErc721PropertyNFT
1. **Purchasing Flow**: Users must first approve USDT transfers to the contract, then call `purchase()` to mint a token
2. **Metadata**: All token metadata is stored at the contract level (not per-token). All NFTs share the same property information
3. **Owner Controls**: Only owner can update property metadata and mint tokens via `safeMint()`
4. **TokenURI**: Returns a JSON object with property attributes formatted for NFT marketplaces

### MockUSDT
1. **Decimals**: Uses 6 decimals like real USDT. Amounts are in wei-equivalent units (1 USDT = 1,000,000 units)
2. **Testing**: Provides minting capability to simulate USDT for testing purchases
3. **Initial Supply**: Deploys with 1M USDT assigned to the initial owner

### Integration
- The BaseErc721PropertyNFT contract expects the `usdtToken` address to be a valid ERC20 token
- The `purchase()` function calls `usdtToken.transferFrom()` to receive payment
- For production use, replace MockUSDT with real USDT or another ERC20 token
