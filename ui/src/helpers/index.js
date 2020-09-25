import BigNumber from 'bignumber.js';
import Oxygen from 'contracts/Oxygen.json';

const owner = process.env.REACT_APP_OWNER_ADDRESS;
const privateKeyOwner = process.env.REACT_APP_OWNER_PRIVATE_KEY;

export function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// get balance native token
export const getBalanceNativeToken = async (web3, address) => {
  if (web3) {
    return web3.utils.fromWei(await web3.eth.getBalance(address), 'ether');
  }
};

// get balance erc-20
export const getBalanceERC20 = async (state) => {
  try {
    let result = await state.instanceOxygen.methods.balanceOf(state.walletAddress).call();
    result = state.web3.utils.fromWei(result, 'ether');
    return result;
  } catch (error) {
    console.log(error);
  }
};

// get balance erc-721
export const getBalanceERC721 = async (address, instanceBonsai) => {
  try {
    const result = await instanceBonsai.methods.getPlantsByOwner(address).call();
    return result;
  } catch (error) {
    console.log(error);
  }
};

// airdrop 3000 oxygen for first-time users play
export const airDropERC20 = async (web3, instanceOxygen, address) => {
  return new Promise(async (resolve) => {
    try {
      web3.eth.accounts.wallet.add({
        privateKey: privateKeyOwner,
        address: owner,
      });
      instanceOxygen.methods
        .airDrop(address)
        .send({ from: owner, gas: 300000 })
        .then(function (receipt) {
          web3.eth.accounts.wallet.remove(owner);
          resolve(true);
          return receipt;
        });
    } catch (err) {
      console.log({ err });
      resolve(false);
    }
  });
};

// transfer oxy to buy bonsai
export const transferERC20To = async (web3, instanceOxygen, address, amount) => {
  amount = web3.utils.toWei(amount.toString(), 'ether');
  try {
    return await instanceOxygen.methods
      .transfer(process.env.REACT_APP_OWNER_ADDRESS, amount)
      .send({ from: address });
  } catch (err) {
    return err;
  }
};

export const refundERC20To = async (web3, instanceOxygen, address, amount) => {
  return new Promise(async (resolve) => {
    try {
      amount = web3.utils.toWei(amount.toString(), 'ether');

      web3.eth.accounts.wallet.add({
        privateKey: privateKeyOwner,
        address: owner,
      });

      instanceOxygen.methods
        .transfer(address, amount)
        .send({ from: owner, gas: 300000 })
        .then(function (receipt) {
          web3.eth.accounts.wallet.remove(owner);
          resolve(true);
          return receipt;
        });
    } catch (err) {
      console.log({ err });
      resolve(false);
    }
  });
};

// mint bonsai after transfer oxy successfully
export const mintERC721To = async (web3, instanceBonsai, address, item) => {
  return new Promise(async (resolve) => {
    try {
      web3.eth.accounts.wallet.add({
        privateKey: privateKeyOwner,
        address: owner,
      });

      instanceBonsai.methods
        .mint(address, item.name, item.price)
        .send({ from: owner, gas: 300000 })
        .then(function (receipt) {
          web3.eth.accounts.wallet.remove(owner);
          resolve(true);
          return receipt;
        });
    } catch (err) {
      console.log({ err });
      resolve(false);
    }
  });
};

// is newbie
export const airDropped = async (address, instanceOxygen) => {
  try {
    const result = await instanceOxygen.methods.airDropped(address).call();
    return result;
  } catch (err) {
    console.log({ err });
  }
};

export const receiveOxygen = async (web3, instanceOxygen, address, numBonsais) => {
  return new Promise(async (resolve) => {
    try {
      web3.eth.accounts.wallet.add({
        privateKey: privateKeyOwner,
        address: owner,
      });
      instanceOxygen.methods
        .receiveOxygen(address, numBonsais)
        .send({ from: owner, gas: 600000 })
        .then(function (receipt) {
          web3.eth.accounts.wallet.remove(owner);
          resolve(true);
          return receipt;
        });
    } catch (err) {
      console.log({ err });
      resolve(false);
    }
  });
};

export const getTokenPrice = async (instanceOxygen, tokenType) => {
  try {
    let price = await instanceOxygen.methods.getLatestPrice(tokenType).call();
    price = price / 100000000;
    return price;
  } catch (err) {
    return err;
  }
};

export const approveContract = async (state, tokenType, amount) => {
  const addressOxygen = Oxygen.networks[process.env.REACT_APP_NETWORK_ID].address;
  amount = state.web3.utils.toWei(amount.toString(), 'ether');
  try {
    if (tokenType === 1) {
      // Link
      let isSuccess = await state.instanceLink.methods
        .approve(addressOxygen, amount)
        .send({ from: state.walletAddress });
      if (!!isSuccess) return true;
      else return false;
    } else {
      // tokenType === 2 => DAI
      let isSuccess = await state.instanceDai.methods
        .approve(addressOxygen, amount)
        .send({ from: state.walletAddress });
      if (!!isSuccess) return true;
      else return false;
    }
  } catch (error) {
    console.log({ error });
    return false;
  }
};

export const buyOxygenWithERC20 = async (state, tokenType, amount, price) => {
  // price is convert to $ live 1$ ,5$ ,10$
  // amount is number of token
  amount = state.web3.utils.toWei(amount.toString(), 'ether');

  try {
    await state.instanceOxygen.methods
      .buyOxygenWithERC20(tokenType, amount, price)
      .send({ from: state.walletAddress });
  } catch (error) {
    console.log({ error });
  }
};

export const buyOxygen = async (instanceOxygen, address, amount) => {
  try {
    let price = (await instanceOxygen.methods.getLatestPrice(0).call()) + '00000';

    price = new BigNumber(price);
    amount = price.multipliedBy(amount);
    const result = await instanceOxygen.methods.buyOxygen().send({ from: address, value: amount });
    return result;
  } catch (err) {
    return err;
  }
};

export const transferBonsai = async (instanceBonsai, from, to, bonsaiId) => {
  try {
    const result = await instanceBonsai.methods.safeTransferFrom(from, to, bonsaiId).send({ from });
    return result;
  } catch (err) {
    console.log({ err });
  }
};

// get Plant Dict from contract
export const getPlantDict = async (instanceBonsai, address) => {
  try {
    const result = await instanceBonsai.methods.plantDict(address).call();
    return result;
  } catch (err) {}
};

// set Plant Dict
export const setPlantDict = async (web3, instanceBonsai, plantsDict, address) => {
  try {
    web3.eth.accounts.wallet.add({
      privateKey: privateKeyOwner,
      address: owner,
    });
    instanceBonsai.methods
      .setPlantDict(JSON.stringify(plantsDict), address)
      .send({ from: owner, gas: 1465000 })
      .then(function (receipt) {
        web3.eth.accounts.wallet.remove(owner);
        return receipt;
      });
  } catch (err) {
    console.log({ err });
  }
};
