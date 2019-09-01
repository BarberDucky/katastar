const ParcelToken = artifacts.require("ParcelToken")
const Deal = artifacts.require("Deal")

contract('Testing deal contract', function (accounts) {

  let token
  let tokenId1
  let tokenId2

  beforeEach(async () => {
    token = await ParcelToken.new()

    await token.mintToken(accounts[0])
    tokenId1 = await token.tokenOfOwnerByIndex(accounts[0], 0)

    await token.mintToken(accounts[1])
    tokenId2 = await token.tokenOfOwnerByIndex(accounts[1], 0);

  })

  it('should create deal with tokens and ether', async () => {
    const deal = await Deal.new(
      token.address,
      accounts[0], accounts[1],
      100, 20,
      tokenId1, tokenId2
    )

    const user1Requests = await deal.getUserRequests(accounts[0])
    const user2Requests = await deal.getUserRequests(accounts[1])
    
    assert.equal(user1Requests[0].toNumber(), 100);
    assert.equal(user1Requests[1].toNumber(), tokenId1);
    assert.equal(user2Requests[0].toNumber(), 20);
    assert.equal(user2Requests[1].toNumber(), tokenId2);
  })

  it('should pay eth', async () => {
    const deal = await Deal.new(
      token.address,
      accounts[0], accounts[1],
      100, 0,
      0, 0
    )

    await deal.payEth({from: accounts[1], value: 100})

    const user1Receives = await deal.getUserReceives(accounts[0])
    const isSettled = await deal.isSettled()

    assert.equal(user1Receives[0].toNumber(), 100);
    assert.equal(isSettled, true);
  })

  it('should pay token', async () => {
    const deal = await Deal.new(
      token.address,
      accounts[0], accounts[1],
      0, 0,
      0, tokenId1
    )

    await token.safeTransferFrom(accounts[0], deal.address, tokenId1)

    const user2Receives = await deal.getUserReceives(accounts[1])
    const isSettled = await deal.isSettled()

    assert.equal(user2Receives[1].toNumber(), tokenId1.toNumber());
    assert.equal(isSettled, true);
  })
  it('should withdraw before end', async () => {
    const deal = await Deal.new(
      token.address,
      accounts[0], accounts[1],
      40, 60,
      tokenId2, tokenId1
    )

    await token.safeTransferFrom(accounts[0], deal.address, tokenId1)
    await deal.payEth({from: accounts[1], value: 40})
    await deal.withdraw()

    const user2Receives = await deal.getUserReceives(accounts[1])
    const owner = await token.ownerOf(tokenId1)
    const isSettled = await deal.isSettled()

    assert.equal(owner, accounts[0])
    assert.equal(user2Receives[1].toNumber(), 0);
    assert.equal(isSettled, false);
  })

  it('should withdraw after settle', async () => {
    const deal = await Deal.new(
      token.address,
      accounts[0], accounts[1],
      100, 0,
      tokenId2, tokenId1
    )

    await token.safeTransferFrom(accounts[0], deal.address, tokenId1)
    await token.safeTransferFrom(accounts[1], deal.address, tokenId2, {from: accounts[1]})
    await deal.payEth({from: accounts[1], value: 100})

    await deal.withdraw()
    await deal.withdraw({from: accounts[1]})

    const owner1 = await token.ownerOf(tokenId1)
    const owner2 = await token.ownerOf(tokenId2)
    const isSettled = await deal.isSettled()

    assert.equal(owner1, accounts[1]);
    assert.equal(owner2, accounts[0])
    assert.equal(isSettled, true);
  })

  it('should settle after withdraw', async () => {
    const deal = await Deal.new(
      token.address,
      accounts[0], accounts[1],
      100, 0,
      tokenId2, tokenId1
    )

    await token.safeTransferFrom(accounts[0], deal.address, tokenId1)
    await deal.payEth({from: accounts[1], value: 100})

    await deal.withdraw({from: accounts[1]})

    await token.safeTransferFrom(accounts[1], deal.address, tokenId2, {from: accounts[1]})
    await deal.payEth({from: accounts[1], value: 100})

    await deal.withdraw()
    await deal.withdraw({from: accounts[1]})

    const owner1 = await token.ownerOf(tokenId1)
    const owner2 = await token.ownerOf(tokenId2)
    const isSettled = await deal.isSettled()

    assert.equal(owner1, accounts[1]);
    assert.equal(owner2, accounts[0])
    assert.equal(isSettled, true);
  })
})