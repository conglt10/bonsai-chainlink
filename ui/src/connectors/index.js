/*****************************************/
/* Detect the MetaMask Ethereum provider */
/*****************************************/

import detectEthereumProvider from '@metamask/detect-provider';
import Web3 from 'web3';
import store from 'store';
import {
  setWeb3,
  setAddress,
  setBonsaiInstance,
  setOxygenInstance,
  setLinkInstance,
  setDaiInstance,
} from 'store/actions';

import Bonsai from 'contracts/Bonsai.json';
import Oxygen from 'contracts/Oxygen.json';
import Erc20 from 'contracts/ERC20.json';

const addressBonsai = Bonsai.networks[process.env.REACT_APP_NETWORK_ID].address;
const addressOxygen = Oxygen.networks[process.env.REACT_APP_NETWORK_ID].address;
const addressLink = process.env.REACT_APP_LINK_CONTRACT_ADDRESS;
const addressDai = process.env.REACT_APP_DAI_CONTRACT_ADDRESS;

// this returns the provider, or null if it wasn't detected
export const connectMetamask = async () => {
  const provider = await detectEthereumProvider();

  const ethereum = window.ethereum;

  if (provider) {
    startApp(provider); // Initialize your app
  } else {
    console.log('Please install MetaMask!');
  }

  function startApp(provider) {
    // If the provider returned by detectEthereumProvider is not the same as
    // window.ethereum, something is overwriting it, perhaps another wallet.
    if (provider !== window.ethereum) {
      console.error('Do you have multiple wallets installed?');
    } else {
      const web3 = new Web3(window.ethereum);
      store.dispatch(setWeb3(web3));
      const instanceBonsai = new web3.eth.Contract(Bonsai.abi, addressBonsai);
      const instanceOxygen = new web3.eth.Contract(Oxygen.abi, addressOxygen);
      const instanceLink = new web3.eth.Contract(Erc20.abi, addressLink);
      const instanceDai = new web3.eth.Contract(Erc20.abi, addressDai);

      store.dispatch(setBonsaiInstance(instanceBonsai));
      store.dispatch(setOxygenInstance(instanceOxygen));
      store.dispatch(setLinkInstance(instanceLink));
      store.dispatch(setDaiInstance(instanceDai));

      connect();
    }
  }

  /**********************************************************/
  /* Handle chain (network) and chainChanged (per EIP-1193) */
  /**********************************************************/

  // Normally, we would recommend the 'eth_chainId' RPC method, but it currently
  // returns incorrectly formatted chain ID values.
  // let currentChainId = ethereum.chainId;

  ethereum.on('chainChanged', handleChainChanged);

  function handleChainChanged(_chainId) {
    // We recommend reloading the page, unless you must do otherwise
    window.location.reload();
  }

  /***********************************************************/
  /* Handle user accounts and accountsChanged (per EIP-1193) */
  /***********************************************************/

  let currentAccount = null;
  ethereum
    .request({ method: 'eth_accounts' })
    .then(handleAccountsChanged)
    .catch((err) => {
      // Some unexpected error.
      // For backwards compatibility reasons, if no accounts are available,
      // eth_accounts will return an empty array.
      console.error(err);
    });

  // Note that this event is emitted on page load.
  // If the array of accounts is non-empty, you're already
  // connected.
  ethereum.on('accountsChanged', handleAccountsChanged);

  // For now, 'eth_accounts' will continue to always return an array
  function handleAccountsChanged(accounts) {
    if (accounts.length === 0) {
      // MetaMask is locked or the user has not connected any accounts
      console.log('Please connect to MetaMask.');
      store.dispatch(setAddress(null));
    } else if (accounts[0] !== currentAccount) {
      currentAccount = accounts[0];
      store.dispatch(setAddress(currentAccount));
    }
  }
  /*********************************************/
  /* Access the user's accounts (per EIP-1102) */
  /*********************************************/

  // You should only attempt to request the user's accounts in response to user
  // interaction, such as a button click.
  // Otherwise, you popup-spam the user like it's 1999.
  // If you fail to retrieve the user's account(s), you should encourage the user
  // to initiate the attempt.

  function connect() {
    ethereum
      .request({ method: 'eth_requestAccounts' })
      .then(handleAccountsChanged)
      .catch((err) => {
        if (err.code === 4001) {
          // EIP-1193 userRejectedRequest error
          // If this happens, the user rejected the connection request.
          console.log('Please connect to MetaMask.');
        } else {
          console.error(err);
        }
      });
  }
};
