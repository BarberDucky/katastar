pragma solidity ^0.5.0;

import "./ParcelToken.sol";
import "./Inheritance.sol";

contract InheritanceFactory {
    
    ParcelToken _token;
    mapping (uint256 => address) _tokenToInheritance;
    
    constructor (address tokenContract) public {
        _token = ParcelToken(tokenContract);
    }
    
    function createInheritance(uint256 parcelId, address to, uint duration) public {
        require (_token.ownerOf(parcelId) == msg.sender, "InheritanceFactory: sender must be owner of token");
        require (_token.getApproved(parcelId) == address(this), "InheritanceFactory: factory must have approval for token");
        //require (duration > 1 days, "Inheritance: duration must be > 1 days");
        require (msg.sender != to, "Inheritance: to can't be sender");
        
        Inheritance newInheritance = new Inheritance (msg.sender, address(_token), parcelId, to, duration);
        _token.safeTransferFrom(msg.sender, address(newInheritance), parcelId);
        
        _tokenToInheritance[parcelId] = address(newInheritance);
    }
    
    function getInheritanceByParcelId(uint256 parcelId) public view returns(address) {
        require (_tokenToInheritance[parcelId] != address(0), "InheritanceFactory: no inheritance for parcel");
        return _tokenToInheritance[parcelId];
    }
    
    function isParcelFree(uint parcelId) public view returns(bool) {
        address inheritanceAddress = _tokenToInheritance[parcelId];
        
        return inheritanceAddress == address(0) ||
            Inheritance(inheritanceAddress).isWithdrawn();
    }
}