pragma solidity ^0.5.0;

import "./ParcelToken.sol";

contract Auction is IERC721Receiver {
    address _owner;
    uint256 _parcelId;
    ParcelToken _token;
    uint256 _startPrice;
    uint256 _highestBid;
    address _highestBidder;
    uint256 _deadline;
    
    mapping(address => uint) _bidderToAmount;
    
    constructor(address owner, uint256 parcelId, address tokenContract, uint256 startPrice, uint256 duration) public {
        require (startPrice >= 0, "Auction: starting price must be greater than 0");
        _token = ParcelToken(tokenContract);
        require (_token.ownerOf(parcelId) == owner, "Auction: creator must own the token");
        _owner = owner;
        _parcelId = parcelId;
        _startPrice = startPrice;
        _highestBid = 0;
        _highestBidder = address(0);
        _deadline = now + duration;
    }
    
    function isOver() public view returns (bool) {
        return now >= _deadline;
    }
    
    function getHighestBid() public view returns (uint256) {
        return _highestBid;
    }

    function getParcelId() public view returns (uint256) {
        return _parcelId;
    }
    
    function bid() public payable {
        require (now < _deadline, "Auction: auction has ended");
        require (_highestBid < msg.value, "Auction: bid is too low");
        require (msg.sender != _owner, "Auction: owner can't bid");
        
        if (_highestBid != 0) {
            _bidderToAmount[_highestBidder] += _highestBid;
        }
        
        _highestBidder = msg.sender;
        _highestBid = msg.value;
    }
    
    function withdrawBids() public {
        require (msg.sender != _owner, "Auction: owner cant withdraw bids");
        require (now >= _deadline, "Auction: the auction isn't over");

        uint256 amount = _bidderToAmount[msg.sender];
        
        if (amount > 0) {
            
            _bidderToAmount[msg.sender] = 0;
            
            if (!msg.sender.send(amount)) {
                _bidderToAmount[msg.sender] = amount;
            }
        }
    }
    
    function endAuction() public {
        require (msg.sender == _owner, "Auction: only owner can end the auction");
        require (now >= _deadline, "Auction: the auction isn't over");
        
        if (_highestBidder == address(0)) {
            _token.safeTransferFrom(address(this), msg.sender, _parcelId);
        } 
        else {
            msg.sender.transfer(_highestBid);
            _token.safeTransferFrom(address(this), _highestBidder, _parcelId);
        }
    }
    
    function onERC721Received(address operator, address from, uint256 tokenId, bytes memory data)
    public returns (bytes4) {
        return this.onERC721Received.selector;
    }
}