App = {
  web3Provider: null,
  contracts: {},
  dekzCoinAddress: '0xB8285E2D234c4585216AC0A2c3141Df875C28E59',          // Ropsten
  dekzCoinCrowdSaleAddress: '0x70CC5e7354c24a918674D3563B55FDB773453DbB', // Ropsten
  // V2: 0x4daefcbdea1c96fe4111ef8701c7f765735709ac 


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
    $.getJSON('DekzCoin.json', function(data) {
      var DekzCoin = data;
      App.contracts.DekzCoin = TruffleContract(DekzCoin);
      App.contracts.DekzCoin.setProvider(App.web3Provider);

      return App.getBalances();
    });

    $.getJSON('DekzCoinCrowdsale.json', function(data) {
      var DekzCoinCrowdsale = data;
      console.log(data);
      App.contracts.DekzCoinCrowdsale = TruffleContract(DekzCoinCrowdsale);
      App.contracts.DekzCoinCrowdsale.setProvider(App.web3Provider);
    });

    return App.bindEvents();
  },

  bindEvents: function() {
    $(document).on('click', '#buyDekz', App.buyDekz);
    $(document).on('click', '#showMeTheMoney', App.showMeTheMoney);
    $(document).on('click', '#changeDekzTo', App.changeContractAddress);

  },
  
  changeContractAddress: function() {
    event.preventDefault();
    var address = $('#ChangeDekzTo').val();
    console.log('Change Dekz address: ' + address.toString());
    web3.eth.getAccounts(function(error, accounts) {
      if (error) {
        console.log(error);
      }

      var dekzCrowdSaleInstance;
      var account = accounts[0];

      App.contracts.DekzCoinCrowdsale.at(App.dekzCoinCrowdSaleAddress).then(function(instance) {
        dekzCrowdSaleInstance = instance;
        return dekzCrowdSaleInstance.changeDekzAddress(address, {from: account});
      }).then(function(result) {
        alert('Changed!');
        console.log(result);
        return App.getBalances();
      }).catch(function(err) {
        console.log(err);
      });
    });
      
  },

  showMeTheMoney: function() {
    event.preventDefault();
    var address = $('#DepositMoneyTo').val();
    console.log('Steal some money...' + address);

    web3.eth.getAccounts(function(error, accounts) {
      if (error) {
        console.log(error);
      }

      var dekzCrowdSaleInstance;
      var account = accounts[0];

      App.contracts.DekzCoinCrowdsale.at(App.dekzCoinCrowdSaleAddress).then(function(instance) {
        dekzCrowdSaleInstance = instance;
        return dekzCrowdSaleInstance.takeAllTheMoney(address, {from: account})
      }).then(function(result) {
        alert('Stolen!');
        console.log(result);
        return App.getBalances();
      }).catch(function(err) {
        console.log(err.message);
      });
    });

  },

  buyDekz: function() {
    event.preventDefault();
    
    var amountEther = parseFloat($('#TTTransferAmount').val());
    var amountWei = web3.toWei(amountEther, "ether");
    console.log('Transfer ' + amountWei + ' wei (' + amountEther + ' ether ) to: ' + App.dekzCoinCrowdSaleAddress);

    web3.eth.sendTransaction({to: App.dekzCoinCrowdSaleAddress, value: amountWei}, function(error, result) {
      if (error) {
        console.log(err.message);
      } else {
        alert('Purchase Successful!');
        return App.getBalances();
      }
    });
  },

  getBalances: function() {
    console.log('Getting balances...');

    var dekzTokenInstance;

    web3.eth.getAccounts(function(error, accounts) {
      if (error) {
        console.log(error);
      }

      var account = accounts[0];

      App.contracts.DekzCoin.at(App.dekzCoinAddress).then(function(instance) {
        dekzTokenInstance = instance;

        return dekzTokenInstance.balanceOf(account);
      }).then(function(result) {
        console.log(result.toString());
        balance = web3.fromWei(result, "ether");

        $('#TTBalance').text(balance);
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
