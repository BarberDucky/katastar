pragma solidity ^0.5.0;

import "./ParcelToken.sol";

contract Inheritance is IERC721Receiver{
    
    address _owner;
    address tokenOwner;
    uint256 _parcelId;
    uint _deadline;
    address _to;
    bool _isWithdrawn;
    ParcelToken _token;
    
    
    constructor(address owner, address tokenContract, uint256 parcelId, address to, uint duration) public {
        _token = ParcelToken(tokenContract);
        //require (duration > 1 days, "Inheritance: duration must be > 1 days");
        require (msg.sender != to, "Inheritance: to can't be sender");
        _owner = owner;
        _parcelId = parcelId;
        _to = to;
        _deadline = now + duration;
        _isWithdrawn = false;
    }
    
    function getDeadline() public view returns(uint) {
        if (now > _deadline) {
            return 0;

        } else {
            return _deadline - now;
        
        }
    }
    
    function getParcelId() public view returns(uint256) {
        return _parcelId;
    }
    
    function isWithdrawn() public view returns(bool) {
        return _isWithdrawn;
    }
    
    function withdraw() public {
        require (_isWithdrawn == false, "Inheritance: token is withdrawn already");
        require (msg.sender == _owner || msg.sender == _to, "Inheritance: only sender and to can withdraw ");
        
        if (msg.sender == address(_owner)) {
            require (now < _deadline, "Inheritance: dealine is over for owner");
            _token.safeTransferFrom(address(this), msg.sender, _parcelId);
        } else {
             require (now >= _deadline, "Inheritance: deadline is not over for to");
            _token.safeTransferFrom(address(this), msg.sender, _parcelId);
        }
        _isWithdrawn = true;
    }
    
    function onERC721Received(address operator, address from, uint256 tokenId, bytes memory data)
    public returns (bytes4) {
        return this.onERC721Received.selector;
    }
    
}