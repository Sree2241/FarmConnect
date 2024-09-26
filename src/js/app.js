App = {
  web3Provider: null,
  contracts: {},
  account: '0x0',

  init: function() {
    return App.initWeb3();
  },

  initWeb3: function() {
    if (typeof web3 !== 'undefined') {
      App.web3Provider = web3.currentProvider;
      web3 = new Web3(web3.currentProvider);
    } else {
      App.web3Provider = new Web3.providers.HttpProvider('http://localhost:7545');
      web3 = new Web3(App.web3Provider);
    }
    return App.initContract();
  },

  initContract: function() {
    $.getJSON("FarmConnect.json", function(farmConnectArtifact) {
      App.contracts.FarmConnect = TruffleContract(farmConnectArtifact);
      App.contracts.FarmConnect.setProvider(App.web3Provider);

      return App.render();
    });
  },

  render: function() {
    web3.eth.getCoinbase(function(err, account) {
      if (err === null) {
        App.account = account;
        $("#accountAddress").html("Your Account: " + account);
      }
    });
  },

  registerUser: function() {
    var name = document.getElementById("name").value;
    var username = document.getElementById("username").value;
    var password = document.getElementById("password").value;
    var confirmPassword = document.getElementById("confirmPassword").value;
    var phone = document.getElementById("phone").value;
    var role = document.getElementById("role").value;

    // Validate inputs
    if (name.trim() === '' || username.trim() === '' || password === '' || confirmPassword === '' || phone.trim() === '') {
      document.getElementById("status").innerText = "Please fill in all fields.";
      return;
    }

    if (password !== confirmPassword) {
      document.getElementById("status").innerText = "Passwords do not match.";
      return;
    }

    // Call the smart contract method to check if the username is available
    App.contracts.FarmConnect.deployed().then(function(instance) {
      return instance.isUsernameAvailable(username);
    }).then(function(isAvailable) {
      if (!isAvailable) {
        document.getElementById("status").innerText = "Username already exists. Please choose another one.";
      } else {
        // Username is available, proceed with registration
        App.registerWithEthereum(name, username, password, phone, role);
      }
    }).catch(function(error) {
      console.error("Error occurred during username check:", error);
      alert("Error occurred during username check. See console for details.");
    });
  },

  registerWithEthereum: function(name, username, password, phone, role) {
    web3.eth.getAccounts().then(function(accounts) {
      var account = accounts[0];
      App.contracts.FarmConnect.deployed().then(function(instance) {
        return instance.register(name, username, password, phone, role, {from: account});
      }).then(function(result) {
        document.getElementById("status").innerText = "Registration successful!";
        // Redirect to login page or perform other actions
      }).catch(function(error) {
        console.error("Error occurred during registration:", error);
        alert("Error occurred during registration. See console for details.");
      });
    });
  }
};

$(function() {
  $(window).load(function() {
    App.init();
  });

  // Event listener for the registration form submission
  document.getElementById("registerForm").addEventListener("submit", function(event) {
    event.preventDefault();
    App.registerUser();
  });
});
