const ParcelToken = artifacts.require("ParcelToken")

contract('Testing Parcel Token contract', function(accounts) {
    it('should mint parcel tokens', async () => {
        const token = await ParcelToken.new()

        let balanceBefore = await token.balanceOf(accounts[0])
        balanceBefore = balanceBefore.toNumber()

        await token.mintToken(accounts[0])

        let balanceAfter = await token.balanceOf(accounts[0])
        balanceAfter = balanceAfter.toNumber()

        assert.equal(balanceBefore + 1, balanceAfter)
    })

    it('should transfer tokens', async () => {
        const token = await ParcelToken.new()

        let balanceBefore1 = await token.balanceOf(accounts[0])
        balanceBefore1 = balanceBefore1.toNumber()

        let balanceBefore2 = await token.balanceOf(accounts[1])
        balanceBefore2 = balanceBefore2.toNumber()

        await token.mintToken(accounts[0])

        const tokenId = await token.tokenOfOwnerByIndex(accounts[0], 0)

        await token.safeTransferFrom(accounts[0], accounts[1], tokenId)

        let balanceAfter1 = await token.balanceOf(accounts[0])
        balanceAfter1 = balanceAfter1.toNumber()

        let balanceAfter2 = await token.balanceOf(accounts[1])
        balanceAfter2 = balanceAfter2.toNumber()
        
        assert.equal(balanceBefore1, balanceAfter1)
        assert.equal(balanceBefore2 + 1, balanceAfter2)

        const newOwner = await token.ownerOf(tokenId)

        assert.equal(accounts[1], newOwner)
    })
})