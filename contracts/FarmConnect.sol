// SPDX-License-Identifier: MIT
pragma solidity ^0.5.16;

contract FarmConnect {
    struct User {
        uint id;
        string username;
        bytes32 passwordHash;
        string role; // "farmer", "manufacturer", "retailer", "customer"
    }

    mapping(address => User) public users;
    mapping(address => bool) public registered;
    uint public usersCount;

    event RegisteredEvent(uint indexed _userId, string _role);

    function register(string memory _username, string memory _password, string memory _role) public {
        require(!registered[msg.sender], "User already registered");

        bytes32 passwordHash = keccak256(abi.encodePacked(_password));

        usersCount++;
        users[msg.sender] = User(usersCount, _username, passwordHash, _role);
        registered[msg.sender] = true;

        emit RegisteredEvent(usersCount, _role);
    }

    function verifyCredentials(string memory _username, string memory _password) public view returns (bool) {
        bytes32 passwordHash = keccak256(abi.encodePacked(_password));
        User memory user = users[msg.sender];

        return (keccak256(abi.encodePacked(user.username)) == keccak256(abi.encodePacked(_username)) &&
            user.passwordHash == passwordHash);
    }
}
