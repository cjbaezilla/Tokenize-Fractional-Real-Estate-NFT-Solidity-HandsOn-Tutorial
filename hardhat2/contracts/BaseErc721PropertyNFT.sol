// SPDX-License-Identifier: MIT
// Compatible with OpenZeppelin Contracts ^5.6.0
pragma solidity ^0.8.27;

import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";
import {ERC721} from "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import {Strings} from "@openzeppelin/contracts/utils/Strings.sol";

contract BaseErc721PropertyNFT is ERC721, Ownable {
    uint256 private _nextTokenId;
    uint256 public immutable maxSupply;
    
    struct PropertyMetadata {
        string propertyAddress;
        uint256 propertyValue;
        string propertyType;
        string description;
        string imageData;
    }
    
    PropertyMetadata private _propertyMetadata;

    constructor(
        address initialOwner,
        string memory name,
        string memory ticker,
        uint256 _maxSupply
    )
        ERC721(name, ticker)
        Ownable(initialOwner)
    {
        maxSupply = _maxSupply;
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
        string memory description,
        string memory imageData
    ) public onlyOwner {
        _propertyMetadata = PropertyMetadata({
            propertyAddress: propertyAddress,
            propertyValue: propertyValue,
            propertyType: propertyType,
            description: description,
            imageData: imageData
        });
    }

    function tokenURI(uint256 tokenId) public view override returns (string memory) {
        require(tokenId < _nextTokenId, "Token does not exist");
        
        PropertyMetadata memory metadata = _propertyMetadata;
        
        string memory json = string(abi.encodePacked(
            '{"name": "Property #', 
            Strings.toString(tokenId), 
            '", "description": "', 
            metadata.description, 
            '", "image": "', 
            metadata.imageData, 
            '", "properties": {',
            '"address": "', metadata.propertyAddress, '",',
            '"value": ', Strings.toString(metadata.propertyValue), ',',
            '"type": "', metadata.propertyType, '"',
            '}}'
        ));
        
        return json;
    }
    
    function getPropertyMetadata() public view returns (PropertyMetadata memory) {
        return _propertyMetadata;
    }
}