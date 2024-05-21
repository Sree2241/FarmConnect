// SPDX-License-Identifier: MIT 
pragma solidity ^0.5.16;

contract EFarming {
    // Model a User
    struct User {
        uint id;
        string name;
        string role; // "farmer", "manufacturer", "retailer", "customer"
    }

    // Store users
    mapping(address => User) public users;
    // Store accounts that have registered
    mapping(address => bool) public registered;
    // Store users count
    uint public usersCount;

    // Registered event
    event registeredEvent (
        uint indexed _userId,
        string _role
    );

    // Login event
    event loginEvent (
        address indexed _userAddress,
        string _role
    );

    // Register a new user
    function register(string memory _name, string memory _role) public {
        // Require that the user has not registered before
        require(!registered[msg.sender], "User already registered");

        // Require a valid role
        require(
            keccak256(abi.encodePacked(_role)) == keccak256(abi.encodePacked("farmer")) ||
            keccak256(abi.encodePacked(_role)) == keccak256(abi.encodePacked("manufacturer")) ||
            keccak256(abi.encodePacked(_role)) == keccak256(abi.encodePacked("retailer")) ||
            keccak256(abi.encodePacked(_role)) == keccak256(abi.encodePacked("customer")),
            "Invalid role"
        );

        // Increment user count
        usersCount++;

        // Create a new user
        users[msg.sender] = User(usersCount, _name, _role);

        // Mark user as registered
        registered[msg.sender] = true;

        // Trigger registered event
        emit registeredEvent(usersCount, _role);
    }

    // Check user role
    function getUserRole() public view returns (string memory) {
        // Require that the user is registered
        require(registered[msg.sender], "User not registered");

        // Return user role
        return users[msg.sender].role;
    }

    // Emit login event
    function emitLoginEvent() public {
        // Require that the user is registered
        require(registered[msg.sender], "User not registered");

        // Emit login event
        emit loginEvent(msg.sender, users[msg.sender].role);
    }
}
