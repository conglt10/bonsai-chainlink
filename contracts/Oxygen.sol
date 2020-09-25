pragma solidity ^0.6.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/math/SafeMath.sol";
import "@chainlink/contracts/src/v0.6/interfaces/AggregatorV3Interface.sol";

contract Oxygen is ERC20, Ownable {
    AggregatorV3Interface internal ethPriceFeed;
    AggregatorV3Interface internal daiPriceFeed;
    AggregatorV3Interface internal linkPriceFeed;

    // Ropsten Price Feed contracts address (chainlink)
    address ETHUSD = 0x30B5068156688f818cEa0874B580206dFe081a03;
    address LINKUSD = 0x40c9885aa8213B40e3E8a0a9aaE69d4fb5915a3A;
    address DAIUSD = 0xaF540Ca83c7da3181778e3D1E11A6137e7e0085B;

    // Ropsten Link vs Dai contract address
    address LinkContractAddress = 0x20fE562d797A42Dcb3399062AE9546cd06f63280;
    address DaiContractAddress = 0xaD6D458402F60fD3Bd25163575031ACDce07538D;

    ERC20 LINK;
    ERC20 DAI;

    using SafeMath for uint256;

    mapping(address => uint256) public lastTimeReceiveOxygen;
    mapping(address => bool) public airDropped;

    uint256 public amountOxygenReceiveOneTime;
    uint256 public scopeTimeReceiveOxygen;

    constructor(uint256 amountOxygen, uint256 scopeTime)
        public
        ERC20("Oxygen", "OX")
    {
        ethPriceFeed = AggregatorV3Interface(ETHUSD);
        linkPriceFeed = AggregatorV3Interface(LINKUSD);
        daiPriceFeed = AggregatorV3Interface(DAIUSD);

        LINK = ERC20(LinkContractAddress);
        DAI = ERC20(DaiContractAddress);

        amountOxygenReceiveOneTime = amountOxygen;
        scopeTimeReceiveOxygen = scopeTime;
    }

    function getLatestPrice(uint8 tokenType) public view returns (int256) {
        if (tokenType == 0) {
            (
                uint80 roundID,
                int256 price,
                uint256 startedAt,
                uint256 timeStamp,
                uint80 answeredInRound
            ) = ethPriceFeed.latestRoundData();

            // If the round is not complete yet, timestamp is 0
            require(timeStamp > 0, "Round not complete");
            return price;
        } else if (tokenType == 1) {
            (
                uint80 roundID,
                int256 price,
                uint256 startedAt,
                uint256 timeStamp,
                uint80 answeredInRound
            ) = linkPriceFeed.latestRoundData();

            // If the round is not complete yet, timestamp is 0
            require(timeStamp > 0, "Round not complete");
            return price;
        } else if (tokenType == 2) {
            (
                uint80 roundID,
                int256 price,
                uint256 startedAt,
                uint256 timeStamp,
                uint80 answeredInRound
            ) = daiPriceFeed.latestRoundData();

            // If the round is not complete yet, timestamp is 0
            require(timeStamp > 0, "Round not complete");
            return price;
        }
    }

    function airDrop(address recipient) public onlyOwner {
        require(!airDropped[recipient], "This address has air dropped");
        require(balanceOf(recipient) == 0, "This address has already oxygen");

        _mint(recipient, 3000000000000000000000);
        airDropped[recipient] = true;
    }

    function receiveOxygen(address recipient, uint256 numberOfBonsai)
        public
        onlyOwner
    {
        uint256 lastTimeReceive = lastTimeReceiveOxygen[recipient];

        if (lastTimeReceive == 0) {
            lastTimeReceiveOxygen[recipient] = now;
            return;
        }

        uint256 waitingTime = now.sub(lastTimeReceive);
        require(
            waitingTime > scopeTimeReceiveOxygen,
            "Not enough time to receive Oxy"
        );

        uint256 timesReceive = waitingTime.div(scopeTimeReceiveOxygen);
        uint256 totalReceive = timesReceive.mul(
            amountOxygenReceiveOneTime.mul(numberOfBonsai)
        );

        _mint(recipient, totalReceive);
        lastTimeReceiveOxygen[recipient] = lastTimeReceiveOxygen[recipient].add(
            scopeTimeReceiveOxygen.mul(timesReceive)
        );
    }

    function buyOxygen() public payable {
        require(msg.value > 0, "Amount can not less than zero");
        uint256 priceUnit = uint256(getLatestPrice(0));
        uint256 amountOxygen = 0;

        if (msg.value == priceUnit.mul(100000)) {
            amountOxygen = 1000000000000000000000;
        } else if (msg.value == priceUnit.mul(500000)) {
            amountOxygen = 10000000000000000000000;
        } else if (msg.value == priceUnit.mul(1000000)) {
            amountOxygen = 100000000000000000000000;
        }
        airDropped[msg.sender] = true;
        _mint(msg.sender, amountOxygen);
    }

    function buyOxygenWithERC20(
        uint8 tokenType,
        uint256 value,
        uint8 price
    ) public returns (bool) {
        address ownerAddress = owner();
        bool isSuccess = false;
        uint256 amountOxygen = 0;

        if (tokenType == 1) {
            // Link
            isSuccess = LINK.transferFrom(msg.sender, ownerAddress, value);
            if (isSuccess == true) {
                if (price == 1) {
                    amountOxygen = 1000000000000000000000;
                } else if (price == 5) {
                    amountOxygen = 10000000000000000000000;
                } else if (price == 10) {
                    amountOxygen = 100000000000000000000000;
                }
            } else return false;
        } else if (tokenType == 2) {
            // Dai
            isSuccess = DAI.transferFrom(msg.sender, ownerAddress, value);
            if (isSuccess == true) {
                if (price == 1) {
                    amountOxygen = 1000000000000000000000;
                } else if (price == 5) {
                    amountOxygen = 10000000000000000000000;
                } else if (price == 10) {
                    amountOxygen = 100000000000000000000000;
                }
            } else return false;
        }

        airDropped[msg.sender] = true;
        _mint(msg.sender, amountOxygen);
        return true;
    }

    function withDrawEther(uint256 value) public onlyOwner {
        require(
            value > 0 && value <= address(this).balance,
            "Value out of range"
        );
        msg.sender.transfer(value);
    }
}
