// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./IPriceFeed.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract PopOracle is IPriceFeed, Ownable {
    int256 private price;

    function latestAnswer() external view override returns (int256) {
        return price;
    }

    function setPrice(int256 _price) external override onlyOwner {
        price = _price;
    }
}
