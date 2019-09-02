const AuctionFactory = artifacts.require("AuctionFactory");
const ParcelToken = artifacts.require("ParcelToken")

module.exports = async function(deployer) {
  // deployment steps
  const networkId = deployer.network_id
  const parcelTokenAddress = ParcelToken.networks[networkId].address
  await deployer.deploy(AuctionFactory, parcelTokenAddress);
  const inheritanceFactoryDeployed = await AuctionFactory.deployed()
};