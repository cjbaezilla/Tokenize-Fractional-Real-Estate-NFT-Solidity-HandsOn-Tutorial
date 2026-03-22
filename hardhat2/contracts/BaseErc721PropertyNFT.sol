// SPDX-License-Identifier: MIT
// Compatible with OpenZeppelin Contracts ^5.6.0
pragma solidity ^0.8.27;

import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";
import {ERC721} from "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import {Strings} from "@openzeppelin/contracts/utils/Strings.sol";

contract BaseErc721PropertyNFT is ERC721, Ownable {
    uint256 private _nextTokenId;
    uint256 public immutable maxSupply;
    
    // Price in wei considering 6 decimals for USDT (1 USDT = 1e6)
    uint256 public mintPrice; 
    
    // Individual property metadata storage
    string private _propertyAddress;
    uint256 private _propertyValue;
    string private _propertyType;
    uint256 private _propertyRooms;
    uint256 private _propertyBaths;
    string private _description;
    string private _imageData;
    string private _externalUrl;

    constructor(
        address initialOwner,
        string memory name,
        string memory ticker,
        uint256 _maxSupply,
        uint256 _mintPrice
    )
        ERC721(name, ticker)
        Ownable(initialOwner)
    {
        maxSupply = _maxSupply;
        mintPrice = _mintPrice;
    }

    function safeMint(address to) public onlyOwner returns (uint256) {
        require(_nextTokenId < maxSupply, "Max supply exceeded");
        uint256 tokenId = _nextTokenId++;
        _safeMint(to, tokenId);
        return tokenId;
    }

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

    function updatePropertyAddress(string memory propertyAddress) public onlyOwner {
        _propertyAddress = propertyAddress;
    }

    function updatePropertyValue(uint256 propertyValue) public onlyOwner {
        _propertyValue = propertyValue;
    }

    function updatePropertyType(string memory propertyType) public onlyOwner {
        _propertyType = propertyType;
    }

    function updatePropertyRooms(uint256 propertyRooms) public onlyOwner {
        _propertyRooms = propertyRooms;
    }

    function updatePropertyBaths(uint256 propertyBaths) public onlyOwner {
        _propertyBaths = propertyBaths;
    }

    function updateDescription(string memory description) public onlyOwner {
        _description = description;
    }

    function updateImageData(string memory imageData) public onlyOwner {
        _imageData = imageData;
    }

    function updateExternalUrl(string memory externalUrl) public onlyOwner {
        _externalUrl = externalUrl;
    }

    function setMintPrice(uint256 _mintPrice) public onlyOwner {
        mintPrice = _mintPrice;
    }

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
    
    function getPropertyAddress() public view returns (string memory) {
        return _propertyAddress;
    }

    function getPropertyValue() public view returns (uint256) {
        return _propertyValue;
    }

    function getPropertyType() public view returns (string memory) {
        return _propertyType;
    }

    function getPropertyRooms() public view returns (uint256) {
        return _propertyRooms;
    }

    function getPropertyBaths() public view returns (uint256) {
        return _propertyBaths;
    }

    function getDescription() public view returns (string memory) {
        return _description;
    }

    function getImageData() public view returns (string memory) {
        return _imageData;
    }

    function getExternalUrl() public view returns (string memory) {
        return _externalUrl;
    }
}