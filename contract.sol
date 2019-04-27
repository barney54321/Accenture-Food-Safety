pragma solidity ^0.5.7;

import "browser/Location.sol";
// ["hello", "world"], 45

contract Information {
    
    uint ingredientId;
    uint unhashedId;
    uint idHash;
    Location sender;
    Location recipient;
    uint[] finalAllergies;
    
    constructor(uint id, uint rollingId, Location _sender, Location _recipient, uint[] memory allAllergies) public {
        ingredientId = id;
        unhashedId = rollingId;
        idHash = hashID(unhashedId);
        sender = _sender;
        recipient = _recipient;
        finalAllergies = allAllergies;
    }
    
    function hashID(uint idNumber) pure public returns (uint){
       uint hashedIdNumber = (idNumber+19)*69 % 420;
       return hashedIdNumber;
    }
    
    
}
