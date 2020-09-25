import React from 'react';
import { Row, message } from 'antd';
import { packageOxyForSale } from 'constant';
import { useSelector, useDispatch } from 'react-redux';
import OxyPackage from 'components/OxyPackage';
import { buyOxygen } from 'helpers';
import * as actions from 'store/actions';

export const BuyOxy = ({ onClose }) => {
  const dispatch = useDispatch();
  const address = useSelector((state) => state.walletAddress);
  const instance = useSelector((state) => state.instanceOxygen);
  const handleBuyOxy = async (item) => {
    onClose();
    dispatch(actions.setLoading(true));
    const resultTx = await buyOxygen(instance, address, item.price);
    dispatch(actions.setLoading(false));
    if (resultTx) {
      if (resultTx.status) {
        message.success({ content: 'Buy Oxygen Successfully !', onClose: 1000 });
        dispatch(actions.getBalanceOxy());
      } else {
        message.error({ content: 'Buy Oxygen Has Failed !', onClose: 1000 });
      }
    } else {
      message.error({ content: 'Buy Oxygen Has Failed !', onClose: 1000 });
    }
  };

  return (
    <div>
      {packageOxyForSale.length !== 0 ? (
        <Row gutter={[20, 20]} className='overflow bgc-smoke'>
          {packageOxyForSale.map((item, index) => {
            return (
              <OxyPackage
                key={index}
                onBuyPlant={() => handleBuyOxy(item)}
                item={item}
                unit='USD'
              />
            );
          })}
        </Row>
      ) : (
        <div>
          <div className='collection align-center'>
            <strong>No package in the store</strong>
          </div>
        </div>
      )}
    </div>
  );
};
