# Fractional Real Estate NFT - RWA Tokenization Tutorial

![Cover](./images/screenshot_main.png)

> 🎓 **Educational Purpose** - This is a comprehensive hands-on tutorial for learning **Real World Asset (RWA) fractional tokenization** using NFTs. **Not production-ready.**

A decentralized application (dApp) for tokenizing real estate properties into fractional ownership using Solidity smart contracts and non-fungible tokens (NFTs). This tutorial demonstrates full-stack blockchain development with Hardhat, Next.js, and modern Web3 libraries.

## 📚 Tutorial Components

This repository contains **two integrated tutorial modules** that work together to form a complete dApp:

### ⛓️ [hardhat2/](./hardhat2/) - Smart Contract Development (Part 1)

**Comprehensive blockchain tutorial** covering Solidity smart contract development for fractional real estate tokenization.

- **Full Documentation**: [`hardhat2/README.md`](./hardhat2/README.md) (1600+ lines)
- **Core Contracts**: `BaseErc721PropertyNFT.sol` (ERC721 with USDT payments) + `MockUSDT.sol`
- **Key Concepts**: ERC721/ERC20 standards, payment processing, metadata management, Hardhat workflow
- **Testing**: 606+ lines of comprehensive tests across 8 categories
- **Deployment**: Hardhat Ignition modules for localhost and Sepolia testnet
- **Tech**: Solidity ^0.8.28, Hardhat ^2.28.6, OpenZeppelin ^5.6.1

**What you'll learn in `hardhat2/`:**
- Writing secure smart contracts with OpenZeppelin
- Using Hardhat for compilation, testing, and deployment
- Implementing ERC721 NFTs with payment integration
- Testing strategies for blockchain applications
- Deployment to local and testnet environments

---

### 🖥️ [nextjs/](./nextjs/) - Frontend Development (Part 2)

**Full-stack React tutorial** building a modern web3 frontend to interact with the smart contracts.

- **Full Documentation**: [`nextjs/README.md`](./nextjs/README.md) (1144 lines)
- **Framework**: Next.js 15 with React 19 and TypeScript
- **Web3 Stack**: wagmi v2, RainbowKit, viem for Ethereum interactions
- **Architecture**: Clean layered pattern with custom hooks and contract wrappers
- **Pages**: Dashboard with wallet connection, minting interface, property details, transaction history
- **State Management**: TanStack Query for server-state caching

**What you'll learn in `nextjs/`:**
- Next.js application structure with TypeScript
- Web3 integration patterns with wagmi and RainbowKit
- React hooks for blockchain interactions
- Responsive CSS with modern design
- Environment configuration for dApps

## 📋 Overview

This project implements a system where real estate properties are represented as NFTs (ERC721) that can be purchased using USDT, which can then be divided into fractional shares (tokens) that represent ownership stakes. This enables:

- Understanding of NFTs for asset representation
- Secure payment processing with ERC20 tokens
- Property metadata management on-chain
- Hands-on learning with OpenZeppelin contracts
- Practical Hardhat development workflow

## 🏗️ Architecture

### Core Contracts

- **BaseErc721PropertyNFT**: ERC721 implementation for property NFTs with USDT payments
- **MockUSDT**: Mock USDT token for testing payments (ERC20 with 6 decimals)

### Key Features

- ✅ ERC721 Property NFT Minting
- ✅ USDT Payment Integration
- ✅ Property Metadata Storage
- ✅ Owner Administration Controls
- ✅ Configurable Mint Price

## 🛠️ Tech Stack

