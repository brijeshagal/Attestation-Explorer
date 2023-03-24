import React, { useEffect, useState } from "react";
import {
  useContract,
  useNetwork,
  useProvider,
  useSigner,
  useSwitchNetwork,
} from "wagmi";
import abi from "../abi/ABI.json";
import { ethers } from "ethers";
import { BiLoaderAlt } from "react-icons/bi";
import Router from "next/router";
import useChain from "@/hooks/useChain";

// const methodID = "0x702b9dee";

const Search = () => {
  const { alchemy } = useChain();
  const { data: signer, isError, isLoading } = useSigner();
  const [load, setLoad] = useState(false);
  const contract = useContract({
    address: "0xEE36eaaD94d1Cc1d0eccaDb55C38bFfB6Be06C77",
    abi: abi,
    signerOrProvider: signer,
  });
  const [about, setAbout] = useState("");
  const [isValidAbout, setIsValidAbout] = useState(false);
  const [key, setKey] = useState("");
  const [isValidKey, setIsValidKey] = useState(false);
  const [creator, setCreator] = useState("");
  const [value, setValue] = useState("");
  const [isValidCreator, setIsValidCreator] = useState(false);
  const [error, setError] = useState("");
  async function sendProps(e) {
    e.preventDefault();
    setLoad(true);
    try {
      let bytes32hex;
      if (key) bytes32hex = ethers.utils.formatBytes32String(key);
      let val;
      if (value) {
        const bytes = ethers.utils.toUtf8Bytes(value);
        val = ethers.utils.hexlify(bytes);
      }
      Router.push({
        pathname: "/querying",
        query: {
          key: bytes32hex ?? "",
          about: about ?? "",
          value: val ?? "",
          creator: creator ?? "",
        },
      });
      // const res = await contract.attestations([
      //   { about: about, creator: creator, key: bytes32hex },
      // ]);
      // res.wait(1);
      // console.log(res);
    } catch (e) {
      console.log(e);
      setError("Rejected");
    }
    setLoad(false);
  }
  return (
    <div className="flex items-center justify-center ">
      <div className="flex justify-center flex-col items-center bg-white rounded-lg p-4 w-fit">
        <div className="text-2xl">Search Attestation</div>
        <form className="flex w-full items-center ">
          <label className="p-2 m-2 w-full flex justify-center items-center">
            <span className="m-2 text-xl w-[75px] overflow-hidden text-center">
              Creator
            </span>
            <input
              className="p-2 focus:outline-gray-200"
              placeholder="Address"
              value={creator}
              onChange={(e) => {
                setCreator(e.target.value);
                setError("");
              }}
            />
          </label>
          <label className="p-2 m-2 w-full flex justify-center items-center">
            <span className="m-2 text-xl w-[60px] overflow-hidden">About</span>
            <input
              className="p-2 focus:outline-gray-200"
              placeholder="Address"
              value={about}
              onChange={(e) => {
                const abt = e.target.value;
                setAbout(abt);
                const valid = ethers.utils.isAddress(abt);
                setIsValidAbout(valid);
                setError("");
              }}
            />
          </label>
          <label className="p-2 m-2 w-full flex justify-center items-center">
            <span className="m-2 text-xl w-[60px] ">Key</span>
            <input
              className="p-2 focus:outline-gray-200"
              placeholder="Max 32 Characters"
              value={key}
              onChange={(e) => {
                const ke = e.target.value;
                setKey(ke);
                const valid = ke.length < 32;
                setIsValidKey(valid);
                setError("");
              }}
            />
          </label>
          <label className="p-2 m-2 w-full flex justify-center items-center">
            <span className="m-2 text-xl w-[60px] ">Value</span>
            <input
              className="p-2 focus:outline-gray-200"
              placeholder="Max 32 Characters"
              value={value}
              onChange={(e) => {
                const v = e.target.value;
                setValue(v);
                // setIsValidValue(valid);
                setError("");
              }}
            />
          </label>
          <button
            onClick={sendProps}
            className="text-xl h-fit bg-cyan-600 rounded p-2 text-white hover:opacity-80"
            type="submit"
          >
            {load ? <BiLoaderAlt className="animate-spin m-auto" /> : "Search"}
          </button>
          {error.length > 0 ? (
            <div className="p-2 text-center w-fit mx-auto text-red-600 text-sm">
              {error}
            </div>
          ) : (
            <></>
          )}
        </form>
      </div>
    </div>
  );
};

export default Search;
