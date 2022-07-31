const Warranty = artifacts.require("Warranty");

module.exports = function(deployer) {
  deployer.deploy(Warranty);
};
