const FarmConnect = artifacts.require("FarmConnect");

contract("FarmConnect", function (accounts) {
  let farmConnectInstance;

  it("initializes with no users registered", async function () {
    farmConnectInstance = await FarmConnect.deployed();
    const userCount = await farmConnectInstance.usersCount();
    assert.equal(userCount.toNumber(), 0, "initializes with zero users");
  });

  it("allows users to register", async function () {
    farmConnectInstance = await FarmConnect.deployed();
    
    await farmConnectInstance.register("Alice", "farmer", { from: accounts[0] });
    await farmConnectInstance.register("Bob", "manufacturer", { from: accounts[1] });

    const userCount = await farmConnectInstance.usersCount();
    assert.equal(userCount.toNumber(), 2, "increments the users count");

    const user1 = await farmConnectInstance.users(accounts[0]);
    assert.equal(user1.name, "Alice", "registers the first user correctly");
    assert.equal(user1.role, "farmer", "registers the role of the first user correctly");

    const user2 = await farmConnectInstance.users(accounts[1]);
    assert.equal(user2.name, "Bob", "registers the second user correctly");
    assert.equal(user2.role, "manufacturer", "registers the role of the second user correctly");
  });

  it("prevents duplicate registrations", async function () {
    try {
      await farmConnectInstance.register("Alice", "farmer", { from: accounts[0] });
      assert.fail("expected error not received");
    } catch (error) {
      assert(error.message.includes('revert'), "expected revert error message");
    }
  });

  it("allows users to get their role", async function () {
    farmConnectInstance = await FarmConnect.deployed();
    
    const role = await farmConnectInstance.getUserRole({ from: accounts[0] });
    assert.equal(role, "farmer", "returns the correct role for the first user");

    const role2 = await farmConnectInstance.getUserRole({ from: accounts[1] });
    assert.equal(role2, "manufacturer", "returns the correct role for the second user");
  });

  it("emits an event on user registration", async function () {
    farmConnectInstance = await FarmConnect.deployed();

    const receipt = await farmConnectInstance.register("Charlie", "retailer", { from: accounts[2] });
    
    assert.equal(receipt.logs.length, 1, "triggers one event");
    assert.equal(receipt.logs[0].event, "registeredEvent", "should be the registeredEvent event");
    assert.equal(receipt.logs[0].args._userId.toNumber(), 3, "logs the user ID");
    assert.equal(receipt.logs[0].args._role, "retailer", "logs the user role");
  });

  it("emits an event on user login", async function () {
    farmConnectInstance = await FarmConnect.deployed();
    
    const receipt = await farmConnectInstance.emitLoginEvent({ from: accounts[2] });
    
    assert.equal(receipt.logs.length, 1, "triggers one event");
    assert.equal(receipt.logs[0].event, "loginEvent", "should be the loginEvent event");
    assert.equal(receipt.logs[0].args._userAddress, accounts[2], "logs the user address");
    assert.equal(receipt.logs[0].args._role, "retailer", "logs the user role");
  });
});
