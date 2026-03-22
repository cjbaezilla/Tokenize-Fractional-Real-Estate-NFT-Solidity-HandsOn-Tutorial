# Fractional Real Estate NFT

> ⚠️ **Educational Purpose Only** - This is a hands-on learning project for tutorial purposes. **Not production-ready.**

A decentralized application (dApp) for tokenizing real estate properties into fractional ownership using Solidity smart contracts and non-fungible tokens (NFTs). Built with Hardhat and following industry best practices.

## 📋 Overview

This project implements a system where real estate properties are represented as NFTs, which can then be divided into fractional shares (tokens) that represent ownership stakes. This enables:

- Democratization of real estate investment
- Increased liquidity in real estate markets
- Transparent ownership tracking on the blockchain
- Automated dividend distribution from rental income
- Governance rights for property decisions

## 🏗️ Architecture

### Core Contracts

- **RealEstateNFT**: ERC721 implementation for property deeds
- **FractionalOwnership**: ERC20 implementation for ownership shares
- **PropertyManager**: Administrative contract for property registration and management
- **DividendDistributor**: Handles rent distribution to fractional owners

### Key Features

- ✅ Property Registration & Verification
- ✅ Fractional Token Minting
- ✅ Transfer of Ownership (both NFTs and fractions)
- ✅ Automated Dividend Distribution
- ✅ Governance Voting for Property Decisions
- ✅ Buy/Sell Marketplace Functionality
- ✅ Emergency Withdrawal Protection

## 🛠️ Tech Stack

- **Blockchain**: Ethereum/Sepolia Testnet
- **Smart Contracts**: Solidity ^0.8.28
- **Development Framework**: Hardhat ^2.28.6
- **Testing**: Chai + Hardhat Network
- **Type Safety**: TypeChain
- **Verification**: Hardhat Verify Plugin
- **Dependencies**: OpenZeppelin Contracts ^5.6.1

## 🚀 Getting Started

### Prerequisites

- Node.js (v18+ recommended)
- npm or yarn
- Git

### Installation

1. Clone the repository
```bash
git clone <repository-url>
cd hardhat2
```

2. Install dependencies
```bash
npm install
```

3. Configure environment variables
```bash
cp .env.example .env
```

Edit `.env` and add your configuration:
```
SEPOLIA_RPC_URL=your_alchemy_or_infura_url
PRIVATE_KEY=your_private_key_without_0x_prefix
ETHERSCAN_API_KEY=your_etherscan_api_key
```

### Compilation

Compile the smart contracts:
```bash
npx hardhat compile
```

### Testing

Run the test suite:
```bash
npx hardhat test
```

Run tests with coverage:
```bash
npx hardhat coverage
```

### Deployment

Deploy to local network:
```bash
npx hardhat node
npx hardhat ignition:deploy ./ignition/modules/FractionalRealEstate.ts --network localhost
```

Deploy to Sepolia testnet:
```bash
npx hardhat ignition:deploy ./ignition/modules/FractionalRealEstate.ts --network sepolia
```

### Verify Contracts

Verify deployed contracts on Etherscan:
```bash
npx hardhat verify --network sepolia <contract-address> <constructor-arguments>
```

## 📁 Project Structure

```
hardhat2/
├── contracts/          # Solidity smart contracts
│   ├── RealEstateNFT.sol
│   ├── FractionalOwnership.sol
│   ├── PropertyManager.sol
│   └── DividendDistributor.sol
├── ignition/           # Hardhat Ignition deployment modules
│   └── modules/
│       └── FractionalRealEstate.ts
├── test/               # Test files
│   ├── RealEstateNFT.test.ts
│   ├── FractionalOwnership.test.ts
│   └── PropertyManager.test.ts
├── scripts/            # Deployment and utility scripts
├── .env.example        # Environment variables template
├── hardhat.config.js   # Hardhat configuration
└── package.json        # Dependencies
```

## 🔍 Contract Workflow

1. **Property Registration**
   - Property owner registers property via PropertyManager
   - Property metadata (address, value, legal docs hash) stored on-chain
   - ERC721 NFT minted to represent property deed

2. **Fractionalization**
   - Owner chooses number of fractions to mint
   - FractionalOwnership contract mints ERC20 tokens
   - Each token represents percentage ownership
   - Fractions become tradable

3. **Ownership Transfer**
   - NFT can be transferred to new owner
   - Fractions can be freely traded on secondary markets
   - All transfers recorded immutably on blockchain

4. **Income Distribution**
   - Rental income sent to DividendDistributor
   - Proportional distributions to all fractional holders
   - Withdrawable by token holders anytime

5. **Governance**
   - Major property decisions put to vote
   - Voting power proportional to fraction ownership
   - Timelock for implementation of decisions

## 🧪 Testing Strategy

- **Unit Tests**: Individual contract functionality
- **Integration Tests**: Multi-contract interactions
- **Fork Tests**: Tests against live network state
- **Gas Optimization**: Gas usage benchmarking

## 🔒 Security Considerations

- ✅ Reentrancy protection
- ✅ Integer overflow/underflow prevention
- ✅ Access control modifiers
- ✅ Timelock for critical operations
- ✅ Pausable functionality for emergencies
- ✅ Comprehensive input validation
- ⚠️ External audits recommended before mainnet deployment

## 🤝 Contributing

Contributions are welcome! Please read the contributing guidelines before submitting PRs.

## 📄 License

MIT License - see LICENSE file for details

## ⚠️ Disclaimer

This is an educational project for hands-on learning purposes. **Not production-ready**. Real estate tokenization involves complex legal and regulatory considerations. Always consult with legal and financial professionals before implementing real-world solutions.

## 📚 Resources

- [OpenZeppelin Contracts Documentation](https://docs.openzeppelin.com/contracts/)
- [Hardhat Documentation](https://hardhat.org/docs)
- [Ethereum Development Resources](https://ethereum.org/en/developers/)

---

**Built with Hardhat** | **Secured by OpenZeppelin**