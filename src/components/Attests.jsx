import React, { useEffect, useState } from "react";
import { useContract, useSigner } from "wagmi";
import abi from "../abi/ABI.json";
import { BiLoaderAlt } from "react-icons/bi";
import { MdContentCopy } from "react-icons/md";
import useChain from "@/hooks/useChain";

const methodID = "0x702b9dee";

const Attests = () => {
  const { alchemy, chain } = useChain();
  
  const [success, setSuccess] = useState();
  useEffect(() => {
    async function fetch() {
      const transactions = await alchemy.core.getAssetTransfers({
        fromBlock: "0x34A941",
        toAddress: "0xEE36eaaD94d1Cc1d0eccaDb55C38bFfB6Be06C77",
        excludeZeroValue: false,
        order: "desc",
        category: ["external", "erc20", "erc721", "erc1155", "specialnft"],
      });
      // console.log(transactions);
      setSuccess(transactions.transfers.length);
    }
    fetch();
  }, [alchemy]);
  return (
    <div className="flex flex-col items-center justify-center space-y-4">
      <div className="flex justify-center flex-col items-center bg-white rounded-lg mt-2 p-4 w-fit">
        <div className="text-2xl flex flex-col tracking-widest font-semibold items-center md:w-[400px] max-w-[300px] text-center justify-center text-black">
          {success ? (
            <div className="font-extrabold">{success}</div>
          ) : (
            <BiLoaderAlt className="animate-spin" />
          )}
          <div className="">Successfull</div>
          <div>Attestations</div>
          <div className="text-base mt-2">
            Contract Address{" "}
            <span
              onClick={() => {
                navigator.clipboard.writeText(
                  "0xEE36eaaD94d1Cc1d0eccaDb55C38bFfB6Be06C77"
                );
              }}
              className="flex hover:text-gray-500 cursor-pointer justify-center items-center"
            >
              0xEE36e....Be06C77 <MdContentCopy className="m-1" />
            </span>
          </div>
        </div>
      </div>
      <div className="flex justify-center flex-col items-center bg-white rounded-lg mt-2 p-4 w-fit">
        <div className="text-2xl space-y-1 flex flex-col tracking-widest font-semibold items-center md:w-[400px] max-w-[300px] text-center justify-center text-black">
          <div className="">What are Attestations?</div>
          <div>Why Attestations?</div>
          <div>How to use the Explorer?</div>
        </div>
      </div>
    </div>
  );
};

export default Attests;
