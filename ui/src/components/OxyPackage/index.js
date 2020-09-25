import React, { useState } from 'react';
import Swap from 'components/Swap';
import { Col, Button, Dropdown, Menu } from 'antd';

import ethImg from 'images/ethereum.png';
import linkImg from 'images/chainlink.png';
import daiImg from 'images/dai.png';

import './index.css';

export default function OxyPackage({ item, onBuyPlant, unit }) {
  const [visible, setVisible] = useState(false);
  const [tokenType, setTokenType] = useState(1);
  const [numberOfOxy, setNumberOfOxy] = useState(0);

  const onBuyPlantWithERC = (tokenType, price) => {
    setVisible(true);
    setTokenType(tokenType);
    if (price === 1) {
      setNumberOfOxy(1000);
    } else if (price === 5) {
      setNumberOfOxy(10000);
    } else {
      setNumberOfOxy(100000);
    }
  };

  const menu = (price) => (
    <Menu>
      <Menu.Item>
        <Button className='w-100' onClick={onBuyPlant}>
          <div className='pick-erc'>
            <img className='icon-size' src={ethImg} alt='eth' />
            <strong className='text-width'> ETH</strong>
          </div>
        </Button>
      </Menu.Item>
      <Menu.Item>
        <Button className='w-100' onClick={() => onBuyPlantWithERC(1, price)}>
          <div className='pick-erc'>
            <img className='icon-size' src={linkImg} alt='link' />
            <strong className='text-width'> LINK</strong>
          </div>
        </Button>
      </Menu.Item>
      <Menu.Item>
        <Button className='w-100' onClick={() => onBuyPlantWithERC(2, price)}>
          <div className='pick-erc'>
            <img className='icon-size' src={daiImg} alt='dai' />
            <strong className='text-width'> DAI</strong>
          </div>
        </Button>
      </Menu.Item>
    </Menu>
  );

  return (
    <Col className='gutter-row r-bot-10px r-top-10px' span={8}>
      <div className='align-center'>
        <strong> {item.name} </strong>
      </div>

      <div className='bg-swapItem'>
        <img src={item.plantImg} className=' h-160px w-100 ' alt='' />
      </div>

      <Dropdown
        className='w-100 r-bot-10px'
        type='primary'
        overlay={menu(item.price)}
        placement='bottomCenter'
      >
        <Button>
          <strong>
            {item.price} {unit}
          </strong>
        </Button>
      </Dropdown>

      {/* Modal to buy Oxygen with ERC */}
      <Swap
        visible={visible}
        setVisible={setVisible}
        item={item}
        tokenType={tokenType}
        numberOfOxy={numberOfOxy}
        unit={unit}
      />
    </Col>
  );
}
