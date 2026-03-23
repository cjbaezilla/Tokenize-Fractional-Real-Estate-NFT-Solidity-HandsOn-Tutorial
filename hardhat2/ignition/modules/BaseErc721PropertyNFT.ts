import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

const BaseErc721PropertyNFTModule = buildModule("BaseErc721PropertyNFTModule", (m) => {
  // Deployment parameters with defaults
  const initialOwner = m.getParameter("initialOwner", m.env().get("DEPLOYER_ADDRESS") || "0x0000000000000000000000000000000000000000");
  const name = m.getParameter("name", "PropertyNFT");
  const ticker = m.getParameter("ticker", "PROP");
  const maxSupply = m.getParameter("maxSupply", 1000n);
  const mintPrice = m.getParameter("mintPrice", 1000000n); // 1 USDT (6 decimals)
  const usdtToken = m.getParameter("usdtToken", "0x0000000000000000000000000000000000000000");

  // Property metadata parameters
  const propertyAddress = m.getParameter("propertyAddress", "123 Main St, City, Country");
  const propertyValue = m.getParameter("propertyValue", 500000n); // in wei (or appropriate token units)
  const propertyType = m.getParameter("propertyType", "Apartment");
  const propertyRooms = m.getParameter("propertyRooms", 3n);
  const propertyBaths = m.getParameter("propertyBaths", 2n);
  const description = m.getParameter("description", "Beautiful property available for investment");
  const imageData = m.getParameter("imageData", "https://example.com/property-image.jpg");
  const externalUrl = m.getParameter("externalUrl", "https://example.com/property-details");

  // Deploy the contract
  const baseErc721PropertyNFT = m.contract("BaseErc721PropertyNFT", [
    initialOwner,
    name,
    ticker,
    maxSupply,
    mintPrice,
    usdtToken
  ]);

  // Update property metadata after deployment
  m.runAfter(async (contracts, { ethers }) => {
    const contract = contracts.baseErc721PropertyNFT as any;
    const tx = await contract.updatePropertyMetadata(
      propertyAddress,
      propertyValue,
      propertyType,
      propertyRooms,
      propertyBaths,
      description,
      imageData,
      externalUrl
    );
    await tx.wait();
  });

  return { baseErc721PropertyNFT };
});

export default BaseErc721PropertyNFTModule;