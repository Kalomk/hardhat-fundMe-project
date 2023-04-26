const {deployments,ethers,getNamedAccounts} = require('hardhat')
const {assert,expect} = require('chai')


describe('FundMe', async function (){
    let FundMe,deployer,MockV3Aggregator;
    const sendValue = ethers.utils.parseEther('1')
    beforeEach(async function () {
        deployer = (await getNamedAccounts()).deployer
        await deployments.fixture(['all'])
        FundMe = await ethers.getContract('FundMe',deployer)
        MockV3Aggregator = await ethers.getContract('MockV3Aggregator',deployer)
    })

    describe('constructor', async function (){
        it('sets the aggregator correctly', async () => {
            const response = await FundMe.getPriceFeed()
            assert.equal(response,MockV3Aggregator.address)
        })
    })

    describe('fund', async function (){
        it('Fails if you dont spent enough ETH', async () =>{
           await expect(FundMe.fund()).to.be.revertedWith('You need to spend more ETH')
        })
        it('updated amount funded data structure',async () =>{
            await FundMe.fund({value:sendValue})
            const response = await FundMe.getAdressToUsdAMount(deployer)
            assert.equal(response.toString(),sendValue.toString())
        })
        it('add funder to array getFunders',async () =>{
            await FundMe.fund({value:sendValue})
            const funder = await FundMe.getFunders(0)
            assert.equal(funder,deployer)
        })
    })

    describe('withdraw', async () =>{
        beforeEach(async () =>{
            await FundMe.fund({value:sendValue})
        })
        it('Withdraw ETH to single funder',async () =>{
            const startingFundMeBalance = await FundMe.provider.getBalance(
                FundMe.address
            )
            const startingDeployerBalance = await FundMe.provider.getBalance(
                deployer
            )

            const transactionResponse = await FundMe.withdraw()
            const transactionReceipt = await transactionResponse.wait(1)

            const {gasUsed,effectiveGasPrice} = transactionReceipt

            const gasCost = gasUsed.mul(effectiveGasPrice)
 
            const endingFundMeBalance = await FundMe.provider.getBalance(
                FundMe.address
            )
            const endingDeployerBalance = await FundMe.provider.getBalance(
                deployer
            )

            assert.equal(endingFundMeBalance,0)
            assert.equal(startingFundMeBalance.add(startingDeployerBalance).toString(),endingDeployerBalance.add(gasCost).toString())
         })

         it('Withdraw ETH to multiply getFunders',async () =>{

            const accounts = await ethers.getSigners()

            for(let i = 0; i < 6; i++){
                const fundMeConnectedContract = await FundMe.connect(
                    accounts[i]
                )
               await fundMeConnectedContract.fund({value:sendValue})
            }

            const startingFundMeBalance = await FundMe.provider.getBalance(
                FundMe.address
            )
            const startingDeployerBalance = await FundMe.provider.getBalance(
                deployer
            )

            const transactionResponse = await FundMe.withdraw()
            const transactionReceipt = await transactionResponse.wait(1)

            const {gasUsed,effectiveGasPrice} = transactionReceipt

            const gasCost = gasUsed.mul(effectiveGasPrice)
 
            const endingFundMeBalance = await FundMe.provider.getBalance(
                FundMe.address
            )
            const endingDeployerBalance = await FundMe.provider.getBalance(
                deployer
            )

            assert.equal(endingFundMeBalance,0)
            assert.equal(startingFundMeBalance.add(startingDeployerBalance).toString(),endingDeployerBalance.add(gasCost).toString())

            await expect(FundMe.getFunders(0)).to.be.reverted

            for(let i=0; i < 6; i++){
                 assert.equal(await FundMe.getAdressToUsdAMount(accounts[i].address),0)
            }
         })
         
         it('Only allows the owner to withdraw', async () =>{
            const accounts = await ethers.getSigners()
            const attacker = accounts[1]
            const attackerConnectedContract = await FundMe.connect(attacker)
            await expect(attackerConnectedContract.withdraw()).to.be.reverted
         })

    })
})