pragma solidity ^0.5.7;

import "browser/Location.sol";
// ["hello", "world"], 45

contract Information {
    
    uint private ingredientId;
    uint private unhashedId;
    uint private idHash;
    Location private sender;
    Location private recipient;
    uint[] private finalAllergies;
    
    constructor(uint id, uint rollingId, Location _sender, Location _recipient, uint[] memory allAllergies) public {
        ingredientId = id;
        unhashedId = rollingId;
        idHash = hashID(unhashedId);
        sender = _sender;
        recipient = _recipient;
        finalAllergies = allAllergies;
    }
    
    function getIngredientId() public view returns (uint) {
        return ingredientId;
    }
    
    function getUnhashedId() public view returns (uint) {
        return unhashedId;
    }
    
    function getSenderId() public view returns (uint) {
        return sender.getName();
    }
    
    function getRecipientId() public view returns (uint) {
        return recipient.getName();
    }
    
    function getIngredientAllergens() public view returns (uint[] memory) {
        return finalAllergies;
    }
    
    function hashID(uint idNumber) pure public returns (uint){
       uint hashedIdNumber = (idNumber+19)*6704 %1970026;
       return hashedIdNumber;
    }
    
    
}
