const Oxygen = artifacts.require('Oxygen');
require('dotenv').config();

module.exports = (deployer) => {
  const amountOxygenReceive = process.env.AMOUNT_OXYGEN;
  const scopeTime = process.env.SCOPE_TIME;

  deployer.deploy(Oxygen, amountOxygenReceive, scopeTime);
};
