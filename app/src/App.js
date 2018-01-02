import React, { Component } from 'react';
import dekzImage from './dekz-image.png';
import Particles from 'react-particles-js';
import moment from 'moment';
import CountdownTimer from 'react-awesome-countdowntimer';
import {CopyToClipboard} from 'react-copy-to-clipboard';
import * as Scroll from 'react-scroll';
import { Link, DirectLink, Element , Events, animateScroll as scroll, scrollSpy, scroller } from 'react-scroll';

import DekzCoinCrowdsale from './contracts/DekzCoinCrowdsale.json'

import getWeb3 from './utils/getWeb3'
import './App.css';

class App extends Component {

  state = {
    value: '0x69eD072262C41b72b335df4B1A80d31513E0f00F',
    copied: false,
    web3: null,
    crowdsaleAddress: '0x69ed072262c41b72b335df4b1a80d31513e0f00f',
    crowdsaleInstance: null,
    latestMessage: "",
    messageText: ""
  };

  componentWillMount() {
    // Get network provider and web3 instance.
    // See utils/getWeb3 for more info.

    this.updateMessageText= this.updateMessageText.bind(this);
    this.leaveAMessage = this.leaveAMessage.bind(this);

    getWeb3
    .then(results => {
      this.setState({
        web3: results.web3
      })

      // Instantiate contract once web3 provided.
      this.instantiateContract()
    })
    .catch((error) => {
      console.log('Error finding web3.')
      console.log(error)
    })
  }


  instantiateContract() {
    const contract = require('truffle-contract')
    const crowdSale = contract(DekzCoinCrowdsale)
    crowdSale.setProvider(this.state.web3.currentProvider)

    // Declaring this for later so we can chain functions on SimpleStorage.

    crowdSale.at(this.state.crowdsaleAddress).then(instance => {
      this.setState({crowdsaleInstance: instance})
      console.log(this.state.crowdsaleInstance)
      return this.getRandomMessage()
    }).catch(err => {
      console.log(err.message)
    })
  }

  getMessageCount() {
    return this.state.crowdsaleInstance.getMessageCount.call().then(result => {
      console.log("getMessageCount Result: " + result);
      return result;
    }).catch(err => {
      console.log(err.message)
    })
  }

  getRandomMessage() {
    return this.getMessageCount().then(count => {
      console.log("count: " + count)
      const messageIndex = Math.floor((Math.random() * count));
      return this.getMessage(messageIndex)
    }).then(latestMessage => {
      this.setState({latestMessage: latestMessage})
    })
  }

  getMessage(index) {
    console.log(index)
    return this.state.crowdsaleInstance.getMessage.call(index).then(result => {
      console.log("getMessage Result: " + result);
      return result;
    }).catch(err => {
      console.log(err.message)
    })

  }

  updateMessageText(event) {
    this.setState({messageText: event.target.value})
  }

  leaveAMessage(event) {
    event.preventDefault();
    const messageText = this.state.messageText

    this.state.web3.eth.getAccounts((error, accounts) => {
      if (error) {
        console.log(error);
      }
      const account = accounts[0]
      console.log("Message to leave: " + messageText)

      this.state.crowdsaleInstance.leaveMessage(messageText, {from: account}).then(function (result) {
        console.log(result);
      }).catch(function(err) {
        console.log(err.message);
      })
    })
  }

