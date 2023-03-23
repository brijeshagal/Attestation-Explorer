import useAlchemy from "@/hooks/useAlchemy";
import React, { useEffect, useState } from "react";
import { AiOutlineSearch } from "react-icons/ai";
import { useProvider } from "wagmi";
import ABI from "../abi/ABI2";
import { ethers } from "ethers";
import { Polybase } from "@polybase/client";
import { ethPersonalSign } from "@polybase/eth";
import { secp256k1 } from "@polybase/util";
import Link from "next/link";

const db = new Polybase({
  defaultNamespace:
    "pk/0xd2224e3b6a746740705e546bf56b185ab5476880f79799baf0aaf743b32bc3235b768b1765df873484674cf1049394bf839bef7c8f0d0faa4d7ef1c86e24dbb9/AttestationExplorer",
});
const key = db.collection("key");
const about = db.collection("about");
const creator = db.collection("creator");

async function createRecord() {
  // .create(args) args array is defined by the constructor fn
  try {
    const recordData = await key.create([
      ["address1", "address2"],
      ["addresscreator", "addresscreator2"],
      "trialkey",
    ]);
    console.log(recordData);
  } catch (e) {
    console.log(e);
  }
}
async function createWallet() {
  // const { privateKey, publicKey } = await secp256k1.generateKeyPair();
  // console.log("Private: ", ethers.utils.hexlify(privateKey));
  // console.log("Public: ", ethers.utils.hexlify(publicKey));
  // Public Key: 0x0356cb76e03ee37dd78e1dfbbe37c38b0207a17e98a693218d7cc21f3b34d5740c
  db.signer(async (data) => {
    return {
      h: "eth-personal-sign",
      sig: ethPersonalSign(
        "0x45e1386ce121d3e82e8a2539c582600a53bb3666948973bd4b7bc3ef4cb101f6",
        data
      ),
    };
  });
  createRecord();
}
// createWallet();
const attestTopic =
  "0x28710dfecab43d1e29e02aa56b2e1e610c0bae19135c9cf7a83a1adb6df96d85";

const Transaction = () => {
  let method = "attest(address,bytes32,bytes)";
  const { alchemy } = useAlchemy();
  const [txns, setTxns] = useState([]);
  const provider = useProvider();
  const handleSearch = (e) => {
    e.preventDefault();
  };

  useEffect(() => {
    // method.replace(/\s\w+(,|\))/g, (_, commaOrBracket) => commaOrBracket);
    // const keccak = keccak256(Buffer.from(method));
    // console.log('keccak', keccak);
    // const methodId = keccak.toString("hex");
    // console.log('methodId: ',methodId);
    // const getABI = async () => {
    //   const res = await axios.get(
    //     `https://api-optimistic.etherscan.io/api?module=contract&action=getabi&address=0x1BEb19F1685ddF2F774884902119Fa2FA5d8f509&apikey=YRUJK2B42I5MGARNXQM5RRR91Z2UJ4GYCA`
    //   );
    //   return JSON.parse(res.data.result);
    // };
    async function fetch() {
      const transactions = await alchemy.core.getAssetTransfers({
        fromBlock: "0x0",
        toAddress: "0xEE36eaaD94d1Cc1d0eccaDb55C38bFfB6Be06C77",
        maxCount: "0xa",
        excludeZeroValue: false,
        order: "desc",
        category: ["external", "erc20", "erc721", "erc1155", "specialnft"],
      });
      // console.log(transactions);
      const hashes = [];
      transactions.transfers.forEach((tx) => {
        hashes.push(tx.hash);
      });
      // console.log(hashes);
      // const receipts = [];
      let iface = new ethers.utils.Interface(ABI);
      for (let hash of hashes) {
        const res1 = await alchemy.core.getTransactionReceipt(hash);
        // console.log(res1);
        const res = iface.parseLog({
          data: res1.logs[0].data,
          topics: res1.logs[0].topics,
        });
        // console.log(res.args.about);
        // receipts.push();
        const bytes = ethers.utils.arrayify(res.args.val);
        const val = ethers.utils.toUtf8String(bytes);
        const key = ethers.utils.parseBytes32String(res.args.key);
        const result = {
          hash: hash,
          from: res1.from,
          creator: res.args.creator,
          about: res.args.about,
          key: key,
          val: val,
        };
        // console.log(result);
        setTxns((prev) => [...prev, result]);
      }
      // const ABI3 = await getABI();

      // Txn Data

      // abiDecoder.addABI(ABI);

      // const decodedData = abiDecoder.decodeMethod(
      //  res1.logs[0].data
      // );
      // console.log("decodedData: ", JSON.stringify(decodedData));
      // console.log(txns);
    }
    fetch();
  }, [alchemy]);
  return (
    <div>
      {/* <form className="flex  overflow-hidden rounded-lg bg-white m-3 px-5 py-1 justify-center items-center">
        <div className="w-[100px]">All Filters</div>
        <input
          className="p-2 flex-1 focus:outline-none"
          placeholder="Search an Attestation"
        />
        <div className="bg-blue-400 h-full ">
        <button type="submit" onClick={handleSearch} className="h-full p-2">
          <AiOutlineSearch className="m-auto text-lg" />
        </button>
        </div>
      </form> */}
      <div className="p-2 flex flex-col space-y-4">
        <div className="mx-auto font-bold tracking-widest w-fit">
          Latest Attestations
        </div>
        {txns?.map((txn, idx) => {
          return (
            <div
              className="p-3 bg-white rounded hover:scale-[1.05] duration-75 transition-all"
              key={idx}
            >
              {/* {txn.from} */}
              <div className="py-2 flex">
                <div className="font-semibold w-[70px]">About</div> {txn.about}
              </div>
              <div className="py-2 flex">
                <div className="font-semibold w-[70px]">Creator</div>{" "}
                {txn.creator}
              </div>
              <div className="py-2 flex">
                <div className="font-semibold w-[70px]">Key</div> {txn.key}
              </div>
              <div className="py-2 flex">
                <div className="font-semibold w-[70px]">Value</div> {txn.val}
              </div>
              <div className="ml-auto w-fit">
                View transaction{" "}
                <a href={`https://goerli-optimism.etherscan.io/tx/${txn.hash}`} className='underline underline-offset-2 text-blue-600'>
                  here
                </a>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Transaction;
