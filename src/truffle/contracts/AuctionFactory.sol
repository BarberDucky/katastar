pragma solidity ^0.5.0;

import "./ParcelToken.sol";
import "./Auction.sol";

contract AuctionFactory {
    
    ParcelToken _token;
    mapping (uint256 => address) _tokenToAuction;
    
    constructor (address tokenContract) public {
        _token = ParcelToken(tokenContract);
    }
    
    function createAuction(uint256 parcelId, uint256 startPrice, uint duration) public {
        require (isParcelFree(parcelId), "AuctionFactory: parcel is already on auction");
        require (_token.ownerOf(parcelId) == msg.sender, "AuctionFactory: sender must be owner of token");
        require (_token.getApproved(parcelId) == address(this), "AuctionFactory: factory must have approval for token");
        require (startPrice >= 0, "AuctionFactory: starting price must be greater than 0");
        require (duration > 0, "AuctionFactory: auction needs to last at least 1 sec");
        
        Auction newAuction = new Auction (msg.sender, parcelId, address(_token), startPrice, duration);
        _token.safeTransferFrom(msg.sender, address(newAuction), parcelId);
        
        _tokenToAuction[parcelId] = address(newAuction);
    }
    
    function getAuctionByParcelId(uint256 parcelId) public view returns (address) {
        require (_tokenToAuction[parcelId] != address(0), "AuctionFactory: no auction for parcel");
        return _tokenToAuction[parcelId];
    }
    
    function isParcelFree(uint parcelId) public view returns (bool) {
        address auctionAddress = _tokenToAuction[parcelId];
        
        return auctionAddress == address(0) ||
            Auction(auctionAddress).isOver();
    }
}