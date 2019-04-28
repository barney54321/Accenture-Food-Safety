pragma solidity ^0.5.7;

contract Location{
    uint private locationID;
    uint[] private allergies;
    
    constructor(uint name, uint[] memory Allergies) public {
        locationID = name;
        allergies = Allergies;
        
    }
    function getAllergies() view public returns (uint[] memory) {
        return allergies;
        
    }
    function getName() view public returns (uint) {
        return locationID;
    }
    
}
