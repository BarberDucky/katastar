const ParcelToken = artifacts.require("ParcelToken")
const Inheritance = artifacts.require("Inheritance")
const InheritanceFactory = artifacts.require("InheritanceFactory")

contract('Testing Inheritance contract', function (accounts) {

  let factory
  let token
  let tokenId
  let inheritance
  let inheritanceAddress

  beforeEach(async () => {
    token = await ParcelToken.new()
    factory = await InheritanceFactory.new(token.address)

    await token.mintToken(accounts[0])
    tokenId = await token.tokenOfOwnerByIndex(accounts[0], 0)

    await token.approve(factory.address, tokenId)
  })

  it('should withdraw token to sender', async () => {
    await factory.createInheritance(
      tokenId,
      accounts[1],
      2 * 24 * 60 * 60 // 2 days
    )

    inheritanceAddress = await factory.getInheritanceByParcelId(tokenId);
    inheritance = await Inheritance.at(inheritanceAddress)

    let isParcelFree = await factory.isParcelFree(tokenId)
    assert.equal(isParcelFree, false)

    await inheritance.withdraw()

    const inheritanceBalance = await token.balanceOf(inheritanceAddress)
    const userBalance = await token.balanceOf(accounts[0])
    const newTokenOwner = await token.ownerOf(tokenId)
    const isWithdrawn = await inheritance.isWithdrawn()
    isParcelFree = await factory.isParcelFree(tokenId)

    assert.equal(userBalance.toNumber(), 1)
    assert.equal(inheritanceBalance.toNumber(), 0)
    assert.equal(newTokenOwner, accounts[0])
    assert.equal(isWithdrawn, true)
    assert.equal(isParcelFree, true)
  })

  it('should withdraw token to receiver', async () => {
    await factory.createInheritance(
      tokenId,
      accounts[1],
      0 // 0 sec
    )

    inheritanceAddress = await factory.getInheritanceByParcelId(tokenId);
    inheritance = await Inheritance.at(inheritanceAddress)
    
    let isParcelFree = await factory.isParcelFree(tokenId)
    assert.equal(isParcelFree, false)

    await inheritance.withdraw({from: accounts[1]})

    const inheritanceBalance = await token.balanceOf(inheritanceAddress)
    const userBalance = await token.balanceOf(accounts[1])
    const newTokenOwner = await token.ownerOf(tokenId)
    const isWithdrawn = await inheritance.isWithdrawn()
    isParcelFree = await factory.isParcelFree(tokenId)

    assert.equal(userBalance.toNumber(), 1)
    assert.equal(inheritanceBalance.toNumber(), 0)
    assert.equal(newTokenOwner, accounts[1])
    assert.equal(isWithdrawn, true)
    assert.equal(isParcelFree, true)
  })
})