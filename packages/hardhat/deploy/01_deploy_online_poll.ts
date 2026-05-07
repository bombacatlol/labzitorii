import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";

const deployOnlinePoll: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { deployments, getNamedAccounts } = hre;
  const { deploy } = deployments;

  const { deployer } = await getNamedAccounts();

  const question = "Какую тему выбрать для итогового проекта по блокчейну?";
  const options = ["Голосование", "Аукцион", "Система лайков"];

  await deploy("OnlinePoll", {
    from: deployer,
    args: [question, options],
    log: true,
    autoMine: true, // Быстрая обработка транзакций на локалке
  });
};

export default deployOnlinePoll;
deployOnlinePoll.tags = ["OnlinePoll"];
