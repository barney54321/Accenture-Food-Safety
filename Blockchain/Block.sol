pragma solidity ^0.5.7;

contract IngredientBlock {

    struct Certification {
        string type_of_cert;
        string cert_comp;
    }

    Certification[] public certs;
    uint public certs_len;
    string public origin;
    string public current_owner;
    uint public current_owner_add;
    string[] public past_owners;
    uint public past_owners_len = 0;
    uint[] public past_owners_add;

    function transfer_ownership(uint _new_owner_add, string memory _new_owner) public {
        past_owners.push(current_owner);
        past_owners_add.push(current_owner_add);
        current_owner = _new_owner;
        current_owner_add = _new_owner_add;
    }

}
