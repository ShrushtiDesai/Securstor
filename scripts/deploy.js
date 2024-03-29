const hre = require("hardhat");

async function main() {
  const FileShare = await hre.ethers.getContractFactory("FileShare");
  const upload = await FileShare.deploy();

  await upload.deployed();

  console.log("Library deployed to:", upload.address);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});