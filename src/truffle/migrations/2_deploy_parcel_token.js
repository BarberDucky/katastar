const ParcelToken = artifacts.require("ParcelToken");

module.exports = async function(deployer) {
  // deployment steps
  await deployer.deploy(ParcelToken);
  const parcelTokenDeployed = await ParcelToken.deployed()
};