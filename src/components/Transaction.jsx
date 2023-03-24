import React, { useEffect, useState } from "react";
import { AiOutlineSearch } from "react-icons/ai";
import { useProvider } from "wagmi";
import ABI from "../abi/ABI2.json";
import { ethers } from "ethers";
import { Polybase } from "@polybase/client";
import { ethPersonalSign } from "@polybase/eth";
import { secp256k1 } from "@polybase/util";
import { BiLoaderAlt } from "react-icons/bi";
import useChain from "@/hooks/useChain";

// const db = new Polybase({
//   defaultNamespace:
//     "pk/0xd2224e3b6a746740705e546bf56b185ab5476880f79799baf0aaf743b32bc3235b768b1765df873484674cf1049394bf839bef7c8f0d0faa4d7ef1c86e24dbb9/AttestationExplorer",
// });
// const key = db.collection("key");
// const about = db.collection("about");
// const creator = db.collection("creator");

// async function createRecord() {
//   // .create(args) args array is defined by the constructor fn
//   try {
//     const recordData = await key.create([
//       ["address1", "address2"],
//       ["addresscreator", "addresscreator2"],
//       "trialkey",
//     ]);
//     console.log(recordData);
//   } catch (e) {
//     console.log(e);
//   }
// }
// async function createWallet() {
// const { privateKey, publicKey } = await secp256k1.generateKeyPair();
// console.log("Private: ", ethers.utils.hexlify(privateKey));
// console.log("Public: ", ethers.utils.hexlify(publicKey));
// Public Key: 0x0356cb76e03ee37dd78e1dfbbe37c38b0207a17e98a693218d7cc21f3b34d5740c
// db.signer(async (data) => {
//   return {
//     h: "eth-personal-sign",
//     sig: ethPersonalSign(
//       "0x45e1386ce121d3e82e8a2539c582600a53bb3666948973bd4b7bc3ef4cb101f6",
//       data
//     ),
//   };
// });
// createRecord();
// }
// createWallet();
const attestTopic =
  "0x28710dfecab43d1e29e02aa56b2e1e610c0bae19135c9cf7a83a1adb6df96d85";

const Transaction = () => {
  let method = "attest(address,bytes32,bytes)";
  const { alchemy, chain } = useChain();
  const [txns, setTxns] = useState([]);
  const [load, setLoad] = useState(false);
  useEffect(() => {
    // method.replace(/\s\w+(,|\))/g, (_, commaOrBracket) => commaOrBracket);
    async function fetch() {
      setLoad(true);
      setTxns([]);
      const transactions = await alchemy.core.getAssetTransfers({
        fromBlock: "0x34A941",
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
        setLoad(true);
        const res1 = await alchemy.core.getTransactionReceipt(hash);
        // console.log(res1);
        const res = iface.parseLog({
          data: res1.logs[0].data,
          topics: res1.logs[0].topics,
        });
        //Error: 0x5eb5ea10
        // 0x50cd32e7dea3b20a11837230cf499a7a383df7162ae9e69e5a31eea25a65ae21
        //Okay: 0x5eb5ea10
        // 0x659b9ec1009f268952cdab9db9944545e69b2bf656f4ff296be8bb9aa20047dd
        // console.log(res.args.about);
        const bytes = ethers.utils.arrayify(res.args.val);
        const val = ethers.utils.toUtf8String(bytes);
        // console.log(res.args.key);
        let key;
        try {
          key = ethers.utils.parseBytes32String(res.args.key);
        } catch (e) {
          console.log(e);
          key = res.args.key;
        }
        // const key = res.args.key;
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
      setLoad(false);
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
              <div className="py-2 flex overflow-scroll">
                <div className="font-semibold w-[70px] mr-2">About</div> {txn.about}
              </div>
              <div className="py-2 flex overflow-scroll">
                <div className="font-semibold w-[70px] mr-2">Creator</div>{" "}
                {txn.creator}
              </div>
              <div className="py-2 flex overflow-scroll">
                <div className="font-semibold w-[70px]">Key</div> {txn.key}
              </div>
              <div className="py-2 flex overflow-scroll">
                <div className="font-semibold w-[70px] mr-2">Value</div> {txn.val}
                <div className="ml-auto w-fit">
                  View transaction{" "}
                  <a
                    href={`${chain.explorer}${txn.hash}`}
                    className="underline underline-offset-2 text-blue-600"
                  >
                    here
                  </a>
                </div>
              </div>
            </div>
          );
        })}
        {load ? (
          <BiLoaderAlt className="text-lg animate-spin mx-auto mt-1" />
        ) : (
          <></>
        )}
      </div>
    </div>
  );
};

export default Transaction;
