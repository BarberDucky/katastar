const InheritanceFactory = artifacts.require("InheritanceFactory");
const ParcelToken = artifacts.require("ParcelToken")

module.exports = async function(deployer) {
  // deployment steps
  const networkId = deployer.network_id
  const parcelTokenAddress = ParcelToken.networks[networkId].address
  await deployer.deploy(InheritanceFactory, parcelTokenAddress);
  const inheritanceFactoryDeployed = await InheritanceFactory.deployed()
};