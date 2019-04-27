pragma solidity ^0.5.7;

contract Location{
    uint public locationID;
    uint[] allergies;
    
    constructor(uint name, uint[] memory Allergies) public {
        locationID = name;
        allergies = Allergies;
        
    }
    function getAllergies() public returns (uint[] memory) {
        return allergies;
        
    }
    function getName() public returns (uint) {
        return locationID;
    }
    
}
