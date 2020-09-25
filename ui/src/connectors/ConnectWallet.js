import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import * as actions from 'store/actions';
import { receiveOxygen } from 'helpers';
import { connectMetamask } from 'connectors';

export const ConnectWallet = () => {
  const address = useSelector((state) => state.walletAddress);
  const numBonsai = useSelector((state) => state.balanceBonsai.length);
  const web3 = useSelector((state) => state.web3);
  const instanceOxygen = useSelector((state) => state.instanceOxygen);

  const dispatch = useDispatch();

  useEffect(() => {
    const main = async () => {
      if (address) {
        dispatch(actions.getBalanceOxy());
        dispatch(actions.getBalanceBonsai());
      }
    };

    main();
  }, [address, dispatch]);

  useEffect(() => {
    if (window.ethereum._metamask.isEnabled()) {
      connectMetamask();
    }
  }, []);

  useEffect(() => {
    const receive = async () => {
      if (address && numBonsai > 0) {
        await receiveOxygen(web3, instanceOxygen, address, numBonsai);
        dispatch(actions.getBalanceOxy());
      }
    };

    receive(); //receive Oxygen at first time
    let interval = setInterval(() => {
      receive(); // receive Oxygen every interval 60s
    }, 60000);
    return () => clearInterval(interval);
  }, [address, dispatch, numBonsai, instanceOxygen, web3]);

  return <></>;
};
