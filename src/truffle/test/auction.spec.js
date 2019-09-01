const ParcelToken = artifacts.require("ParcelToken")
const Auction = artifacts.require("Auction")
const AuctionFactory = artifacts.require("AuctionFactory")
const helper = require("./helpers/truffleTestHelper")

contract('Testing auction contract', function (accounts) {

  let factory
  let token
  let tokenId
  let auctionAddress
  let auction

  beforeEach(async () => {
    token = await ParcelToken.new()
    factory = await AuctionFactory.new(token.address)

    await token.mintToken(accounts[0])
    tokenId = await token.tokenOfOwnerByIndex(accounts[0], 0)

    await token.approve(factory.address, tokenId)

    await factory.createAuction(
      tokenId,
      1,
      100 // 100 sec
    )

    auctionAddress = await factory.getAuctionByParcelId(tokenId);
    auction = await Auction.at(auctionAddress)
  })

  it('should withdraw token to sender', async () => {
    await helper.advanceTimeAndBlock(200)

    await auction.endAuction()

    const auctionBalance = await token.balanceOf(auctionAddress)
    const userBalance = await token.balanceOf(accounts[0])
    const newTokenOwner = await token.ownerOf(tokenId)
    const isOver = await auction.isOver()

    assert.equal(userBalance.toNumber(), 1)
    assert.equal(auctionBalance.toNumber(), 0)
    assert.equal(newTokenOwner, accounts[0])
    assert.equal(isOver, true)
  })

  it('should withdraw funds to sender', async () => {

    const userBalanceBefore = await web3.eth.getBalance(accounts[0])

    await auction.bid({from: accounts[1], value: 10})
    
    await helper.advanceTime(200)

    const receipt = await auction.endAuction()
    const cost = await helper.getGasCost(receipt)

    const userBalanceAfter = await web3.eth.getBalance(accounts[0])
    const isOver = await auction.isOver()
    console.log(userBalanceBefore, cost, userBalanceAfter)
    assert.equal(Number(userBalanceBefore) - Number(cost) + 10, Number(userBalanceAfter))
    assert.equal(isOver, true)
  })

  it('should withdraw token to winner', async () => {

    await auction.bid({from: accounts[1], value: 10})

    await helper.advanceTimeAndBlock(200)

    await auction.endAuction()

    const newTokenOwner = await token.ownerOf(tokenId)
    const isOver = await auction.isOver()

    assert.equal(newTokenOwner, accounts[1])
    assert.equal(isOver, true)
  })
})