// ts-node swap.ts

import { Contract, providers, Wallet } from "ethers";
import dotenv from "dotenv";
import { parseFixed } from "@ethersproject/bignumber";
import { vaultABI } from "./abi/Vault";
import { Vault } from "./types/Vault";

dotenv.config();

const poolId =
  "0xf0ad209e2e969eaaa8c882aac71f02d8a047d5c2000200000000000000000b49";
const assetIn = "0x0d500B1d8E8eF31E21C99d1Db9A6444d3ADf1270";
const assetOut = "0x3A58a54C066FdC0f2D55FC9C89F0415C92eBf3C4";
const amount = "1.23"; // in ether (decimals allowed)

async function main() {
  if (!process.env.PRIVATE_KEY) throw "No private key detected in .env";

  const wallet = new Wallet(
    process.env.PRIVATE_KEY,
    new providers.JsonRpcProvider("https://polygon-rpc.com")
  );

  const vault = new Contract(
    "0xba12222222228d8ba445958a75a0704d566bf2c8",
    vaultABI,
    wallet
  ) as Vault;

  const userData = "0x";

  const singleSwap = {
    poolId,
    kind: 0,
    assetIn,
    assetOut,
    amount: parseFixed(amount, 18),
    userData,
  };

  const funds = {
    sender: wallet.address,
    fromInternalBalance: false,
    recipient: wallet.address,
    toInternalBalance: false,
  };

  const limit = 0;

  const deadline = Math.floor(Date.now() / 1000) + 600;

  const tx = await vault.swap(singleSwap, funds, limit, deadline);

  console.log("SWAP SUCCESSFUL");
  console.log("TX hash: ", tx.hash);
}

main().catch((e) => {
  console.error("SWAP UNSUCCESSFUL");
  console.error(e);

  process.exit(1);
});
