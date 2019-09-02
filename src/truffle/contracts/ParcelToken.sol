pragma solidity ^0.5.0;

import "../../../node_modules/@openzeppelin/contracts/token/ERC721/ERC721Full.sol";
import "../../../node_modules/@openzeppelin/contracts/drafts/Counters.sol";

contract ParcelToken is ERC721Full {
    using Counters for Counters.Counter;
    Counters.Counter private tokenIds;

    constructor () ERC721Full("Parcel Token", "PAT") public {}

    function getTokenIds() public view returns (uint256) {
        return tokenIds.current();
    }

    function mintToken(address owner) public {
        tokenIds.increment();

        uint256 newTokenId = tokenIds.current();
        _mint(owner, newTokenId);
    }

    function burnToken(uint256 tokenId) public {
        tokenIds.decrement();
        _burn(tokenId);
    }
}