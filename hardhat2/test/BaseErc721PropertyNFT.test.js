const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("BaseErc721PropertyNFT", function () {
  let BaseErc721PropertyNFT;
  let baseErc721PropertyNFT;
  let owner;
  let nonOwner;
  let anotherUser;

  const NAME = "TestPropertyNFT";
  const SYMBOL = "TPNFT";
  const MAX_SUPPLY = 100;
  const MINT_PRICE = ethers.parseEther("0.1");

  const PROPERTY_ADDRESS = "123 Main St, New York, NY";
  const PROPERTY_VALUE = 500000;
  const PROPERTY_TYPE = "Apartment";
  const PROPERTY_ROOMS = 3;
  const PROPERTY_BATHS = 2;
  const DESCRIPTION = "Beautiful apartment in downtown";
  const IMAGE_DATA = "ipfs://Qm...";
  const EXTERNAL_URL = "https://example.com/property/1";

  beforeEach(async function () {
    // Get signers
    [owner, nonOwner, anotherUser] = await ethers.getSigners();

    // Deploy contract
    BaseErc721PropertyNFT = await ethers.getContractFactory(
      "BaseErc721PropertyNFT"
    );
    baseErc721PropertyNFT = await BaseErc721PropertyNFT.deploy(
      owner.address,
      NAME,
      SYMBOL,
      MAX_SUPPLY,
      MINT_PRICE
    );
    await baseErc721PropertyNFT.waitForDeployment();
  });

  describe("Deployment", function () {
    it("Should set the correct name and symbol", async function () {
      expect(await baseErc721PropertyNFT.name()).to.equal(NAME);
      expect(await baseErc721PropertyNFT.symbol()).to.equal(SYMBOL);
    });

    it("Should set the correct initial owner", async function () {
      expect(await baseErc721PropertyNFT.owner()).to.equal(owner.address);
    });

    it("Should set the correct max supply", async function () {
      expect(await baseErc721PropertyNFT.maxSupply()).to.equal(MAX_SUPPLY);
    });

    it("Should set the correct mint price", async function () {
      expect(await baseErc721PropertyNFT.mintPrice()).to.equal(MINT_PRICE);
    });
  });

  describe("Minting", function () {
    it("Should mint a token to the owner (onlyOwner)", async function () {
      await expect(baseErc721PropertyNFT.connect(nonOwner).safeMint(nonOwner.address))
        .to.be.reverted; // Only owner can mint

      const tx = await baseErc721PropertyNFT.safeMint(nonOwner.address);
      await tx.wait();

      expect(await baseErc721PropertyNFT.ownerOf(0)).to.equal(nonOwner.address);
      expect(await baseErc721PropertyNFT.balanceOf(nonOwner.address)).to.equal(1);
    });

    it("Should increment token IDs correctly", async function () {
      await baseErc721PropertyNFT.safeMint(nonOwner.address);
      await baseErc721PropertyNFT.safeMint(anotherUser.address);
      await baseErc721PropertyNFT.safeMint(nonOwner.address);

      expect(await baseErc721PropertyNFT.ownerOf(0)).to.equal(nonOwner.address);
      expect(await baseErc721PropertyNFT.ownerOf(1)).to.equal(anotherUser.address);
      expect(await baseErc721PropertyNFT.ownerOf(2)).to.equal(nonOwner.address);
    });

    it("Should not exceed max supply", async function () {
      // Mint all available tokens
      for (let i = 0; i < MAX_SUPPLY; i++) {
        await baseErc721PropertyNFT.safeMint(owner.address);
      }

      await expect(baseErc721PropertyNFT.safeMint(nonOwner.address))
        .to.be.revertedWith("Max supply exceeded");
    });

    it("Should emit Transfer event on mint", async function () {
      await expect(baseErc721PropertyNFT.safeMint(nonOwner.address))
        .to.emit(baseErc721PropertyNFT, "Transfer")
        .withArgs(ethers.ZeroAddress, nonOwner.address, 0);
    });
  });

  describe("Property Metadata", function () {
    beforeEach(async function () {
      await baseErc721PropertyNFT.safeMint(owner.address);
    });

    it("Should update all property metadata (onlyOwner)", async function () {
      await expect(
        baseErc721PropertyNFT.connect(nonOwner).updatePropertyMetadata(
          PROPERTY_ADDRESS,
          PROPERTY_VALUE,
          PROPERTY_TYPE,
          PROPERTY_ROOMS,
          PROPERTY_BATHS,
          DESCRIPTION,
          IMAGE_DATA,
          EXTERNAL_URL
        )
      ).to.be.reverted;

      const tx = await baseErc721PropertyNFT.updatePropertyMetadata(
        PROPERTY_ADDRESS,
        PROPERTY_VALUE,
        PROPERTY_TYPE,
        PROPERTY_ROOMS,
        PROPERTY_BATHS,
        DESCRIPTION,
        IMAGE_DATA,
        EXTERNAL_URL
      );
      await tx.wait();

      expect(await baseErc721PropertyNFT.getPropertyAddress()).to.equal(
        PROPERTY_ADDRESS
      );
      expect(await baseErc721PropertyNFT.getPropertyValue()).to.equal(
        PROPERTY_VALUE
      );
      expect(await baseErc721PropertyNFT.getPropertyType()).to.equal(
        PROPERTY_TYPE
      );
      expect(await baseErc721PropertyNFT.getPropertyRooms()).to.equal(
        PROPERTY_ROOMS
      );
      expect(await baseErc721PropertyNFT.getPropertyBaths()).to.equal(
        PROPERTY_BATHS
      );
      expect(await baseErc721PropertyNFT.getDescription()).to.equal(
        DESCRIPTION
      );
      expect(await baseErc721PropertyNFT.getImageData()).to.equal(IMAGE_DATA);
      expect(await baseErc721PropertyNFT.getExternalUrl()).to.equal(
        EXTERNAL_URL
      );
    });

    it("Should update individual fields correctly", async function () {
      // Update address
      await baseErc721PropertyNFT.updatePropertyAddress("456 Oak Ave");
      expect(await baseErc721PropertyNFT.getPropertyAddress()).to.equal(
        "456 Oak Ave"
      );

      // Update value
      await baseErc721PropertyNFT.updatePropertyValue(750000);
      expect(await baseErc721PropertyNFT.getPropertyValue()).to.equal(750000);

      // Update type
      await baseErc721PropertyNFT.updatePropertyType("House");
      expect(await baseErc721PropertyNFT.getPropertyType()).to.equal("House");

      // Update rooms
      await baseErc721PropertyNFT.updatePropertyRooms(4);
      expect(await baseErc721PropertyNFT.getPropertyRooms()).to.equal(4);

      // Update baths
      await baseErc721PropertyNFT.updatePropertyBaths(3);
      expect(await baseErc721PropertyNFT.getPropertyBaths()).to.equal(3);

      // Update description
      await baseErc721PropertyNFT.updateDescription("Spacious family home");
      expect(await baseErc721PropertyNFT.getDescription()).to.equal(
        "Spacious family home"
      );

      // Update image
      await baseErc721PropertyNFT.updateImageData("ipfs://QmNew...");
      expect(await baseErc721PropertyNFT.getImageData()).to.equal(
        "ipfs://QmNew..."
      );

      // Update external URL
      await baseErc721PropertyNFT.updateExternalUrl(
        "https://example.com/property/2"
      );
      expect(await baseErc721PropertyNFT.getExternalUrl()).to.equal(
        "https://example.com/property/2"
      );
    });

    it("Should restrict individual updates to owner only", async function () {
      await expect(
        baseErc721PropertyNFT.connect(nonOwner).updatePropertyAddress("New Address")
      ).to.be.reverted;

      await expect(
        baseErc721PropertyNFT.connect(nonOwner).updatePropertyValue(1000000)
      ).to.be.reverted;

      await expect(
        baseErc721PropertyNFT.connect(nonOwner).updatePropertyType("Villa")
      ).to.be.reverted;
    });
  });

  describe("Mint Price", function () {
    it("Should update mint price (onlyOwner)", async function () {
      const newPrice = ethers.parseEther("0.2");

      await expect(
        baseErc721PropertyNFT.connect(nonOwner).setMintPrice(newPrice)
      ).to.be.reverted;

      await baseErc721PropertyNFT.setMintPrice(newPrice);
      expect(await baseErc721PropertyNFT.mintPrice()).to.equal(newPrice);
    });
  });

  describe("tokenURI", function () {
    it("Should revert for non-existent token", async function () {
      await expect(baseErc721PropertyNFT.tokenURI(0)).to.be.revertedWith(
        "Token does not exist"
      );
    });

    it("Should return correct JSON format with default empty values", async function () {
      await baseErc721PropertyNFT.safeMint(nonOwner.address);

      const tokenURI = await baseErc721PropertyNFT.tokenURI(0);

      // Should be valid JSON
      const parsed = JSON.parse(tokenURI);

      expect(parsed.name).to.equal("Property #0");
      expect(parsed.description).to.equal("");
      expect(parsed.image).to.equal("");
      expect(parsed.external_url).to.equal("");
      expect(parsed.attributes).to.be.an("array").with.lengthOf(5);

      // Check attributes - numeric attributes should be numbers, not strings
      expect(parsed.attributes[0].trait_type).to.equal("Type");
      expect(parsed.attributes[0].value).to.equal("");
      expect(parsed.attributes[1].trait_type).to.equal("Value");
      expect(parsed.attributes[1].value).to.equal(0); // number
      expect(parsed.attributes[2].trait_type).to.equal("Address");
      expect(parsed.attributes[2].value).to.equal("");
      expect(parsed.attributes[3].trait_type).to.equal("Rooms");
      expect(parsed.attributes[3].value).to.equal(0); // number
      expect(parsed.attributes[4].trait_type).to.equal("Bathrooms");
      expect(parsed.attributes[4].value).to.equal(0); // number
    });

    it("Should return correct JSON format with updated metadata", async function () {
      await baseErc721PropertyNFT.safeMint(nonOwner.address);
      await baseErc721PropertyNFT.updatePropertyMetadata(
        PROPERTY_ADDRESS,
        PROPERTY_VALUE,
        PROPERTY_TYPE,
        PROPERTY_ROOMS,
        PROPERTY_BATHS,
        DESCRIPTION,
        IMAGE_DATA,
        EXTERNAL_URL
      );

      const tokenURI = await baseErc721PropertyNFT.tokenURI(0);
      const parsed = JSON.parse(tokenURI);

      expect(parsed.name).to.equal("Property #0");
      expect(parsed.description).to.equal(DESCRIPTION);
      expect(parsed.image).to.equal(IMAGE_DATA);
      expect(parsed.external_url).to.equal(EXTERNAL_URL);
      expect(parsed.attributes).to.be.an("array").with.lengthOf(5);

      expect(parsed.attributes[0]).to.deep.equal({
        trait_type: "Type",
        value: PROPERTY_TYPE
      });
      expect(parsed.attributes[1]).to.deep.equal({
        trait_type: "Value",
        value: PROPERTY_VALUE // number, not string
      });
      expect(parsed.attributes[2]).to.deep.equal({
        trait_type: "Address",
        value: PROPERTY_ADDRESS
      });
      expect(parsed.attributes[3]).to.deep.equal({
        trait_type: "Rooms",
        value: PROPERTY_ROOMS // number
      });
      expect(parsed.attributes[4]).to.deep.equal({
        trait_type: "Bathrooms",
        value: PROPERTY_BATHS // number
      });
    });
  });

  describe("Ownable", function () {
    it("Should transfer ownership correctly", async function () {
      await baseErc721PropertyNFT.transferOwnership(anotherUser.address);
      expect(await baseErc721PropertyNFT.owner()).to.equal(anotherUser.address);
    });

    it("Should only allow owner to transfer ownership", async function () {
      await expect(
        baseErc721PropertyNFT.connect(nonOwner).transferOwnership(anotherUser.address)
      ).to.be.reverted;
    });

    it("Should allow new owner to perform owner-only actions", async function () {
      await baseErc721PropertyNFT.transferOwnership(anotherUser.address);

      // new owner should be able to mint
      await baseErc721PropertyNFT.connect(anotherUser).safeMint(nonOwner.address);
      expect(await baseErc721PropertyNFT.ownerOf(0)).to.equal(nonOwner.address);
    });
  });

  describe("ERC721 Compliance", function () {
    it("Should implement ERC721 interface", async function () {
      // Check that all standard ERC721 functions are available
      expect(await baseErc721PropertyNFT.supportsInterface("0x80ac58cd")).to.equal(true); // ERC721 interface ID
    });

    it("Should handle token approvals correctly", async function () {
      await baseErc721PropertyNFT.safeMint(nonOwner.address);

      // Approve another user to transfer token
      await baseErc721PropertyNFT.connect(nonOwner).approve(
        anotherUser.address,
        0
      );
      expect(await baseErc721PropertyNFT.getApproved(0)).to.equal(
        anotherUser.address
      );

      // Set operator approval
      await baseErc721PropertyNFT.connect(nonOwner).setApprovalForAll(
        anotherUser.address,
        true
      );
      expect(await baseErc721PropertyNFT.isApprovedForAll(
        nonOwner.address,
        anotherUser.address
      )).to.equal(true);
    });
  });

  describe("Edge Cases", function () {
    it("Should handle multiple mints and maintain token IDs", async function () {
      const recipients = [nonOwner.address, anotherUser.address, owner.address];
      for (let i = 0; i < 5; i++) {
        await baseErc721PropertyNFT.safeMint(recipients[i % 3]);
      }

      // Verify each token exists and has correct owner
      for (let i = 0; i < 5; i++) {
        expect(await baseErc721PropertyNFT.ownerOf(i)).to.equal(
          recipients[i % 3]
        );
      }
    });

    it("Should allow metadata updates without minting first", async function () {
      // Owner should be able to set metadata even before minting any tokens
      await baseErc721PropertyNFT.updatePropertyMetadata(
        PROPERTY_ADDRESS,
        PROPERTY_VALUE,
        PROPERTY_TYPE,
        PROPERTY_ROOMS,
        PROPERTY_BATHS,
        DESCRIPTION,
        IMAGE_DATA,
        EXTERNAL_URL
      );

      expect(await baseErc721PropertyNFT.getPropertyAddress()).to.equal(
        PROPERTY_ADDRESS
      );
    });

    it("Should maintain metadata separately from token existence", async function () {
      // Metadata is global for all tokens, not per-token
      await baseErc721PropertyNFT.updatePropertyMetadata(
        "Address 1",
        100,
        "Type 1",
        1,
        1,
        "Desc 1",
        "Image 1",
        "URL 1"
      );

      await baseErc721PropertyNFT.safeMint(nonOwner.address);
      let tokenURI = await baseErc721PropertyNFT.tokenURI(0);
      expect(tokenURI).to.include("Address 1");

      // Update metadata after minting
      await baseErc721PropertyNFT.updatePropertyMetadata(
        "Address 2",
        200,
        "Type 2",
        2,
        2,
        "Desc 2",
        "Image 2",
        "URL 2"
      );

      // New token should have new metadata (since it's global)
      await baseErc721PropertyNFT.safeMint(anotherUser.address);
      tokenURI = await baseErc721PropertyNFT.tokenURI(1);
      expect(tokenURI).to.include("Address 2");
      expect(tokenURI).to.include("Desc 2");
    });
  });
});
