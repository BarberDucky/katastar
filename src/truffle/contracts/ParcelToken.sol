pragma solidity ^0.5.0;

import "../../../node_modules/@openzeppelin/contracts/token/ERC721/ERC721Full.sol";
import "../../../node_modules/@openzeppelin/contracts/drafts/Counters.sol";

contract ParcelToken is ERC721Full {
    using Counters for Counters.Counter;
    Counters.Counter private tokenIds;

    constructor () ERC721Full("Parcel Token", "PAT") public {}

    function mintToken(address owner) public returns (uint256) {
        tokenIds.increment();

        uint256 newTokenId = tokenIds.current();
        _mint(owner, newTokenId);

        return newTokenId;
    }
}