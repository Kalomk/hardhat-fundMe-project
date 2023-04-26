export interface networkConfigItem {
    ethUSDPrice?: string
    blockConfirmations?: number
  }
  
  export interface networkConfigInfo {
    [key: string]: networkConfigItem
  }

export const networkConfig:networkConfigInfo ={
    sepolia:{
        ethUSDPrice:'0x694AA1769357215DE4FAC081bf1f309aDC325306',
        blockConfirmations:6
    },
    hardhat: {},
    localhost:{}
}
export const developmentChains = ['hardhat','localhost'];
export const DECIMALS = "8"
export const INITIAL_PRICE = "200000000000"
