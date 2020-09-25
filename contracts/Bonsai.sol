// contracts/GameItem.sol
// SPDX-License-Identifier: MIT
pragma solidity ^0.6.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

pragma experimental ABIEncoderV2;

contract Bonsai is ERC721, Ownable {
    struct Plant {
        uint256 id;
        string name;
        uint16 price;
    }

    mapping(address => string) public plantDict;

    Plant[] public plants;

    constructor() public ERC721("Bonsai", "BS") {}

    function setPlantDict(string memory _plant, address _address)
        public
        onlyOwner
    {
        plantDict[_address] = _plant;
    }

    function mint(
        address _to,
        string memory _name,
        uint16 _price
    ) public onlyOwner {
        uint256 countPlant = plants.length;
        plants.push(Plant(countPlant, _name, _price));
        _mint(_to, countPlant);
    }

    function getPlantsByOwner(address _owner)
        public
        view
        returns (Plant[] memory)
    {
        uint256 countPlant = balanceOf(_owner);
        Plant[] memory result = new Plant[](countPlant);
        uint256 counter = 0;
        for (uint256 i = 0; i < plants.length; i++) {
            if (_exists(i) && ownerOf(i) == _owner) {
                result[counter] = plants[i];
                counter++;
                if (counter == countPlant) {
                    break;
                }
            }
        }

        return result;
    }

    function getMyPlant() public view returns (Plant[] memory) {
        return getPlantsByOwner(msg.sender);
    }

    function burn(uint256 _tokenId) public onlyOwnerOf(_tokenId) {
        _burn(_tokenId);
    }

    modifier onlyOwnerOf(uint256 _tokenId) {
        require(msg.sender == ownerOf(_tokenId));
        _;
    }
}