- **Blockchain**: Ethereum/Sepolia Testnet
- **Smart Contracts**: Solidity ^0.8.27
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
cd Tokenize-Fractional-Real-Estate-NFT-Solidity-HandsOn-Tutorial
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
npx hardhat ignition:deploy ./ignition/modules/BaseErc721PropertyNFT.ts --network localhost
```

Deploy to Sepolia testnet:
```bash
npx hardhat ignition:deploy ./ignition/modules/BaseErc721PropertyNFT.ts --network sepolia
```

### Verify Contracts

Verify deployed contracts on Etherscan:
```bash
npx hardhat verify --network sepolia <contract-address> <constructor-arguments>
```

## 📁 Repository Structure

```
Tokenize-Fractional-Real-Estate-NFT-Solidity-HandsOn-Tutorial/
├── hardhat2/                    # ⛓️ Smart contract tutorial (Part 1)
│   ├── contracts/              # Solidity source files
│   │   ├── BaseErc721PropertyNFT.sol  # Main property NFT contract
│   │   └── MockUSDT.sol                # Test USDT token
│   ├── ignition/               # Hardhat Ignition deployment modules
│   │   └── modules/
│   │       ├── BaseErc721PropertyNFT.ts
│   │       └── MockUSDT.ts
│   ├── test/                   # Comprehensive test suite (606+ lines)
│   │   └── BaseErc721PropertyNFT.test.js
│   ├── artifacts/              # Compiled contract outputs (generated)
│   ├── cache/                  # Hardhat compilation cache (generated)
│   ├── typechain-types/        # TypeScript bindings (generated)
│   ├── .env.example            # Environment variables template
│   ├── hardhat.config.js       # Hardhat configuration
│   ├── package.json            # Dependencies & npm scripts
│   └── README.md               # 📘 Detailed blockchain tutorial (1600+ lines)
│
├── nextjs/                     # 🖥️ Frontend tutorial (Part 2)
│   ├── src/
│   │   ├── pages/              # Next.js Pages Router
│   │   │   ├── _app.tsx        # Root component with providers
│   │   │   └── index.tsx       # Main dashboard (499 lines)
│   │   ├── contracts/          # Smart contract integrations
│   │   │   ├── propertyNFT.ts  # viem wrapper (35 lines)
│   │   │   ├── mockUSDT.ts     # viem wrapper (30 lines)
│   │   │   └── abis/           # Compiled ABIs (JSON)
│   │   ├── hooks/              # Custom React hooks
│   │   │   ├── usePropertyNft.ts   # NFT hook (139 lines)
│   │   │   └── useMockUsdt.ts      # USDT hook (98 lines)
│   │   ├── styles/             # CSS modules
│   │   │   ├── globals.css     # Global dark theme (120 lines)
│   │   │   └── Home.module.css # Component styles (414 lines)
│   │   └── wagmi.ts            # Web3 configuration (65 lines)
│   ├── .env.example            # Frontend environment template
│   ├── next.config.js          # Next.js configuration
│   ├── package.json            # Dependencies
│   ├── tsconfig.json           # TypeScript configuration
│   └── README.md               # 📘 Detailed frontend tutorial (1144 lines)
│
├── docs/                       # 📚 Supplementary documentation
│   ├── CONTRACTS_REFERENCE.md  # Complete API reference (224 lines)
│   └── BASEERC721PROPERTYNFT_TESTS.md  # Testing guide (300+ lines)
│
├── images/                     # 🖼️ Visual documentation (screenshots)
│
├── AGENTS.md                   # OpenCode agent reference
├── opencode.json               # OpenCode configuration
├── README.md                   # This file - tutorial overview
└── LICENSE                     # MIT License
```
.
├── hardhat2/            # Smart contracts and Hardhat setup
│   ├── contracts/          # Solidity smart contracts
│   │   ├── BaseErc721PropertyNFT.sol
│   │   └── MockUSDT.sol
│   ├── ignition/           # Hardhat Ignition deployment modules
│   │   └── modules/
│   │       └── BaseErc721PropertyNFT.ts
│   ├── test/               # Test files
│   │   └── BaseErc721PropertyNFT.test.js
│   ├── .env.example        # Environment variables template
│   ├── hardhat.config.js   # Hardhat configuration
│   └── package.json        # Dependencies
└── nextjs/             # Front-end React application (Next.js)
    ├── src/               # Application source code
    ├── next.config.js     # Next.js configuration
    ├── package.json       # Dependencies
    ├── tsconfig.json      # TypeScript configuration
    └── README.md          # Frontend documentation
```

## 🔍 Contract Workflow

1. **Deployment**
   - Deploy BaseErc721PropertyNFT with initial parameters
   - Configure USDT token address for payments
   - Set mint price and maximum supply

2. **Property Setup**
   - Owner sets property metadata (address, value, type, rooms, baths)
   - Update description, image, and external URL
   - Metadata stored on-chain and returned in tokenURI

3. **Minting & Purchase**
   - Owner can safeMint NFTs to any address
   - Users can purchase NFTs directly with USDT
   - Each NFT represents a unique property

4. **Management**
   - Owner can update mint price
   - Property metadata can be updated at any time
   - All changes are permissioned to contract owner

## 🧪 Testing Strategy

Tests are written in JavaScript using Hardhat's testing framework.

### Test Categories

1. **Unit Tests**: Individual contract functions
2. **Integration Tests**: Multi-contract interactions with MockUSDT
3. **Access Control**: Verify permission boundaries
4. **Edge Cases**: Invalid inputs, boundary conditions, metadata handling

### Test Structure

```javascript
describe("BaseErc721PropertyNFT", function () {
  beforeEach(async function () {
    // Setup fixtures
  });

  it("Should mint a token to the owner (onlyOwner)", async function () {
    // Test implementation
  });
});
```

## 🔒 Security Considerations

- ✅ Reentrancy protection (using transferFrom)
- ✅ Integer overflow/underflow prevention (Solidity 0.8.27)
- ✅ Access control modifiers (onlyOwner)
- ✅ Comprehensive input validation
- ⚠️ External audits recommended before mainnet deployment
- ⚠️ Timelock not implemented (consider adding for production)
- ⚠️ Emergency pause functionality not implemented

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