// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

interface IPriceFeed {
    function latestAnswer() external view returns (int256);
    function setPrice(int256 _price) external;
}
