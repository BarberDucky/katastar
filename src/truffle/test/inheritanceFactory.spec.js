const ParcelToken = artifacts.require("ParcelToken")
const Inheritance = artifacts.require("Inheritance")
const InheritanceFactory = artifacts.require("InheritanceFactory")

contract('Testing Inheritance Factory contract', function (accounts) {

  let factory
  let token
  let tokenId

  beforeEach(async () => {
    token = await ParcelToken.new()
    factory = await InheritanceFactory.new(token.address)

    await token.mintToken(accounts[0])
    tokenId = await token.tokenOfOwnerByIndex(accounts[0], 0)
  })

  it('should create inheritance', async () => {

    await token.approve(factory.address, tokenId)

    let balanceBefore = await token.balanceOf(accounts[0])
    balanceBefore = balanceBefore.toNumber()
    
    await factory.createInheritance(
      tokenId,
      accounts[1],
      2 * 24 * 60 * 60
    )

    let balanceAfter = await token.balanceOf(accounts[0])
    balanceAfter = balanceAfter.toNumber()

    const inheritanceAddress = await factory.getInheritanceByParcelId(tokenId);
    const inheritance = await Inheritance.at(inheritanceAddress)

    const parcelId = await inheritance.getParcelId()


    const inheritanceBalance = await token.balanceOf(inheritanceAddress)

    const newTokenOwner = await token.ownerOf(tokenId)

    assert.equal(balanceBefore - 1, balanceAfter)
    assert.equal(parcelId.toNumber(), tokenId.toNumber())
    assert.equal(inheritanceBalance.toNumber(), 1)
    assert.equal(newTokenOwner, inheritanceAddress)
  })
})