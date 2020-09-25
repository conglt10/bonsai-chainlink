import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getTokenPrice, approveContract } from 'helpers';
import { buyOxygenERC } from 'store/actions';

import { Button, Modal, Steps } from 'antd';
import { ArrowDownOutlined } from '@ant-design/icons';

import oxyImg from 'images/oxygen_bubble_big.png';
import linkImg from 'images/chainlink.png';
import daiImg from 'images/dai.png';

import './index.css';

const { Step } = Steps;

export default function Swap({ visible, setVisible, item, tokenType, numberOfOxy, unit }) {
  const state = useSelector((state) => state);
  const dispatch = useDispatch();

  const [linkPrice, setLinkPrice] = useState(0);
  const [daiPrice, setDaiPrice] = useState(0);
  const [stepper, setStepper] = useState(0);

  useEffect(() => {
    const getPrice = async () => {
      let linkPrice = await getTokenPrice(state.instanceOxygen, 1);
      let daiPrice = await getTokenPrice(state.instanceOxygen, 2);

      setLinkPrice(Number((item.price / linkPrice).toFixed(5)));
      setDaiPrice(Number((item.price / daiPrice).toFixed(5)));
    };
    getPrice();
  }, [state.instanceOxygen, item.price]);

  const approve = async (state, tokenType, amount) => {
    let isSuccess = await approveContract(state, tokenType, amount);
    if (isSuccess) {
      setStepper(1);
    }
  };

  return (
    <div>
      <Modal title='Buy with ERC' visible={visible} footer={[]} onCancel={() => setVisible(false)}>
        <div className='transfer-border'>
          <strong>
            From ( estimated ~ {item.price} {unit} )
          </strong>
          {tokenType === 1 ? (
            <div className='pick-erc'>
              <img className='icon-size' src={linkImg} alt='link' />
              <strong className=''> {linkPrice} LINK</strong>
            </div>
          ) : (
            <div className='pick-erc'>
              <img className='icon-size' src={daiImg} alt='dai' />
              <strong className=''> {daiPrice} DAI</strong>
            </div>
          )}
        </div>

        <div className='arrow'>
          <ArrowDownOutlined style={{ color: '#1890ff' }} />
        </div>

        <div className='transfer-border'>
          <strong>To</strong>
          <div className='pick-erc'>
            <img className='icon-size' src={oxyImg} alt='oxygen' />
            <strong className=''> {numberOfOxy} OXY</strong>
          </div>
        </div>

        {tokenType === 1 ? (
          <div className='pick-erc-btn'>
            <Button className='btn-apr' type='primary' onClick={() => approve(state, 1, linkPrice)}>
              <strong>Approve LINK</strong>
            </Button>
            {stepper === 0 ? (
              <Button className='btn-apr' disabled>
                <strong>Buy</strong>
              </Button>
            ) : (
              <Button
                className='btn-apr'
                type='primary'
                onClick={() => dispatch(buyOxygenERC(1, linkPrice, item.price))}
              >
                <strong>Buy</strong>
              </Button>
            )}
          </div>
        ) : (
          <div className='pick-erc-btn'>
            <Button className='btn-apr' type='primary' onClick={() => approve(state, 2, daiPrice)}>
              <strong>Approve DAI</strong>
            </Button>
            {stepper === 0 ? (
              <Button className='btn-apr' disabled>
                <strong>Buy</strong>
              </Button>
            ) : (
              <Button
                className='btn-apr'
                type='primary'
                onClick={() => dispatch(buyOxygenERC(2, daiPrice, item.price))}
              >
                <strong>Buy</strong>
              </Button>
            )}
          </div>
        )}

        <div className='step_w'>
          <Steps current={stepper}>
            <Step />
            <Step />
          </Steps>
        </div>
      </Modal>
    </div>
  );
}
