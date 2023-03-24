import React, { useEffect, useState } from "react";
import { useContract, useSigner } from "wagmi";
import abi from "../abi/ABI.json";
import { ethers } from "ethers";
import { BiLoaderAlt } from "react-icons/bi";

const methodID = "0x702b9dee";

const Attest = () => {  
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
  const [value, setValue] = useState("");
  const [isValidValue, setIsValidValue] = useState(false);
  const [error, setError] = useState("");
  const handleSubmit = async (e) => {
    setLoad(true);
    e.preventDefault();
    if (!isValidAbout || !isValidKey) {
      setError("Fill out all the details.");
      console.log(isValidAbout, isValidKey);
      setLoad(false);
      return;
    }
    try {      
      const bytes32hex = ethers.utils.formatBytes32String(key);
      console.log(bytes32hex);
      const val = ethers.utils.toUtf8Bytes(value);
      console.log('Sending data to contract');
      const res = await contract.attest([
        { about: about, key: bytes32hex, val: ethers.utils.hexlify(val) },
      ]);
      res.wait(1);
      console.log(res);
    } catch (e) {
      console.log(e);
      setError("Rejected");
    }
    setLoad(false);
  };
  return (
    <div className="flex items-center justify-center ">
      <div className="flex justify-center flex-col items-center bg-white rounded-lg mt-2 p-4 w-fit">
        <div className="text-2xl">Attest Now</div>
        <form className="flex flex-col w-full ">
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
            <span className="m-2 text-xl w-[60px] overflow-hidden text-center">
              Value
            </span>
            <input
              className="p-2 focus:outline-gray-200"
              placeholder="String (Bytes)"
              value={value}
              onChange={(e) => {
                setValue(e.target.value);
                setError("");
              }}
            />
          </label>
          <button
            onClick={handleSubmit}
            className="text-xl bg-cyan-600 rounded p-2 text-white hover:opacity-80"
            type="submit"
          >
            {load ? <BiLoaderAlt className="animate-spin m-auto" /> : "Submit"}
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

export default Attest;
