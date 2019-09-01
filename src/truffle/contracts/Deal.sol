pragma solidity ^0.5.0;

import "./ParcelToken.sol";


contract Deal is IERC721Receiver {
    
    struct Asset {
        address user;
        uint256 eth;
        uint256 parcel;
    }
    
    ParcelToken token;
    
    address user1;
    address user2;
    mapping (address => Asset) userRequests;
    mapping (address => Asset) userReceives;
    
    mapping (address => bool) parcelsPayedByUser;
    mapping (address => bool) ethPayedByUser;

    mapping (address => bool) userCollected;
    
    constructor(
        address _tokenContract,
        address _user1, address _user2,
        uint256 eth1, uint256 eth2,
        uint256 parcel1, uint256 parcel2
    ) public {
        require (_user1 != _user2, "Deal: users can't be the same");
        require (eth1 >= 0 && eth2 >= 0, "Deal: ethereum amounts can't be negative");
        
        token = ParcelToken(_tokenContract);
        
        userRequests[_user1] = Asset(_user1, eth1, parcel1);
        userRequests[_user2] = Asset(_user2, eth2, parcel2);
        
        user1 = _user1;
        user2 = _user2;
    }
    
    function getUserRequests(address user) public view returns (uint256, uint256) {
        require (user == user1 || user == user2, "Deal: user isn't part of the deal");
        return (userRequests[user].eth, userRequests[user].parcel);
    }

    function getUserReceives(address user) public view returns (uint256, uint256) {
        require (user == user1 || user == user2, "Deal: user isn't part of the deal");
        return (userReceives[user].eth, userReceives[user].parcel);
    }

    function checkUserSettled(address user) public view returns (bool) {
        _checkUserSettled(user);
    }

    function _checkUserSettled(address user) internal view returns (bool) {
        require (user == user1 || user == user2, "Deal: user isn't part of the deal");
        return userReceives[user].eth == userRequests[user].eth &&
          userReceives[user].parcel == userRequests[user].parcel;
    }
    
    function isSettled() public view returns (bool) {
        return _checkUserSettled(user1) &&
          _checkUserSettled(user2);
    }
    
    function withdraw() public onlyParticipants {
        if (isSettled()) {
            require (!userCollected[msg.sender], "Deal: user already collected assets ");
            if (userRequests[msg.sender].parcel != 0) 
                token.safeTransferFrom(address(this), msg.sender, userRequests[msg.sender].parcel);
            if (userRequests[msg.sender].eth != 0) 
                msg.sender.transfer(userRequests[msg.sender].eth);
            userCollected[msg.sender] = true;
        } 
        else {
            address other = msg.sender == user1 ? user2 : user1;
            if (userReceives[other].parcel != 0)
                token.safeTransferFrom(address(this), msg.sender, userReceives[other].parcel);
            if (userReceives[other].eth != 0) 
                msg.sender.transfer(userReceives[other].eth);
            userReceives[other].eth = 0;
            userReceives[other].parcel = 0;
        } 
    }
    
    function payEth() public payable onlyParticipants {
        require (!isSettled(), "Deal: deal already settled");
        address other = msg.sender == user1 ? user2 : user1;
        
        require (userReceives[other].eth == 0 , "Deal: eth already payed");
        require (msg.value == userRequests[other].eth, "Deal: please pay the requested amount");
        
        userReceives[other].eth = msg.value;
    }
    
    function onERC721Received(address operator, address from, uint256 tokenId, bytes memory data)
    public returns (bytes4) {
        require (!isSettled(), "Deal: deal already settled");
        require (from == user1 || from == user2, "Deal: user isn't part of the deal");
        
        address other = from == user1 ? user2 : user1;
        require (userRequests[other].parcel == tokenId, "Deal: received unrequested parcel");
        
        userReceives[other].parcel = tokenId;
        
        return this.onERC721Received.selector;
    }
    
    modifier onlyParticipants() {
        require (msg.sender == user1 || msg.sender == user2, "Deal: user isn't part of the deal");
        _;
    }
}