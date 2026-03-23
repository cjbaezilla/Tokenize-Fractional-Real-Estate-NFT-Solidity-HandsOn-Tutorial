# Fractional Real Estate NFT - Hardhat Project

> ⚠️ **Educational Purpose Only** - This is a hands-on learning project for tutorial purposes. **Not production-ready**.

Solidity smart contracts for fractional real estate tokenization using Hardhat development environment.

## 🏗️ Project Structure

```
hardhat2/
├── contracts/          # Solidity smart contracts
│   ├── BaseErc721PropertyNFT.sol
│   └── MockUSDT.sol
├── ignition/           # Hardhat Ignition deployment modules
│   └── modules/
│       ├── BaseErc721PropertyNFT.ts
│       └── MockUSDT.ts
├── test/               # JavaScript test files
│   └── BaseErc721PropertyNFT.test.js
├── .env.example        # Environment variables template
├── .env                # Environment variables (gitignored)
├── hardhat.config.js   # Hardhat configuration
├── package.json        # Dependencies and scripts
└── README.md           # This file
```

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ and npm
- Git

### Installation

```bash
# Install dependencies
npm install

# Copy environment file
cp .env.example .env
```

### Configure Environment

Edit `.env` with your configuration:

```env
# RPC URL (Sepolia testnet or localhost)
SEPOLIA_RPC_URL=https://sepolia.infura.io/v3/YOUR_INFURA_PROJECT_ID

# Private key for deployment (without 0x prefix)
PRIVATE_KEY=your_private_key_here

# Etherscan API key for contract verification
ETHERSCAN_API_KEY=YourEtherscanApiKey

# Optional: CoinMarketCap API key for token price feeds
COINMARKETCAP_API_KEY=your_cmc_api_key
```

## 🛠️ Commands

### Compilation

```bash
# Compile all contracts
npx hardhat compile

# Clean compilation artifacts
npx hardhat clean
```

### Testing

```bash
# Run all tests
npx hardhat test

# Run specific test file
npx hardhat test test/BaseErc721PropertyNFT.test.js

# Run with verbose output
npx hardhat test --verbose

# Generate coverage report
npx hardhat coverage
```

### Local Network

```bash
# Start local Hardhat node (in one terminal)
npx hardhat node

# Deploy to localhost (in another terminal)
npx hardhat ignition:deploy ./ignition/modules/BaseErc721PropertyNFT.ts --network localhost

# Run tests against localhost
npx hardhat test --network localhost
```

### Testnet Deployment

```bash
# Deploy to Sepolia
npx hardhat ignition:deploy ./ignition/modules/BaseErc721PropertyNFT.ts --network sepolia
```

### Contract Verification

```bash
# Verify deployed contract on Etherscan
npx hardhat verify --network sepolia <contract-address> <constructor-arg1> <constructor-arg2>

# Example:
npx hardhat verify --network sepolia 0x1234567890abcdef "Property Name" "0xpropertyHash"
```

## 📝 Contract Overview

### BaseErc721PropertyNFT (ERC721)
- ERC721 token for property NFTs
- Supports ERC721 metadata with property details
- Minting with USDT payment
- `updatePropertyMetadata` function to set property details
- Owner-only administrative functions

### MockUSDT (ERC20)
- Mock USDT token for testing payments
- Standard ERC20 implementation with decimals=6
- Used for testing purchase functionality

## 🔧 Configuration

### Hardhat Config (`hardhat.config.js`)

The project is configured with:

- **Solidity 0.8.28** with optimizer (200 runs)
- **EVM Cancun** hardfork compatibility
- **Hardhat Toolbox** (includes Chai, Ethers, Waffle)
- **Typechain** for TypeScript bindings
- **Sepolia testnet** support
- **Etherscan verification** plugin

### Networks

| Network    | RPC URL                  | Chain ID |
|------------|--------------------------|----------|
| localhost  | http://127.0.0.1:8545   | 31337    |
| sepolia    | ${SEPOLIA_RPC_URL}      | 11155111 |

## 🧪 Testing Strategy

Tests are written in TypeScript using Hardhat's testing framework.

### Test Categories

1. **Unit Tests**: Individual contract functions
2. **Integration Tests**: Multi-contract interactions
3. **Access Control**: Verify permission boundaries
4. **Edge Cases**: Invalid inputs, boundary conditions

### Test Structure

```javascript
describe("BaseErc721PropertyNFT", function () {
  beforeEach(async function () {
    // Setup fixtures
  });

  it("Should mint NFT with correct properties", async function () {
    // Test implementation
  });
});
```

## 📦 Dependencies

### Production Dependencies
- `@openzeppelin/contracts`: Secure, audited contract implementations
- `@openzeppelin/community-contracts`: Community-vetted extensions

### Development Dependencies
- `hardhat`: Ethereum development environment
- `@nomicfoundation/hardhat-toolbox`: Hardhat plugins collection
- `@typechain/hardhat`: TypeScript type generation
- `chai`: Assertion library
- `ethers`: Ethereum library for TypeScript

## 🔍 TypeChain Usage

This project uses Typechain to generate TypeScript bindings for all contracts.

Generated types are stored in `typechain-types/` directory.

```bash
# Regenerate types after contract changes
npx hardhat clean && npx hardhat compile
```

## 📋 Configuration Deep Dive

### Hardhat Configuration (`hardhat.config.js`)

The project uses a modern Hardhat setup with carefully selected plugins and compiler settings:

```javascript
require("@nomicfoundation/hardhat-toolbox");
require("@nomicfoundation/hardhat-ignition");
require("@nomicfoundation/hardhat-verify");
require("@typechain/hardhat");
require("hardhat-gas-reporter");
require("solidity-coverage");

module.exports = {
  solidity: {
    version: "0.8.28",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200
      },
      viaIR: true,
      evmVersion: "cancun"
    }
  },
  networks: {
    localhost: {
      url: "http://127.0.0.1:8545"
    },
    sepolia: {
      url: `${process.env.SEPOLIA_RPC_URL}`,
      accounts: [`0x${process.env.PRIVATE_KEY}`]
    }
  },
  etherscan: {
    apiKey: process.env.ETHERSCAN_API_KEY
  },
  ignition: {
    enabled: true
  },
  typechain: {
    outDir: "typechain-types",
    target: "ethers-v6"
  },
  gasReporter: {
    enabled: process.env.REPORT_GAS === "true",
    currency: "USD"
  }
};
```

**Configuration Components Explained:**

