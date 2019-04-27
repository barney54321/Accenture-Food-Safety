pragma solidity ^0.5.7;

contract IngredientBlock {

    struct Certification {
        string type_of_cert;
        string cert_comp;
    }

    Certification[] public certs;
    string[] public owners;

    function remove_dup_cert(string memory _cert_list) public {

    }

}
