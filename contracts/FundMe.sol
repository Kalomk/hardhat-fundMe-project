// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "@chainlink/contracts/src/v0.8/interfaces/AggregatorV3Interface.sol";
import "contracts/PriceConventer.sol";

error FundMe__NotOwner();

contract FundMe {

using PriceConventer for uint256;


constructor(address priceFeedAdress){
    i_owner = msg.sender;
    s_priceFeed = AggregatorV3Interface(priceFeedAdress);
}

address immutable private i_owner;
AggregatorV3Interface public s_priceFeed;
address[] private s_funders;
mapping (address => uint256) private s_AdressToUsdAMount;
uint256 public constant minimumUsd = 50 * 1e18;

    function fund() public payable {
require(msg.value.getEthAmount(s_priceFeed) >= minimumUsd,"You need to spend more ETH");
s_funders.push(msg.sender);
s_AdressToUsdAMount[msg.sender] += msg.value;
    }

    function withdraw() public onlyOwner {
address[] memory funders = s_funders;
for(uint256 _fundIndex = 0; _fundIndex < funders.length; _fundIndex++){
address funder = funders[_fundIndex];
s_AdressToUsdAMount[funder] = 0;
}
s_funders = new address[](0);
(bool callSuccess, ) = payable (msg.sender).call{value:address(this).balance}("");
require(callSuccess,"Withdrdaw dosent exist");
    }


   modifier onlyOwner{
if(msg.sender != i_owner){
    revert FundMe__NotOwner();
}
_;
   }

   function getOwner() public view returns(address){
    return i_owner;
   }

   function getFunders(uint256 index) public view returns(address){
    return s_funders[index];
   }

    function getAdressToUsdAMount(address funder) public view returns(uint256){
    return s_AdressToUsdAMount[funder];
   }

   function getPriceFeed() public view returns(AggregatorV3Interface){
    return s_priceFeed;
   }
//    receive() external  payable {
//        fund();
//    }
//    fallback() external  payable {
//        fund();
//    }
}