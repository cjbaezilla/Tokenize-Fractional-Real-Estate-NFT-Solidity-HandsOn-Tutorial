// SPDX-License-Identifier: MIT
// Compatible with OpenZeppelin Contracts ^5.6.0
pragma solidity ^0.8.27;

import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";
import {ERC721} from "@openzeppelin/contracts/token/ERC721/ERC721.sol";

contract BaseErc721PropertyNFT is ERC721, Ownable {
    uint256 private _nextTokenId;
    uint256 public immutable maxSupply;

    constructor(address initialOwner, string memory name, string memory ticker, uint256 _maxSupply)
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
}