| Setting | Purpose | Why It Matters |
|---------|---------|----------------|
| `solidity.version: "0.8.28"` | Latest patch of 0.8.x series | Includes security fixes, built-in overflow checks, and optimization improvements |
| `optimizer.runs: 200` | Controls code duplication vs runtime cost | 200 is standard for contracts with moderate call frequency; higher values reduce deployment cost but increase runtime cost |
| `viaIR: true` | Intermediate Representation optimization | Enables additional optimization passes that can reduce gas costs by 5-15% for complex contracts |
| `evmVersion: "cancun"` | Targets latest EVM upgrade | Access to EIP-1153 (transient storage), EIP-5656 (MCOPY instruction), and other gas-efficient opcodes |
| `hardhat-toolbox` | Plugin bundle (Chai, Ethers, Waffle) | Provides testing utilities, network helpers, and assertion matchers |
| `hardhat-ignition` | Declarative deployment system | Manages deployment order, dependencies, and state tracking automatically |
| `hardhat-verify` | Etherscan verification | Enables `npx hardhat verify` for public contract verification and source code publication |
| `typechain` | TypeScript type generation | Generates type-safe contract interfaces preventing runtime errors |
| `gas-reporter` | Gas consumption analysis | Helps optimize contracts by identifying expensive operations |
| `solidity-coverage` | Test coverage measurement | Ensures all code paths are tested, identifying untested functionality |

### Solidity Compiler Settings Rationale

The optimizer with 200 runs represents a balanced approach:
- **Deployment Cost**: Moderate (code is somewhat duplicated)
- **Runtime Cost**: Lower (optimized bytecode executes more efficiently)
- **Use Case**: Suitable for contracts that will be called many times after deployment

For contracts that are called very frequently (e.g., ERC20 token transfers), consider increasing `runs` to 1000+. For one-time deployment contracts, consider disabling the optimizer to reduce deployment cost.

The `viaIR` (Intermediate Representation) flag enables the Yul optimizer to see the entire contract, allowing cross-function optimizations that aren't possible with the standard optimizer.

### Network Configuration

**Localhost Development Network:**
- Hardhat's built-in network runs on `127.0.0.1:8545`
- Uses the Hardhat EVM with 20+ accounts funded with 10000 ETH each
- Instant transaction finality (no mining delay)
- Chain ID: `31337`
- Ideal for rapid development and testing

**Sepolia Testnet:**
- Ethereum's official proof-of-stake testnet
- Chain ID: `11155111`
- Requires RPC URL (Infura, Alchemy, or public endpoint)
- Requires account with private key containing test ETH
- Faucets available from various providers for free test ETH
- Realistic network conditions (block times, gas prices)

**Why Sepolia?**
Sepolia is the recommended testnet for application development due to its stability, reliable faucets, and widespread adoption. Always test thoroughly on Sepolia before mainnet deployment.

### Environment Variables (`.env`)

Create a `.env` file in the project root with:

```env
# REQUIRED: Deployer private key (64 hex characters, with 0x prefix)
PRIVATE_KEY=0xYourPrivateKeyHere

# REQUIRED: RPC endpoint for Sepolia testnet
SEPOLIA_RPC_URL=https://sepolia.infura.io/v3/YOUR_PROJECT_ID

# REQUIRED: Etherscan API key for contract verification
ETHERSCAN_API_KEY=YourEtherscanApiKeyHere

# OPTIONAL: Enable gas reporting in tests
REPORT_GAS=true

# OPTIONAL: CoinMarketCap API key (not used in current code but reserved)
COINMARKETCAP_API_KEY=YourCoinMarketCapApiKeyHere
```

