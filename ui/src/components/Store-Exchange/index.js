import React, { useState, useEffect } from 'react';
import { Row, message } from 'antd';
import { useSelector, useDispatch } from 'react-redux';
import { PLANT_STATUS } from 'constant';
import Item from 'components/Item';
import { transferERC20To } from 'helpers';
import * as actions from 'store/actions';

import './style.css';

function Store({ onClose }) {
  const dispatch = useDispatch();
  const plants = useSelector((state) => state.plants);

  const [plantsForSale, setPlantsForSale] = useState(
    plants.filter((item) => item.plantStatus === PLANT_STATUS.INSTORE)
  );

  useEffect(() => {
    setPlantsForSale(plants.filter((item) => item.plantStatus === PLANT_STATUS.INSTORE));
  }, [plants]);

  const address = useSelector((state) => state.walletAddress);
  const instanceOxygen = useSelector((state) => state.instanceOxygen);
  const web3 = useSelector((state) => state.web3);

  const handleBuyPlant = async (item) => {
    onClose();
    dispatch(actions.setLoading(true));
    let resultTx = await transferERC20To(web3, instanceOxygen, address, item.price);
    if (resultTx) {
      if (resultTx.status) {
        dispatch(actions.mintBonsai(address, item));
        dispatch(actions.setFirstPlant(item.index));
        message.success({ content: 'Buy Bonsai Successfully !', onClose: 2000 });
      } else {
        message.error({ content: 'Buy Bonsai Has Failed !', onClose: 2000 });
      }
    }
    dispatch(actions.setLoading(false));
  };

  return (
    <div>
      {plantsForSale.length !== 0 ? (
        <Row gutter={[20, 20]} className='overflow bgc-smoke'>
          {plantsForSale.map((item, index) => {
            return (
              <Item
                key={index}
                onBuyPlant={() => handleBuyPlant(item)}
                item={item}
                unit={'Oxygen'}
              />
            );
          })}
        </Row>
      ) : (
        <div>
          <div className='collection align-center'>
            <strong>No plant in the store</strong>
          </div>
        </div>
      )}
    </div>
  );
}

export default Store;
