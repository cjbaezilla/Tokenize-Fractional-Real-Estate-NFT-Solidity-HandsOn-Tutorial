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
│       └── BaseErc721PropertyNFT.ts
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

## 📊 Gas Optimization

Contracts are optimized for minimal gas usage:

- **Optimizer enabled**: 200 runs
- **Packed storage variables** where applicable
- **Minimal external calls**
- **Events over storage** where appropriate

Check gas usage:
```bash
npx hardhat test --gas-reporter
```

## 🚢 Deployment Workflow

### 1. Deploy with Hardhat Ignition

#### BaseErc721PropertyNFT Deployment

```bash
# Deploy with default parameters
npx hardhat ignition:deploy ./ignition/modules/BaseErc721PropertyNFT.ts --network sepolia

# Deployment parameters are defined in the ignition module
```

## 🐛 Troubleshooting

### Compilation Errors

- Ensure Node.js 18+ is installed
- Clear cache: `npx hardhat clean`
- Reinstall dependencies: `rm -rf node_modules && npm install`

### Test Failures

- Ensure local node is running: `npx hardhat node`
- Check network configuration in `hardhat.config.js`
- Verify deployed contract addresses in test fixtures

### Deployment Issues

- Check RPC URL and private key in `.env`
- Ensure sufficient testnet ETH
- Verify network configuration in Hardhat config

## 📚 Resources

- [Hardhat Documentation](https://hardhat.org/docs)
- [OpenZeppelin Contracts](https://docs.openzeppelin.com/contracts/)
- [Solidity Documentation](https://soliditylang.org/docs/)
- [Etherscan Verification](https://hardhat.org/plugins/nomicfoundation-hardhat-verify.html)

## 🤝 Contributing

This is an educational project. Contributions welcome!

1. Fork the repository
2. Create a feature branch
3. Make changes with tests
4. Submit a pull request

## 📄 License

MIT

---

**Built with Hardhat** | **Secured by OpenZeppelin**