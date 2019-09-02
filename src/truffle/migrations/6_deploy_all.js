const ParcelToken = artifacts.require("ParcelToken");
const AuctionFactory = artifacts.require("AuctionFactory");
const InheritanceFactory = artifacts.require("InheritanceFactory");

module.exports = async function(deployer) {
  // deployment steps
  await deployer.deploy(ParcelToken);
  const parcelTokenDeployed = await ParcelToken.deployed()

  const networkId = deployer.network_id
  const parcelTokenAddress = ParcelToken.networks[networkId].address
  
  await deployer.deploy(InheritanceFactory, parcelTokenAddress);
  const inheritanceFactoryDeployed = await InheritanceFactory.deployed()

  await deployer.deploy(AuctionFactory, parcelTokenAddress);
  const auctionFactoryDeployed = await AuctionFactory.deployed()

};