  render() {
    return (
      <div className="App">

        <Particles
        params={{
         "particles": {
           "number": {
             "value": 20,
             "density": {
               "enable": true,
               "value_area": 800
             }
           },
           "color": {
             "value": "#ffffff"
           },
           "shape": {
             "type": "circle",
             "stroke": {
               "width": 0,
               "color": "#000000"
             },
             "polygon": {
               "nb_sides": 5
             },
             "image": {
               "src": "img/github.svg",
               "width": 1000,
               "height": 1000
             }
           },
           "opacity": {
             "value": 0.1,
             "random": false,
             "anim": {
               "enable": false,
               "speed": 1,
               "opacity_min": 0.1,
               "sync": false
             }
           },
           "size": {
             "value": 10,
             "random": true,
             "anim": {
               "enable": false,
               "speed": 4,
               "size_min": 1,
               "sync": false
             }
           },
           "line_linked": {
             "enable": true,
             "distance": 220,
             "color": "#ffffff",
             "opacity": 0.2,
             "width": 1
           },
           "move": {
             "enable": true,
             "speed": .6,
             "direction": "none",
             "random": false,
             "straight": false,
             "out_mode": "out",
             "bounce": false,
             "attract": {
               "enable": false,
               "rotateX": 600,
               "rotateY": 1200
             }
           }
         },
         "interactivity": {
           "detect_on": "canvas",
           "events": {
             "onhover": {
               "enable": false,
               "mode": "repulse"
             },
             "onclick": {
               "enable": false,
               "mode": "push"
             },
             "resize": true
           },
           "modes": {
             "grab": {
               "distance": 400,
               "line_linked": {
                 "opacity": 1
               }
             },
             "bubble": {
               "distance": 4,
               "size": 4,
               "duration": 2,
               "opacity": 8,
               "speed": 3
             },
             "repulse": {
               "distance": 200,
               "duration": 0.4
             },
             "push": {
               "particles_nb": 4
             },
             "remove": {
               "particles_nb": 2
             }
           }
         },
         "retina_detect": true
        }}
        height='1200px'/>

        <header className="App-header">
          <img src={dekzImage} className="App-logo" alt="logo" />
        </header>
        <div className="App-intro">
          <h1 className="App-title">DEKZ COIN</h1>

          <div className='CountdownTimer'>
            Ends Friday, January 5, 2018 4:00:00 AM GMT+11:00
            <CountdownTimer endDate={moment('05/01/2018 04:00:00', 'DD/MM/YYYY hh:mm:ss')}/>
          </div>
          <h2>DEKZCOIN is an ETH based token heralding <br/> Insignificance for the Blockchain Era.</h2>
          <div className="Intro-para">
            <p>Unlike other Tokens, dekz coin has absolutely no intrinsic value or purpose.<br/>
            By removing all concept of value, we believe we are truly unlocking the power of the Blockchain.</p>
          </div>

          <div className="Get-dekz">
            <p><strong>Get DKZ tokens by sending Ethereum to the following contract address *</strong></p>

            <div className="Get-dekz-input">
              <input
                value={this.state.value}
                onChange={({target: {value}}) => this.setState({value, copied: false})}
                className='dekzInput'
                readOnly="true"
              />
               <CopyToClipboard text={this.state.value}
                 onCopy={() => this.setState({copied: true})}>
                 <button className='Copy'>Copy</button>
               </CopyToClipboard>
            </div>

            {this.state.copied ? <div className='Copied'>Ethereum Address Copied.</div> : null}

            <small className='smallText'>*You will need to send ETH from a wallet that accepts ERC20 token. We recommend: MetaMask, MyEtherWallet, or Mist.</small>

            <br />
            <Link className='link' activeClass="active" to="tokens" spy={true} smooth={true} offset={50} duration={500} onSetActive={this.handleSetActive}>
              How do i see my DKZ tokens?
            </Link>
            &nbsp;&nbsp; | &nbsp;&nbsp;
            <Link className='link' activeClass="active" to="messages" spy={true} smooth={true} offset={50} duration={500} onSetActive={this.handleSetActive}>
              Leave Jacob a message.
            </Link>

          </div>
        </div>

        <div className='Footer'>
          <Element name="tokens" className="element">
            <div className='tokens'>
              <h2>Gettin' my DKZ</h2>

              <p><strong>Via Metamask</strong></p>

              <ol className='OrderedList'>
              <li>In Metamask, click on the "Tokens" tab, and then on "Add Token".</li>
              <li>Enter the Dekz Coin smart contract details<br />
                Token Contract Address: <strong>0x252e3fafe89fdf030bd188c0db8fe74927b973f3</strong><br />
                Token Symbol: <strong>DKZ</strong><br />
                Decimals of Precision: <strong>18</strong>
              </li>
              <li>Click *Add*!</li>
              </ol>
            </div>
          </Element>
          <Element name="messages" className="element messages">
              <h2>Leave a message for Jacob</h2>
              <form onSubmit={this.leaveAMessage}>
                <label>
                  <input type="text" placeholder="🏩 Noooo. Please don't go" value={this.state.messageText} onChange={this.updateMessageText} className='dekzInput' />
                </label>
                <button type="submit" value="Submit" className='Button'>Send Message</button>
              </form>
          </Element>
          <p className="footer-tagline">Designed and developed with ♥ in Melbourne by the Hooroo crew.</p>
        </div>
      </div>
    );
  }
}

export default App;
