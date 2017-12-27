App = {
  web3Provider: null,
  contractInstances: {},
  contracts: {},
  config: {
    ropstenV1: {
      dekzCoinAddress: '0xB8285E2D234c4585216AC0A2c3141Df875C28E59',          // Ropsten
      dekzCoinCrowdSaleAddress: '0x70CC5e7354c24a918674D3563B55FDB773453DbB', // Ropsten
      owner: '',
      dekzAddresss: ''
    },
    ropstenV2: {
      dekzCoinAddress: '0x4f38bf67e38e753ac0d12c0a1e8c2e0875dd7a04',          // Ropsten
      dekzCoinCrowdSaleAddress: '0x1A74Be69C028e99f9d22b7A83be738549ce71ae4', // Ropsten
      owner: '',
      dekzAddresss: ''
    },
    ropsten: {
      dekzCoinAddress: '0x43325300d8deaca38023f582500cabc7ab797e62',          // Ropsten
      dekzCoinCrowdSaleAddress: '0x81f4f71bfb064a93e8ad727aae54ce987d02b59e', // Ropsten
      owner: '',
      dekzAddresss: ''
    },
    mainnet: {
      dekzCoinAddress: "0x252e3fafe89fdf030bd188c0db8fe74927b973f3",
      dekzCoinCrowdSaleAddress: "0x69ed072262c41b72b335df4b1a80d31513e0f00f",
      owner: "0x77732DAEfE999d8FA1a4a4CF52139173f3b98439",
      dekzAddresss: "0x9f988CD74c5E5A7C4D929bbe3a7E364D3454EE50"
    }
  },

  messageCount: 0,

  currentConfig: function() {
    return App.config.ropsten;
  },

  init: function() {
    return App.initWeb3();
  },

  initWeb3: function() {
    if (typeof web3 !== 'undefined') {
      App.web3Provider = web3.currentProvider;
      web3 = new Web3(web3.currentProvider);
    } else {
      // set the provider you want from Web3.providers
      App.web3Provider = new Web3.providers.HttpProvider('http://127.0.0.1:9545');
      web3 = new Web3(App.web3Provider);
    }

    return App.initContract();
  },

  initContract: function() {
    var config = App.currentConfig();
    console.log(config);
    $.getJSON('DekzCoin.json', function(data) {
      var DekzCoin = data;
      App.contracts.DekzCoin = TruffleContract(DekzCoin);
      App.contracts.DekzCoin.setProvider(App.web3Provider);
      App.contracts.DekzCoin.at(config.dekzCoinAddress).then(function(instance) {
        App.contractInstances.DekzCoin = instance;
      }).then(function(instance) {
        return App.getBalances();
      });
    });

    $.getJSON('DekzCoinCrowdsale.json', function(data) {
      var DekzCoinCrowdsale = data;
      console.log(data);
      App.contracts.DekzCoinCrowdsale = TruffleContract(DekzCoinCrowdsale);
      App.contracts.DekzCoinCrowdsale.setProvider(App.web3Provider);
      App.contracts.DekzCoinCrowdsale.at(config.dekzCoinCrowdSaleAddress).then(function(instance) {
        App.contractInstances.DekzCoinCrowdsale = instance;
      }).then(function(instance) {
        return App.getMessage();
      });
    });

    return App.bindEvents();
  },

  bindEvents: function() {
    $(document).on('click', '#checkDekz', App.getBalances);
    $(document).on('click', '#buyDekz', App.buyDekz);
    $(document).on('click', '#showMeTheMoney', App.showMeTheMoney);
    $(document).on('click', '#changeDekzTo', App.changeContractAddress);
    $(document).on('click', '#leaveMessage', App.leaveMessage);
    $(document).on('click', '#getNewMessage', App.getMessage);
  },
  
  changeContractAddress: function() {
    event.preventDefault();
    var config = App.currentConfig();
    var address = $('#ChangeDekzTo').val();
    console.log('Change Dekz address: ' + address.toString());
    web3.eth.getAccounts(function(error, accounts) {
      if (error) {
        console.log(error);
      }

      var account = accounts[0];

      App.contractInstances.DekzCoinCrowdsale.changeDekzAddress(address, {from: account}).then(function(result) {
        console.log(result);
      }).catch(function(err) {
        console.log(err);
      });
    });
      
  },

  showMeTheMoney: function() {
    event.preventDefault();
    var config = App.currentConfig();
    var address = $('#DepositMoneyTo').val();
    console.log('Steal some money...' + address);

    web3.eth.getAccounts(function(error, accounts) {
      if (error) {
        console.log(error);
      }

      var account = accounts[0];
      App.contractInstances.DekzCoinCrowdsale.takeAllTheMoney(address, {from: account}).then(function(result) {
        alert('Stolen!');
        console.log(result);
        return App.getBalances();
      }).catch(function(err) {
        console.log(err.message);
      });
    });

  },

  getMessage: function() {
    var config = App.currentConfig();
    App.getMessageCount().then(function(messageCount) {
      var messageIndex = Math.floor((Math.random() * App.messageCount));
      console.log("Max Message: " + messageCount + " Index: " + messageIndex);
      return messageIndex;
    }).then(function(messageIndex) {
      return App.contractInstances.DekzCoinCrowdsale.getMessage.call(messageIndex);
    }).then(function(result) {
      $('#LatestMessage').text(result);
      console.log("getMessage: " + result);
      return result;
    }).catch(function(err) {
      console.log(err.message);
    });
  },

  getMessageCount: function() {
    var config = App.currentConfig();

    return App.contractInstances.DekzCoinCrowdsale.getMessageCount.call().then(function(result) {
      App.messageCount = result;
      console.log("getMessageCount Result: " + result);
      return result;
    }).catch(function(err) {
      console.log(err.message);
    });
  },

  leaveMessage: function() {
    event.preventDefault();
    var config = App.currentConfig();
    var message = $('#LeaveMessage').val();
    
    web3.eth.getAccounts(function(error, accounts) {
      if (error) {
        console.log(error);
      }
      var account = accounts[0];

      App.contractInstances.DekzCoinCrowdsale.leaveMessage(message, {from: account}).then(function (result) {
        console.log(result);
      }).catch(function(err) {
        console.log(err.message);
      });
    });

  },

  buyDekz: function() {
    event.preventDefault();

    var config = App.currentConfig();
    var amountEther = parseFloat($('#TTTransferAmount').val());
    var amountWei = web3.toWei(amountEther, "ether");
    console.log('Transfer ' + amountWei + ' wei (' + amountEther + ' ether ) to: ' + config.dekzCoinCrowdSaleAddress);

    web3.eth.sendTransaction({to: config.dekzCoinCrowdSaleAddress, value: amountWei}, function(error, result) {
      if (error) {
        console.log(err.message);
      } else {
        console.log(result)
        $('#txReceipt').text(result.tx);
        return App.getBalances();
      }
    });
  },

  getBalances: function() {
    var config = App.currentConfig();
    console.log('Getting balances...');

    web3.eth.getAccounts(function(error, accounts) {
      if (error) {
        console.log(error);
      }
      var account = accounts[0];
      App.contractInstances.DekzCoin.balanceOf(account).then(function(result) {
        console.log("getBalances: " + result.toString());
        balance = web3.fromWei(result, "ether");
        $('#TTBalance').text(balance);
        return balance;
      }).catch(function(err) {
        console.log(err.message);
      });
    });
  }
};

$(function() {
  $(window).load(function() {
    App.init();
  });
});
