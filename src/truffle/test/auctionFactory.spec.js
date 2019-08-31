const ParcelToken = artifacts.require("ParcelToken")
const Auction = artifacts.require("Auction")
const AuctionFactory = artifacts.require("AuctionFactory")

contract('Testing Auction Factory contract', function (accounts) {

  let factory
  let token
  let tokenId

  beforeEach(async () => {
    token = await ParcelToken.new()
    factory = await AuctionFactory.new(token.address)

    await token.mintToken(accounts[0])
    tokenId = await token.tokenOfOwnerByIndex(accounts[0], 0)
  })

  it('should create auction', async () => {

    await token.approve(factory.address, tokenId)

    let balanceBefore = await token.balanceOf(accounts[0])
    balanceBefore = balanceBefore.toNumber()
    
    await factory.createAuction(
      tokenId,
      1,
      2 * 24 * 60 * 60
    )

    let balanceAfter = await token.balanceOf(accounts[0])
    balanceAfter = balanceAfter.toNumber()

    const auctionAddress = await factory.getAuctionByParcelId(tokenId);
    const auction = await Auction.at(auctionAddress)

    const parcelId = await auction.getParcelId()


    const auctionBalance = await token.balanceOf(auctionAddress)

    const newTokenOwner = await token.ownerOf(tokenId)

    assert.equal(balanceBefore - 1, balanceAfter)
    assert.equal(parcelId.toNumber(), tokenId.toNumber())
    assert.equal(auctionBalance.toNumber(), 1)
    assert.equal(newTokenOwner, auctionAddress)
  })
})