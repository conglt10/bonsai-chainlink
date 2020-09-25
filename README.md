<h1  align="center">Bonsai Chainlink</h1>

<p>
<img  src="https://img.shields.io/badge/version-1.0.0-blue.svg?cacheSeconds=2592000"  />
</p>

![Screenshot from 2020-09-08 09-33-35](https://user-images.githubusercontent.com/52224456/92427338-69d30380-f1b6-11ea-81f3-7a38989735ae.png)

## Bonsai Chainlink Dapp

This demonstrates the three important parts of a dapp and how they should be connected:

1. The browser UI (ReactJS + Redux)
2. Web3.js Library
3. Smart Contract Solidity
4. Chainlink Oracle (Get price USD/ETH, USD/LINK, USD/DAI)

Ethereum Token Standard have used by app

1. BonSai (ERC-721): Each Bonsai has id unique, name and price.
2. Oxygen (ERC-20): Generate when user plant Bonsai, use buy Bonsai.

## Functionality

Bonsai Chainlink :

1. Get price ETH, LINK, DAI follow USD price.
2. Buy Oxygen token with ETH, LINK or DAI.
3. Buy Bonsai from stock by Oxygen token.
4. Planting Bonsai in the collection.
5. After a certain period of time (2 minutes), each Bonsai will photosynthesize some oxygen.
6. Transfer Bonsai to friend.

Future Function:

1. Each Bonsai is growed from a seed (generate random from Verifiable Random Numbers of Chainlink). The seed determines the quality of the plant as well as other parameters such as growth rate and price (Legendary Bonsai or Normal Bonsai).

![legendary bonsai](https://user-images.githubusercontent.com/52224456/94217817-21814880-ff0d-11ea-8642-35cae073a19c.png)

2. The contract has the ability to update properties such as the life of a plant, which will display other forms of the plant such as sprouting, flowering, and fruiting.

![growing](https://user-images.githubusercontent.com/52224456/92190568-b43d4300-ee8b-11ea-8699-3ce18938ed26.png)

3. It is possible to resell the trees you have planted.

## Video Demo

[![demo](http://img.youtube.com/vi/VKY4rW4Waz0/0.jpg)](https://youtu.be/EhdT60OsuWE 'demo')

## Live At (Ropsten testnet)

https://bonsai-chainlink.web.app

## How to play

**If you are beginer, you would go a tour with app**

![Screenshot from 2020-09-10 08-49-44](https://user-images.githubusercontent.com/52224456/92672310-9c116c00-f342-11ea-8184-aa5b09b3a0b1.png)

![Screenshot from 2020-09-22 16-10-19](https://user-images.githubusercontent.com/52224456/93863783-27e5a980-fcee-11ea-90c6-7a37b196a4f2.png)

**You would be received 3000 Oxygen to buy first Bonsai**

![Screenshot from 2020-09-10 08-42-20](https://user-images.githubusercontent.com/52224456/92672368-b77c7700-f342-11ea-9547-743906113135.png)

![receive-sucessfully](https://user-images.githubusercontent.com/52224456/92562602-70d64080-f2a0-11ea-961e-8968e1c6a60b.png)

**Let's buy**

![Screenshot from 2020-09-10 08-42-43](https://user-images.githubusercontent.com/52224456/92672412-d2e78200-f342-11ea-8145-c8c78a967bc3.png)

![Screenshot from 2020-09-22 16-13-08](https://user-images.githubusercontent.com/52224456/93864050-8743b980-fcee-11ea-8676-00515cb95766.png)

![Screenshot from 2020-09-22 16-15-01](https://user-images.githubusercontent.com/52224456/93864442-1cdf4900-fcef-11ea-8f2f-b851a2109e66.png)

**Tada !**

![Screenshot from 2020-09-10 08-48-06](https://user-images.githubusercontent.com/52224456/92672489-fca0a900-f342-11ea-9806-1f25207aa48b.png)

**Buy Oxygen with Token (Native Token or ERC20 Token)**

![Screenshot from 2020-09-24 16-11-29](https://user-images.githubusercontent.com/52224456/94135096-2b636700-fe8d-11ea-8335-ff28993e094a.png)

**With ETH**

![Screenshot from 2020-09-25 07-57-03](https://user-images.githubusercontent.com/52224456/94214812-d6fbce00-ff04-11ea-8738-3b1e1884d6a0.png)

**With LINK Token**

- Step1: Aprrove to smart contract Oxygen token.
- Step2: Buy Oxygen with LINK.

![Screenshot from 2020-09-24 16-11-41](https://user-images.githubusercontent.com/52224456/94135108-2d2d2a80-fe8d-11ea-9b57-f8f252e57107.png)

![Screenshot from 2020-09-24 16-19-08](https://user-images.githubusercontent.com/52224456/94135113-2e5e5780-fe8d-11ea-820a-818f1201e697.png)

**With DAI Token**

- Step1: Aprrove to smart contract Oxygen token.
- Step2: Buy Oxygen with DAI.

![Screenshot from 2020-09-24 16-19-28](https://user-images.githubusercontent.com/52224456/94135123-30c0b180-fe8d-11ea-8cd1-49951649ad4a.png)

![Screenshot from 2020-09-25 13-29-53](https://user-images.githubusercontent.com/52224456/94234113-38d32c80-ff33-11ea-8d11-78e393c8a95e.png)

**Transfer Bonsai To Friends**

![Screenshot from 2020-09-22 16-32-28](https://user-images.githubusercontent.com/52224456/93865948-3bdeda80-fcf1-11ea-9d10-3c713c99c6fc.png)

![Screenshot from 2020-09-22 16-33-16](https://user-images.githubusercontent.com/52224456/93866013-5618b880-fcf1-11ea-81b2-13b77d758e0c.png)

**Move Position Of Bonsai**

![Screenshot from 2020-09-22 16-34-15](https://user-images.githubusercontent.com/52224456/93866134-79436800-fcf1-11ea-8899-e5335d6eb89d.png)

![Screenshot from 2020-09-22 16-34-48](https://user-images.githubusercontent.com/52224456/93866204-92e4af80-fcf1-11ea-96ef-9150465b71d7.png)

![Screenshot from 2020-09-22 16-34-58](https://user-images.githubusercontent.com/52224456/93866216-95470980-fcf1-11ea-8ae0-c066aac63ba7.png)

## How to run project

```bash
cp .env.example .env
```

Add infor into `.env`

### Deployment Ropsten

#### Deploy Contract

```bash
yarn install
```

```bash
yarn truffle migrate --network ropsten
```

### Run UI

```bash
cd ui
cp .env.example .env
yarn install
```

Add infor into `.env`

```bash
yarn start
```

View in http://localhost:3000