**Security Best Practice:**
- Never commit `.env` to version control (already gitignored)
- Use a strong, random private key for deployment (don't use exchange wallets)
- Consider using a hardware wallet for production deployments
- Rotate keys regularly and monitor account activity

### TypeChain Configuration

TypeChain generates TypeScript definitions from Solidity contracts:

```bash
# Generate types (automatic during compilation)
npx hardhat compile

# Types appear in typechain-types/
ls typechain-types/
```

Generated types include:
- `BaseErc721PropertyNFT` - Contract interface with all functions typed
- `MockUSDT` - Mock token interface
- `ethers` - Type definitions for Ethers.js v6

Use in TypeScript:

```typescript
import { BaseErc721PropertyNFT } from "../typechain-types";
import { ethers } from "hardhat";

const nft = (await ethers.getContract<BaseErc721PropertyNFT>("BaseErc721PropertyNFT")).connect(owner);
await nft.updatePropertyMetadata(...);
```

Type safety prevents errors like:
- Passing wrong parameter types (e.g., string instead of uint256)
- Calling non-existent functions
- Incorrect event parameter ordering

### Gas Reporter Configuration

Gas reporting is enabled via environment variable:

```bash
# Enable gas reporting
REPORT_GAS=true npx hardhat test

# Sample output:
# PropertyNFT
#   ✓ Should mint a token to the owner (onlyOwner) (gas: 123456)
#   ✓ Should increment token IDs correctly (gas: 234567)
#   ✓ Should not exceed max supply (gas: 12345)
```

Gas units represent the actual computational cost of each operation. Comparing gas usage across tests helps identify optimization opportunities.

### Coverage Configuration

Code coverage measures what percentage of your contract code is executed during tests:

```bash
npx hardhat coverage
```

Coverage report includes:
- **Statements**: Percentage of individual statements executed
- **Branches**: Percentage of conditional branches (if/else) tested
- **Functions**: Percentage of functions called
- **Lines**: Percentage of code lines executed

Target: **100% coverage** for production contracts, though 90%+ is often acceptable for educational projects.

Coverage helps identify:
- Unreachable code paths
- Missing edge case tests
- Dead code that can be removed

---

## 🚀 Deployment Workflow (Detailed)

### Pre-Deployment Checklist

Before deploying to any network, ensure:

✅ `.env` file configured with correct RPC URL and private key
✅ Sufficient ETH for gas fees (localhost: free, Sepolia: faucet)
✅ Contract code compiled without errors (`npx hardhat compile`)
✅ TypeChain types regenerated if contracts changed
✅ Test suite passes completely (`npx hardhat test`)
✅ Gas reporter enabled for optimization insights (optional)
✅ Etherscan API key set for verification (if desired)

### Deployment Architecture

The project uses **Hardhat Ignition**, a modern declarative deployment system that:

1. **Tracks Deployment State**: Remembers what's deployed to each network
2. **Manages Dependencies**: Automatically deploys contracts in correct order
3. **Enables Parameterization**: Uses module parameters with defaults
4. **Provides Replayability**: Can re-run deployments with same parameters
5. **Supports Future Updates**: Can add new contracts without manual tracking

### Step-by-Step Deployment Process

#### Step 1: Deploy MockUSDT Token

The BaseErc721PropertyNFT contract requires a USDT token address in its constructor. Since we're using a mock for testing/development, we deploy it first.

```bash
# Localhost deployment
npx hardhat ignition:deploy ./ignition/modules/MockUSDT.ts --network localhost

# Sepolia deployment
npx hardhat ignition:deploy ./ignition/modules/MockUSDT.ts --network sepolia
```

Deployment output includes:
- **Deployed address**: `0x...` (copy this for next step)
- **Transaction hash**: For Etherscan verification
- **Deployer address**: Which account deployed
- **Deployment timestamp**

Example output:
```
✔ ✓ deployed MockUSDTModule (0x18648D890d389438a12962965E5c47d9C667B20c)
  → 1 transaction (0x289141957dba7c8e870dbac42b502b7b2653955476101038d34a6111364a4ded)
```

**Why deploy MockUSDT separately?**
The BaseErc721PropertyNFT constructor requires the USDT token address as a parameter. We need the deployed address to pass it during NFT contract deployment.

#### Step 2: Update BaseErc721PropertyNFT Module

Edit `./ignition/modules/BaseErc721PropertyNFT.ts` and update the `usdtToken` parameter on line 10:

```typescript
const usdtToken = m.getParameter("usdtToken", "0xYOUR_DEPLOYED_USDT_ADDRESS_HERE");
```

Replace with the actual USDT address from Step 1. This ensures the NFT contract references the correct token.

**Alternative: Parameter Injection**
You can also pass parameters at deployment time:

```bash
USDT_TOKEN=0xYourUsdtAddress npx hardhat ignition:deploy ./ignition/modules/BaseErc721PropertyNFT.ts --network sepolia
```

Or use environment variables in the module:

```typescript
const usdtToken = m.getParameter("usdtToken", process.env.USDT_TOKEN || "0x...");
```

#### Step 3: Deploy BaseErc721PropertyNFT

With the USDT address configured, deploy the NFT contract:

```bash
# Localhost
npx hardhat ignition:deploy ./ignition/modules/BaseErc721PropertyNFT.ts --network localhost

# Sepolia
npx hardhat ignition:deploy ./ignition/modules/BaseErc721PropertyNFT.ts --network sepolia
```

The deployment includes:
1. **NFT Contract Deployment**: BaseErc721PropertyNFT
2. **Automatic Metadata Setup**: The module calls `updatePropertyMetadata` after deployment

Example output:
```
✔ ✓ deployed BaseErc721PropertyNFTModule (0x7b188E5B41BDba8bE2057d66F77c34b7279b2A1e)
  → 1 transaction (0x0c04a1eb6caa0efc025b2988a50d052c702427be1862308b01337e2a68b9e9bb)
```

#### Step 4: Verify Contracts on Etherscan (Optional but Recommended)

Verification publishes your Solidity source code to Etherscan, enabling:
- Source code reading and verification
- Interaction via Etherscan's "Write Contract" tab
- Security audits by third parties
- Transparency for users

```bash
# Verify BaseErc721PropertyNFT
npx hardhat verify --network sepolia <contract-address> \
  "0xaEeaA55ED4f7df9E4C5688011cEd1E2A1b696772" \
  "PropertyNFT" \
  "PROP" \
  1000 \
  1000000 \
  0x18648D890d389438a12962965E5c47d9C667B20c

# Verify MockUSDT
npx hardhat verify --network sepolia <mock-usdt-address> \
  0xaEeaA55ED4f7df9E4C5688011cEd1E2A1b696772
```

Constructor arguments must match exactly what was used during deployment. Find them in `ignition/modules/BaseErc721PropertyNFT.ts`.

**Auto-verification during deployment:**
If you set `ETHERSCAN_API_KEY` in `.env`, Ignition will attempt verification automatically. Watch the output for verification status.

### Deployment Parameters Reference

| Parameter | Type | Default Value | Description |
|-----------|------|---------------|-------------|
| `initialOwner` | address | `0xaEeaA55...` | Deployer address, becomes contract owner |
| `name` | string | "Luxury 3-Bedroom Apartment: 123 Main St, City, Country" | ERC721 token name |
| `ticker` | string | "123-Main-St-City-Country" | ERC721 token symbol |
| `maxSupply` | uint256 | `1000n` | Total fractional shares/tokens |
| `mintPrice` | uint256 | `1000000n` | Price per token in USDT (6 decimals = 1 USDT) |
| `usdtToken` | address | `0x18648D...` | MockUSDT contract address |
| `propertyAddress` | string | "123 Main St, City, Country" | Physical property location |
| `propertyValue` | uint256 | `500000n` | Property valuation in wei (0.5 ETH example) |
| `propertyType` | string | "Apartment" | Property classification |
| `propertyRooms` | uint256 | `3n` | Number of bedrooms |
| `propertyBaths` | uint256 | `2n` | Number of bathrooms |
| `description` | string | "This premium fractionalized..." | Marketing description |
| `imageData` | string | IPFS hash | Property image or 3D tour |
| `externalUrl` | string | "https://baeza.me" | Additional property details |

**Fractionalization Math:**
- Max Supply = Number of fractional shares
- Mint Price = Price per share
- Total Property Value = Mint Price × Max Supply

Example: 1000 shares at 1 USDT each = 1000 USDT total property valuation (~$1000, but in reality would be much higher).

**Important**: The `propertyValue` field in the contract is for display/record-keeping only. It's not enforced on-chain; the actual economic model is defined by `mintPrice` and `maxSupply`.

### Customizing Deployment Parameters

To deploy with custom parameters for your own property:

1. **Edit ignition module defaults**:
   ```typescript
   const name = m.getParameter("name", "My Custom Property NFT");
   const maxSupply = m.getParameter("maxSupply", 5000n); // 5000 shares
   const mintPrice = m.getParameter("mintPrice", 500000n); // 0.5 USDT per share
   ```

2. **Or pass via environment variables**:
   ```bash
   MAX_SUPPLY=5000 MINT_PRICE=500000 \
     npx hardhat ignition:deploy ./ignition/modules/BaseErc721PropertyNFT.ts --network sepolia
   ```

3. **Or create multiple deployment modules** for different properties with different parameters.

### Post-Deployment Steps

After deployment:

1. **Update README.md** with your deployed addresses
2. **Verify contracts on Etherscan** (already covered)
3. **Test purchase functionality**:
   - Get test USDT from MockUSDT: `await usdt.mint(userAddress, amount)`
   - Approve NFT contract: `await usdt.approve(nftAddress, amount)`
   - Purchase token: `await nft.purchase()`
4. **Check NFT metadata**:
   ```javascript
   const uri = await nft.tokenURI(0)
   console.log(URI) // Should return JSON with property details
   ```
5. **Test on block explorer** (Etherscan Sepolia):
   - Interact via "Write Contract" tab
   - Read metadata via "Read Contract" tab
   - Verify events in transaction logs

---

## 🧪 Testing Strategy (Comprehensive Guide)

### Testing Philosophy

Testing is crucial for smart contracts because:
1. **Immutability**: Once deployed, contracts cannot be changed
2. **Financial Impact**: Bugs can lead to irreversible loss of funds
3. **Complex Interactions**: Multiple contracts interact in non-obvious ways
4. **Access Control**: Improper permissions can lead to theft or manipulation

This project follows a **comprehensive testing approach** with:

- **Unit Tests**: Test individual functions in isolation
- **Integration Tests**: Test multi-contract interactions
- **End-to-End Scenarios**: Simulate real user workflows
- **Edge Cases**: Invalid inputs, boundary conditions, unexpected states
- **Event Verification**: Ensure correct events emitted
- **Reversion Testing**: Verify proper error handling

### Test File Structure

The main test file `test/BaseErc721PropertyNFT.test.js` is organized into logical `describe` blocks:

```javascript
describe("BaseErc721PropertyNFT", function () {
  let BaseErc721PropertyNFT;
  let MockUSDT;
  let baseErc721PropertyNFT;
  let usdt;
  let owner;
  let nonOwner;
  let anotherUser;

  // Shared constants
  const NAME = "TestPropertyNFT";
  const SYMBOL = "TPNFT";
  const MAX_SUPPLY = 100;
  const MINT_PRICE_USDT = ethers.parseUnits("100", 6);

  // Runs before each test
  beforeEach(async function () {
    [owner, nonOwner, anotherUser] = await ethers.getSigners();
    // Deploy contracts fresh for each test
  });

  describe("Deployment", function () {
    it("Should set the correct name and symbol", async function () {
      // Test implementation
    });
  });

  describe("Minting (Owner Only)", function () {
    it("Should mint a token to the owner (onlyOwner)", async function () {
      // Test implementation
    });
  });

  // ... more test categories
});
```

### Test Categories Explained

#### 1. Deployment Tests

**Purpose**: Verify constructor sets all state variables correctly.

**What's tested**:
- Token name and symbol match constructor args
- Owner is set to `initialOwner`
- `maxSupply` is immutable and correct
- `mintPrice` initialized properly
- `usdtToken` address stored correctly

**Example**:
```javascript
it("Should set the correct max supply", async function () {
  expect(await baseErc721PropertyNFT.maxSupply()).to.equal(MAX_SUPPLY);
});
```

**Educational value**: Shows how to test immutable variables and constructor parameters.

#### 2. Owner-Only Minting (`safeMint`)

**Purpose**: Test administrative minting functionality.

**Test cases**:
- Only owner can call `safeMint`
- Token IDs increment sequentially (0, 1, 2, ...)
- Max supply limit enforced
- `Transfer` event emitted with correct args (`from: ZeroAddress`, `to: recipient`, `tokenId`)
- Token ownership and balance updated correctly

**Key insights**:
- `_nextTokenId` auto-increments starting from 0
- `_safeMint` ensures recipient can safely receive ERC721 (calls `onERC721Received`)
- Revert message: "Max supply exceeded" when limit reached

**Example test**:
```javascript
it("Should not exceed max supply", async function () {
  for (let i = 0; i < MAX_SUPPLY; i++) {
    await baseErc721PropertyNFT.safeMint(owner.address);
  }
  await expect(baseErc721PropertyNFT.safeMint(nonOwner.address))
    .to.be.revertedWith("Max supply exceeded");
});
```

#### 3. Public Purchase with USDT

**Purpose**: Test primary market sales where users buy NFTs with USDT.

**Test setup**:
```javascript
beforeEach(async function () {
  // Mint USDT to test users
  await usdt.mint(nonOwner.address, ethers.parseUnits("1000", 6));
  await usdt.mint(anotherUser.address, ethers.parseUnits("1000", 6));

  // Approve NFT contract to spend USDT
  await usdt.connect(nonOwner).approve(
    await baseErc721PropertyNFT.getAddress(),
    ethers.parseUnits("1000", 6)
  );
});
```

**Test coverage**:
- Successful purchase with exact mint price
- `Purchased` event emits `(buyer, tokenId, price)`
- `Transfer` event also emits (standard ERC721)
- Token assigned to purchaser
- Token IDs increment regardless of purchaser
- USDT transferred from buyer to contract owner
- Insufficient allowance → revert with `ERC20InsufficientAllowance`
- Insufficient balance → revert with `ERC20InsufficientBalance`
- Max supply enforced
- Over-approval works (only `mintPrice` deducted)

**Critical security check**:
```javascript
it("Should transfer USDT from buyer to owner upon purchase", async function () {
  const ownerUSDTBefore = await usdt.balanceOf(owner.address);
  await baseErc721PropertyNFT.connect(nonOwner).purchase();
  const ownerUSDTAfter = await usdt.balanceOf(owner.address);
  expect(ownerUSDTAfter - ownerUSDTBefore).to.equal(mintPrice);
});
```

This verifies the payment actually reaches the owner, not locked in contract.

#### 4. Property Metadata Management

**Purpose**: Test global metadata that describes the underlying real estate.

**Metadata fields**:
- `propertyAddress` (string): Street address
- `propertyValue` (uint256): Valuation in wei
- `propertyType` (string): "Apartment", "House", "Villa", etc.
- `propertyRooms` (uint256): Bedroom count
- `propertyBaths` (uint256): Bathroom count
- `description` (string): Marketing text
- `imageData` (string): IPFS hash or URL
- `externalUrl` (string): Link to full details

**Two update methods**:
1. Bulk: `updatePropertyMetadata(all fields)` - sets all at once
2. Individual: `updatePropertyAddress()`, `updatePropertyValue()`, etc. - fine-grained updates

**Tests**:
- Only owner can update metadata
- All getter functions return correct values after update
- Individual updates work independently
- Metadata can be updated before or after minting
- Global metadata affects all tokens (new and existing)

**Key educational point**:
```javascript
it("Should maintain metadata separately from token existence", async function () {
  // Set metadata
  await nft.updatePropertyMetadata("Address 1", ...);
  await nft.safeMint(user1);
  let tokenURI = await nft.tokenURI(0);
  expect(tokenURI).to.include("Address 1");

  // Update metadata
  await nft.updatePropertyMetadata("Address 2", ...);
  await nft.safeMint(user2);
  tokenURI = await nft.tokenURI(1);
  expect(tokenURI).to.include("Address 2"); // New token has new metadata
});
```

Metadata is **global**, not per-token. This reinforces the fractionalization model: all tokens represent shares of the same property.

#### 5. Mint Price Management

**Purpose**: Test owner's ability to adjust sale price.

**What's tested**:
- `setMintPrice(uint256)` only callable by owner
- New price persists correctly
- Price affects all subsequent `purchase()` calls

**Note**: Changing price doesn't affect already-minted tokens or refunds.

#### 6. `tokenURI` Generation

**Purpose**: Verify NFT metadata JSON conforms to ERC721Metadata standard.

**Standard NFT metadata schema** (OpenSea, Rarible, etc.):
```json
{
  "name": "Property #0",
  "description": "This premium fractionalized apartment...",
  "image": "https://ipfs.io/ipfs/...",
  "external_url": "https://baeza.me",
  "attributes": [
    {"trait_type": "Type", "value": "Apartment"},
    {"trait_type": "Value", "value": 500000},
    {"trait_type": "Address", "value": "123 Main St..."},
    {"trait_type": "Rooms", "value": 3},
    {"trait_type": "Bathrooms", "value": 2}
  ]
}
```

**Test cases**:
- Revert for non-existent tokenId (`_nextTokenId` check)
- Valid JSON format parseable
- Default empty values before metadata set
- Updated metadata reflected after `updatePropertyMetadata()`
- Attribute values: numeric types remain numbers, not strings
- All five attributes present in array

**Important**: `tokenURI` is a `view` function, doesn't modify state. It's read-only.

#### 7. Ownable Functions

**Purpose**: Test OpenZeppelin Ownable pattern.

**Coverage**:
- Ownership transfer: `transferOwnership(newOwner)`
- Only owner can transfer ownership
- New owner gains full admin rights
- Owner can renounce (not tested but possible via `renounceOwnership()`)

**Test**:
```javascript
it("Should allow new owner to perform owner-only actions", async function () {
  await nft.transferOwnership(anotherUser.address);
  await nft.connect(anotherUser).safeMint(nonOwner.address); // Should succeed
});
```

#### 8. ERC721 Compliance

**Purpose**: Ensure contract implements ERC721 standard correctly.

**Tests**:
- `supportsInterface(0x80ac58cd)` returns true for ERC721
- `approve(tokenId, operator)` works
- `setApprovalForAll(operator, true)` works
- `getApproved(tokenId)` returns approved address
- `isApprovedForAll(owner, operator)` returns boolean

**Interface IDs**:
- ERC165: `0x01ffc9a7`
- ERC721: `0x80ac58cd`
- ERC721Enumerable: `0x780e9d63` (if implemented)

#### 9. Edge Cases

**Purpose**: Test unusual scenarios not covered by standard tests.

**Examples**:
- Multiple mints to different addresses
- Metadata updates before any tokens minted
- Metadata changes affect only newly minted tokens (existing tokenURIs unchanged)
- Zero-value purchases (not allowed, mintPrice > 0)
- Very large metadata strings (potential DoS, though gas limits prevent extreme cases)

### Writing Effective Tests

#### Test Structure Best Practices

1. **Arrange-Act-Assert (AAA) Pattern**:
   ```javascript
   // Arrange (setup)
   await usdt.mint(nonOwner.address, amount);
   await usdt.approve(nft.address, amount);

   // Act (execute)
   await nft.connect(nonOwner).purchase();

   // Assert (verify)
   expect(await nft.ownerOf(0)).to.equal(nonOwner.address);
   ```

2. **Use Descriptive Names**:
   ```javascript
   it("Should revert with ERC20InsufficientAllowance when allowance is zero", ...)
   ```

3. **Test One Thing Per Test**:
   - Keep tests focused on single behavior
   - Easier to debug failures
   - Clearer documentation of expected behavior

4. **Avoid Test Dependencies**:
   - Each test should work independently
   - Use `beforeEach` for shared setup
   - Never rely on state from previous test

5. **Test Both Success and Failure**:
   - Every function should have success tests
   - Every restriction/require should have revert tests

#### Async Handling

Hardhat tests use async/await:

```javascript
it("Should mint token", async function () {
  const tx = await nft.safeMint(nonOwner.address); // 1. Send transaction
  await tx.wait(); // 2. Wait for inclusion (optional but recommended)
  
  // 3. Assert state changes
  expect(await nft.ownerOf(0)).to.equal(nonOwner.address);
  expect(await nft.balanceOf(nonOwner.address)).to.equal(1);
});
```

**For events**:
```javascript
await expect(tx)
  .to.emit(nft, "Transfer")
  .withArgs(ethers.ZeroAddress, nonOwner.address, 0);
```

#### Reversion Testing

Test that functions revert correctly:

```javascript
// Custom error from OpenZeppelin ERC20
await expect(
  nft.connect(zeroBalanceUser).purchase()
).to.be.revertedWithCustomError(usdt, "ERC20InsufficientBalance");

// Simple require message
await expect(
  nft.safeMint(nonOwner.address)
).to.be.revertedWith("Max supply exceeded");
```

Use `revertedWithCustomError` for OpenZeppelin errors to match error signatures.

#### Using Chai Matchers

Hardhat includes extended Chai matchers:

- `.to.equal()` - Equality
- `.to.be.reverted` - Transaction reverted
- `.to.be.revertedWith("message")` - Revert message matches
- `.to.emit(contract, "EventName")` - Event emitted
- `.withArgs(...)` - Event arguments match
- `.to.deep.equal()` - Deep object equality
- `.to.be.an("array")` - Type checking
- `.to.have.lengthOf(n)` - Array length

### Running Tests

#### Basic Commands

```bash
# Run all tests
npx hardhat test

# Run specific test file
npx hardhat test test/BaseErc721PropertyNFT.test.js

# Run with verbose output (shows console.log)
npx hardhat test --verbose

# Run tests matching pattern
npx hardhat test --grep "Should mint"

# Run tests on localhost network instead of in-memory
npx hardhat test --network localhost
```

#### Gas Reporting

Enable gas reporting:

```bash
# One-time
REPORT_GAS=true npx hardhat test

# Permanently in package.json:
# "scripts": {
#   "test:gas": "REPORT_GAS=true hardhat test"
# }
```

Sample output:
```
PropertyNFT
  Deployment
    ✓ Should set the correct name and symbol (gas: 12456)
    ✓ Should set the correct initial owner (gas: 9876)
  Minting (Owner Only)
    ✓ Should mint a token to the owner (onlyOwner) (gas: 125432)
    ✓ Should increment token IDs correctly (gas: 245678)

  12 passing (2s)
```

Gas reporter shows per-test gas usage, helping you optimize expensive functions.

#### Coverage Report

Generate HTML coverage report:

```bash
npx hardhat coverage
```

Output:
```
Instrumenting for coverage...
[... compilation ...]
  100% coverage
  Statements: 100% (45/45)
  Branches: 100% (28/28)
  Functions: 100% (18/18)
  Lines: 100% (42/42)

-------------------------------
> lcov.info ready at /path/to/coverage/lcov.info
```

Open `coverage/lcov-report/index.html` in browser to see line-by-line coverage:

- Green: Executed code
- Red: Uncovered code
- Yellow: Partially covered branches

**Goal**: 100% coverage for production contracts. This project achieves comprehensive coverage.

#### Test Networks

By default, Hardhat runs tests against an **in-memory network** that:
- Starts fresh for each test run
- Spawns 20 accounts with 10000 ETH each
- Mines blocks instantly (no delay)
- No external dependencies

For integration tests against live networks (Sepolia):

```bash
npx hardhat test --network sepolia
```

**Warning**: Tests will consume real testnet ETH and may interact with live contracts. Use carefully.

---

## 🔒 Security Audit Checklist

Even though this is an educational project, understanding security best practices is essential. Use this checklist to audit the contracts:

### ✅ Implemented Security Features

- [x] **OpenZeppelin Contracts**: Using audited, industry-standard implementations
- [x] **Reentrancy Protection**: ERC721's `_safeMint` prevents reentrancy attacks
- [x] **Integer Overflow/Underflow**: Solidity 0.8.x has built-in checks
- [x] **Access Control**: `onlyOwner` modifier for administrative functions
- [x] **Supply Limit**: `maxSupply` prevents infinite minting
- [x] **Payment Validation**: Check return value of `transferFrom`
- [x] **Address Zero Checks**: (Not strictly needed for constructor args but good practice)
- [x] **Event Emission**: All state-changing functions emit events for off-chain tracking
- [x] **No Selfdestruct**: Destructive operations avoided

### ⚠️ Potential Security Considerations

**⚠️ 1. No Timelock on Owner Actions**
- **Issue**: Owner can immediately change mint price, withdraw funds (if contract held funds), or update metadata without delay
- **Impact**: Users have no warning of changes
- **Mitigation**: For production, implement Timelock controller for delayed execution of owner actions

**⚠️ 2. No Pause Mechanism**
- **Issue**: Contract cannot be paused in emergency
- **Impact**: Bug or attack cannot be stopped without upgrade (impossible for immutable contracts)
- **Mitigation**: Consider upgradeable pattern (UUPS) or Pausable module

**⚠️ 3. Centralized Control**
- **Issue**: Single owner has complete control
- **Impact**: Owner could freeze purchases by setting extreme mint price, or abuse metadata
- **Mitigation**: Use multi-sig wallet for owner, or decentralized governance

**⚠️ 4. USDT Return Value Check Incomplete**
- **Issue**: `transferFrom` returns `bool`. Code checks `bool transferred` which is correct
- **However**: Some ERC20 tokens don't return boolean (like USDT on Ethereum mainnet!). MockUSDT does return bool.
- **Mitigation**: Use OpenZeppelin's `SafeERC20` library which handles both return-value and non-return-value tokens:
  ```solidity
  import {SafeERC20} from "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
  SafeERC20 safeUSDT = SafeERC20(usdtToken);
  safeUSDT.safeTransferFrom(msg.sender, owner(), mintPrice);
  ```

**⚠️ 5. Metadata Update Affects All Tokens**
- **Issue**: Changing metadata retroactively changes what all token holders "own"
- **Impact**: Could misrepresent property details after someone purchased
- **Mitigation**: Make metadata immutable after first mint, or use per-token metadata with more complex storage

**⚠️ 6. No Royalty Enforcement**
- **Issue**: ERC721 royalty standard (EIP-2981) not implemented
- **Impact**: No automatic royalty on secondary market sales
- **Mitigation**: Add ` royaltyInfo()` function if desired

**⚠️ 7. No Enumeration**
- **Issue**: ERC721Enumerable not implemented
- **Impact**: Cannot query all token IDs or owners efficiently
- **Mitigation**: Add `totalSupply()`, `tokenByIndex()`, `tokenOfOwnerByIndex()` if needed

**⚠️ 8. No Batch Operations**
- **Issue**: Users can only purchase one token at a time
- **Impact**: Inefficient, higher gas per token
- **Mitigation**: Add `purchaseMultiple(uint256 quantity)` function

**⚠️ 9. Property Value Not Enforced On-Chain**
- **Issue**: `propertyValue` is just metadata, not tied to economic model
- **Impact**: Misalignment between declared value and actual token economics
- **Mitigation**: Calculate property value from `mintPrice × maxSupply` and store that instead, or enforce through oracles

**⚠️ 10. No Cooling-Off Period or Vesting**
- **Issue**: Tokens are fully transferable immediately after mint
- **Impact**: Could enable immediate flipping or unauthorized transfers
- **Mitigation**: Add vesting schedule or transfer restrictions for early buyers

---

## 🎓 Educational Extensions and Further Learning

This project serves as a foundation. Here are ways to extend it for deeper learning:

### Level 1: Basic Extensions

#### 1.1 ERC2981 Royalties
Add royalty support for secondary market sales:
```solidity
import "@openzeppelin/contracts/token/ERC721/extensions/ERC2981.sol";

contract BaseErc721PropertyNFT is ERC721, Ownable, ERC2981 {
  uint256 public royaltyFee; // Basis points (e.g., 500 = 5%)
  
  constructor(...) ERC721(...) {
    // ...
    royaltyFee = 250; // 2.5% default
  }
  
  function royaltyInfo(uint256, uint256 salePrice) 
    external view returns (address receiver, uint256 fee) 
  {
    return (owner(), (salePrice * royaltyFee) / 10000);
  }
}
```

#### 1.2 Batch Purchase
Allow users to buy multiple tokens in one transaction:
```solidity
function purchaseMultiple(uint256 quantity) public payable {
  require(_nextTokenId + quantity <= maxSupply, "Exceeds max supply");
  require(usdtToken.transferFrom(msg.sender, owner(), mintPrice * quantity), "Payment failed");
  
  for(uint256 i = 0; i < quantity; i++) {
    _safeMint(msg.sender, _nextTokenId++);
  }
  
  emit PurchasedMany(msg.sender, quantity, mintPrice * quantity);
}
```

#### 1.3 Time-Locked Vesting
Prevent immediate selling by locking tokens for a period:
```solidity
struct VestingSchedule {
  uint256 cliff; // timestamp when unlocking begins
  uint256 duration; // total vesting period
  uint256 totalAmount; // total tokens vested
}

mapping(address => VestingSchedule) public vestingSchedules;

function setVestingSchedule(address tokenHolder, uint256 cliff, uint256 duration) external onlyOwner {
  vestingSchedules[tokenHolder] = VestingSchedule(cliff, duration, balanceOf(tokenHolder));
}

function vestedAmount(address tokenHolder) public view returns (uint256) {
  VestingSchedule storage schedule = vestingSchedules[tokenHolder];
  if (block.timestamp < schedule.cliff) return 0;
  uint256 elapsed = block.timestamp - schedule.cliff;
  return (schedule.totalAmount * elapsed) / schedule.duration;
}

function transferFrom(address from, address to, uint256 tokenId) public override {
  require(balanceOf(from) >= vestedAmount(from), "Tokens locked");
  super.transferFrom(from, to, tokenId);
}
```

### Level 2: Intermediate Extensions

#### 2.1 ERC20 Wrapper for Fungible Shares
Create a fungible token (ERC20) that represents the same fractional ownership:
```solidity
contract PropertyShares is ERC20 {
  BaseErc721PropertyNFT public nft;
  
  constructor(address _nft, string memory name, string memory symbol) ERC20(name, symbol) {
    nft = BaseErc721PropertyNFT(_nft);
  }
  
  function mintForNFT(uint256 nftTokenId) external {
    require(nft.ownerOf(nftTokenId) == msg.sender, "Not token owner");
    _mint(msg.sender, 1); // 1 share per NFT
  }
}
```

This enables:
- Fractional shares to be traded as fungible tokens
- Use in DeFi protocols requiring ERC20
- Easier accounting for shareholders

#### 2.2 Rental Distribution Mechanism
If property generates rental income, distribute to token holders:
```solidity
function distributeRent(uint256 totalRent) external onlyOwner {
  uint256 totalSupply = totalSupply(); // if ERC721Enumerable
  uint256 perTokenShare = totalRent / totalSupply;
  
  for(uint256 i = 0; i < totalSupply; i++) {
    address tokenOwner = ownerOf(i);
    // In practice, this is gas-inefficient. Use Merkle airdrop or off-chain accounting.
  }
}
```

**Better approach**: Off-chain accounting + Merkle proofs for efficient distribution.

#### 2.3 Governance Token (ERC20Votes)
Give shareholders governance rights:
```solidity
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Votes.sol";

contract GovernanceToken is ERC20Permit, ERC20Votes {
  constructor(string memory name, string memory symbol) ERC20(name, symbol) ERC20Permit(name) ERC20Votes(name) {
    // Mint initial supply to propertyNFT contract
    _mint(address(this), initialSupply);
  }
  
  // Override required functions
  function nonces(address owner) public view override(ERC20Permit, ERC20Votes) returns (uint256) {
    return super.nonces(owner);
  }
  
  // Permit, voting, and delegation functions inherited
}
```

Token holders can vote on property management decisions (rent increases, maintenance, sale).

#### 2.4 Cross-Chain Bridging
Use LayerZero or Wormhole to bridge NFTs between chains:
```solidity
import "@layerzerolabs/solidity-examples/contracts/token/nft/NonblockingNonERC721.sol";

contract CrossChainPropertyNFT is NonblockingNonERC721 {
  // Bridge tokens between Ethereum and Polygon, etc.
  // Requires endpoints, oracle, and relayer configuration
}
```

Enables fractional property ownership on multiple chains.

#### 2.5 Buyback and Burn
Allow owner to buy back fractions from market:
```solidity
function buyBack(uint256 tokenId) external {
  require(msg.sender == owner(), "Only owner");
  require(ownerOf(tokenId) != owner(), "Already owned by owner");
  
  uint256 price = getCurrentMarketPrice(); // Could be dynamically set
  usdtToken.transferFrom(owner(), ownerOf(tokenId), price);
  _burn(tokenId);
  emit BoughtBack(tokenId, price);
}
```

Reduces total supply, increasing value of remaining tokens.

### Level 3: Advanced Integration

#### 3.1 Oracle Integration for Property Valuation
Chainlink oracle provides real-time property appraisals:
```solidity
import "@chainlink/contracts/src/v0.8/interfaces/AggregatorV3Interface.sol";

contract OracledPropertyNFT is BaseErc721PropertyNFT {
  AggregatorV3Interface internal propertyPriceFeed;
  
  constructor(address _oracle) {
    propertyPriceFeed = AggregatorV3Interface(_oracle);
  }
  
  function updatePropertyValueFromOracle() external onlyOwner {
    (, int256 price, , ,) = propertyPriceFeed.latestRoundData();
    // Convert price to appropriate decimals
    updatePropertyValue(uint256(price));
  }
}
```

Keeps property valuation on-chain synchronized with market.

#### 3.2 Fractional NFT Marketplace
Integrate with marketplace contracts like Seaport or LooksRare:
```solidity
// Use Seaport's considerOwnership hook for ERC721
// Allows listing NFTs for sale without transferring to marketplace
```

#### 3.3 DAO Governance
Token holders collectively manage the property via DAO:
```solidity
import "@openzeppelin/contracts/governance/Governor.sol";

propertyDAO = Governor(...);
// Proposals: sell property, take mortgage, renovate, etc.
// Voting weighted by number of tokens held
```

#### 3.4 Rental Payment via ERC20
Tenants pay rent in USDT, automatically distributed to shareholders:
```solidity
function payRent(uint256 nftTokenId, uint256 amount) external {
  require(usdtToken.transferFrom(msg.sender, address(this), amount), "Payment failed");
  // Distribute proportionally to all token holders
  distributeFunds(amount);
}
```

### Level 4: Compliance and Regulation

#### 4.1 KYC/AML Whitelisting
Only allow verified investors:
```solidity
mapping(address => bool) public whitelistedInvestors;

function addToWhitelist(address investor) external onlyOwner {
  whitelistedInvestors[investor] = true;
}

modifier onlyWhitelisted() {
  require(whitelistedInvestors[msg.sender], "Not whitelisted");
  _;
}

function purchase() external onlyWhitelisted {
  // Existing purchase logic
}
```

#### 4.2 Jurisdiction-Based Restrictions
Restrict sales based on geographic location:
```solidity
mapping(string => bool) public restrictedJurisdictions;

modifier notRestricted(string memory country) {
  require(!restrictedJurisdictions[country], "Jurisdiction restricted");
  _;
}
```

Require off-chain KYC verification to add to whitelist.

#### 4.3 Securities Law Compliance
For tokens considered securities:
- Implement transfer restrictions (only accredited investors)
- Add transfer cooldown period
- Require legal agreement acceptance via signed message
- Report to regulatory bodies

**⚠️ Critical**: Consult legal counsel before implementing real-world tokenization.

---

## 🐛 Troubleshooting Guide

### Compilation Errors

#### Error: `ParserError: Expected ';' but got '}'`

**Cause**: Solidity syntax error, often missing semicolon or unmatched braces.

**Fix**:
```solidity
// Before (missing semicolon)
uint256 public mintPrice

// After (add semicolon)
uint256 public mintPrice;
```

#### Error: `HH100: Error: Cannot find module '@openzeppelin/contracts'`

**Cause**: Dependencies not installed.

**Fix**:
```bash
rm -rf node_modules package-lock.json
npm install
```

#### Error: `ParserError: Invalid or unexpected token` at Unicode characters

**Cause**: Copy-paste introduced non-ASCII characters.

**Fix**: Rewrite line manually, check for smart quotes vs straight quotes.

### Test Failures

#### Error: `Transaction reverted: Max supply exceeded`

**Cause**: Test tries to mint more than `MAX_SUPPLY`.

**Fix**: Adjust test `MAX_SUPPLY` constant or minting logic:

```javascript
const MAX_SUPPLY = 1000; // Must match contract's actual maxSupply
```

#### Error: `Transaction reverted: USDT transfer failed`

**Cause**: MockUSDT didn't have enough balance or allowance.

**Fix**: Ensure USDT minted and approved in test setup:
```javascript
await usdt.mint(nonOwner.address, ethers.parseUnits("1000", 6));
await usdt.approve(nft.address, ethers.parseUnits("1000", 6));
```

#### Error: `invalid opcode` when calling `transferFrom`

**Cause**: MockUSDT uses OpenZeppelin ERC20 which returns `bool`, but buyer didn't approve or has insufficient balance.

**Fix**: Check allowance and balance before purchase.

#### Error: `call to non-contract address` during deployment

**Cause**: Wrong contract factory or artifact not compiled.

**Fix**:
```bash
npx hardhat clean
npx hardhat compile
npx hardhat test
```

### Deployment Issues

#### Error: `Insufficient funds for gas + value`

**Cause**: Deployer account has no ETH on target network.

**Fix**:
- **Localhost**: Ignore, Hardhat provides fake ETH
- **Sepolia**: Get faucet from https://sepoliafaucet.com/ or https://sepolia-faucet.pk910.de/
- **Mainnet**: Acquire real ETH

#### Error: `Private key must be a hex string of length 64 (with or without 0x prefix)`

**Cause**: `.env` private key malformed.

**Fix**:
```env
# Correct (64 hex chars, may add 0x prefix)
PRIVATE_KEY=0xa3f4... (64 characters)
# or
PRIVATE_KEY=a3f4... (64 characters without 0x)
```

#### Error: `hardhat-verify: Contract source code already verified`

**Cause**: Already verified on Etherscan.

**Fix**: Either skip verification or use `--force` flag:
```bash
npx hardhat verify --force --network sepolia <address> ...
```

#### Error: `HardhatError: HH400: Transaction failed`

**Cause**: Generic transaction failure. Check revert reason:

**Fix**:
```bash
# Run with more debug output
npx hardhat console --network sepolia
> const receipt = await nft.purchase({ gasLimit: 300000 }).catch(e => console.log(e.error.error?.error?.data || e.message))

# Or check transaction on Etherscan
```

### Ignition Deployment Issues

#### Error: `No deployment for module found at path`

**Cause**: Wrong module path.

**Fix**: Use correct relative path:
```bash
npx hardhat ignition:deploy ./ignition/modules/BaseErc721PropertyNFT.ts --network localhost
```

#### Error: `Module already deployed`

**Cause**: Ignition thinks module already deployed (tracked in `ignition/deployments/`).

**Fix**:
```bash
# Clean deployment state (careful: this doesn't affect live network, only tracking)
rm -rf ignition/deployments/
# Then re-deploy
```

### Network Issues

#### Error: `connect ETIMEDOUT` or `network timeout`

**Cause**: RPC URL unreachable.

**Fix**:
- Check internet connection
- Verify RPC URL in `.env` is correct
- Try different RPC provider (Infura, Alchemy, public node)
- Increase timeout:
```javascript
// hardhat.config.js
network: {
  timeout: 300000, // 5 minutes
}
```

#### Error: `insufficient funds for gas + value` on Sepolia

**Cause**: Not enough test ETH.

**Fix**: Get more from Sepolia faucet. If faucet limit reached, wait or use alternative.

---

## 📚 Resources for Continued Learning

### Official Documentation

- [Hardhat Official Docs](https://hardhat.org/docs) - Comprehensive guide to Hardhat features
- [OpenZeppelin Contracts](https://docs.openzeppelin.com/contracts/) - Standards and best practices
- [Solidity Language Documentation](https://soliditylang.org/docs/) - Language reference and security considerations
- [EIP-721: Non-Fungible Token Standard](https://eips.ethereum.org/EIPS/eip-721) - Official NFT standard
- [ERC-20 Token Standard](https://eips.ethereum.org/EIPS/eip-20) - For understanding USDT integration

### Fractionalization Specific Resources

- **Fractional.art**: Fractional NFT marketplace (study their smart contracts)
- **NIFTEX**: Fractionalization protocol (understand their approach)
- [Uniswap V3 Concentrated Liquidity](https://uniswap.org/whitepaper-v3.pdf) - For liquidity strategies

### Security Resources

- [Consensys Smart Contract Security Best Practices](https://consensys.github.io/smart-contract-best-practices/)
- [SWC Registry](https://swcregistry.io/) - Smart Contract Weakness Classification Registry
- [OpenZeppelin Contracts Security Advisories](https://github.com/openzeppelin/openzeppelin-contracts/security)
- [Ethereum Smart Contract Security](https://consensys.github.io/smart-contract-best-practices/)

### Tools

- [Slither](https://github.com/crytic/slither) - Static analysis framework
- [Mythril](https://github.com/ConsenSys/mythril) - Symbolic execution security analyzer
- [Foundry](https://book.getfoundry.sh/) - Alternative smart contract development framework
- [Tenderly](https://tenderly.co/) - Transaction simulation and monitoring

### Community

- [Ethereum Stack Exchange](https://ethereum.stackexchange.com/) - Technical Q&A
- [r/ethdev](https://www.reddit.com/r/ethdev/) - Developer community
- [OpenZeppelin Discord](https://discord.gg/openzeppelin) - Community support
- [Hardhat Discord](https://hardhat.org/discord) - Hardhat-specific help

### Advanced Reading

- **"Mastering Ethereum"** by Andreas M. Antonopoulos - Comprehensive Ethereum and Solidity book
- **"Security Patterns for Ethereum Development"** - Design patterns for secure contracts
- **"The ERC-721 Standard"** - Deep dive into NFT mechanics
- **"Tokenization of Real-World Assets"** - Industry reports from Deloitte, EY, PwC

---

## 🎯 Deployed Contracts (Example)

These are example deployments for the tutorial. Deploy your own to different addresses.

### MockUSDT (Sepolia Testnet)

- **Contract Address**: [`0x18648D890d389438a12962965E5c47d9C667B20c`](https://sepolia.etherscan.io/address/0x18648D890d389438a12962965E5c47d9C667B20c)
- **Deployment Transaction**: https://sepolia.etherscan.io/tx/0x289141957dba7c8e870dbac42b502b7b2653955476101038d34a6111364a4ded
- **Deployer**: 0xaEeaA55ED4f7df9E4C5688011cEd1E2A1b696772
- **Initial Supply**: 1,000,000 USDT (6 decimals)

### BaseErc721PropertyNFT (Sepolia Testnet)

- **Contract Address**: [`0x7b188E5B41BDba8bE2057d66F77c34b7279b2A1e`](https://sepolia.etherscan.io/address/0x7b188E5B41BDba8bE2057d66F77c34b7279b2A1e)
- **Deployment Transaction**: https://sepolia.etherscan.io/tx/0x0c04a1eb6caa0efc025b2988a50d052c702427be1862308b01337e2a68b9e9bb
- **Deployer**: 0xaEeaA55ED4f7df9E4C5688011cEd1E2A1b696772
- **Parameters**:
  - Name: PropertyNFT
  - Ticker: PROP
  - Max Supply: 1000
  - Mint Price: 1 USDT (1000000 with 6 decimals)
  - USDT Token: 0x18648D890d389438a12962965E5c47d9C667B20c

## 📸 Demo

![Fractional Real Estate NFT Demo](https://ipfs.io/ipfs/bafybeiceq4fw66eswi34axd6423kqawmurkwjg7haotwmar7r4luzobeem)

---

## 🤝 Contributing (Educational Focus)

This project is designed for learning. Contributions that enhance educational value are welcome:

1. **Add New Test Scenarios**: Cover edge cases not yet tested
2. **Optimize Gas Usage**: Refactor to reduce gas costs, document savings
3. **Implement Extensions**: Add Level 1-3 extensions as separate branches
4. **Improve Documentation**: Clarify confusing sections, add diagrams
5. **Add Deployment Scripts**: Support more networks (Polygon, Arbitrum, Optimism)
6. **Create Video Tutorials**: Walk through code, explain concepts
7. **Translate README**: Make accessible to non-English speakers
8. **Submit Bug Reports**: If code is unclear or has errors

**Contribution Workflow**:
1. Fork repository
2. Create feature branch (`git checkout -b feature/amazing-addition`)
3. Make changes with tests (if applicable)
4. Ensure all tests pass (`npm test`)
5. Update README if adding significant functionality
6. Commit (`git commit -m 'Add X feature'`)
7. Push (`git push origin feature/amazing-addition`)
8. Open Pull Request with detailed description

**Code Style**:
- Follow Solidity conventions (4-space indentation, upper camel case for contracts)
- Use OpenZeppelin imports consistently
- Add NatSpec comments for new public functions
- Write tests for new functionality

---

## 📄 License

MIT

---

**Built with Hardhat** | **Secured by OpenZeppelin** | **Educational Fractional Real Estate Tokenization**