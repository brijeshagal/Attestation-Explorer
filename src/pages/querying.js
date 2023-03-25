import React, { useEffect, useState } from "react";
import axios from "axios";
import { ethers } from "ethers";
import Router from "next/router";
import { useRouter } from "next/router";
import { BiLoaderAlt } from "react-icons/bi";

const querying = () => {
  // const sdk = getBuiltGraphSDK();
  const { query } = useRouter();
  console.log(query);
  const [attestations, setAttestations] = useState([]);
  const [load, setLoad] = useState(false);
  const [value, setValue] = useState("");
  const [key, setKey] = useState("");
  const [isValidKey, setIsValidKey] = useState(false);
  const [about, setAbout] = useState("");
  const [isValidAbout, setIsValidAbout] = useState(false);
  const [creator, setCreator] = useState("");
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
      setAttestations([]);
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
  // const key = ethers.utils.formatBytes32String("hello-world");
  useEffect(() => {
    async function fetch() {
      setLoad(true);
      let temp_key;
      try {
        temp_key = ethers.utils.parseBytes32String(query?.key);
      } catch (e) {
        console.log(e);
        temp_key = query.key;
      }
      let temp_v;
      try {
        const temp_b = ethers.utils.arrayify(query?.val);
        temp_v = new TextDecoder().decode(temp_b);
      } catch (e) {
        console.log(e);
        temp_v = query.val;
      }
      setKey(temp_key ?? "");
      setValue(temp_v ?? "");
      setCreator(query?.creator ?? "");
      setAbout(query?.about ?? "");
      let query1;
      if (
        query?.key?.length === 0 &&
        query?.about?.length === 0 &&
        query?.creator?.length === 0 &&
        query?.value?.length === 0
      ) {
        query1 = `query TrialQuery{            
          attestationCreateds(first: 10) {            
            creator
            about
            key
            blockTimestamp
            transactionHash
            val
          }
        }`;
      } else {
        query1 = `query TrialQuery{            
      attestationCreateds(first: 10, where:{`;
        if (query?.key?.length > 0) query1 += `key:"${query.key}",`;
        if (query?.about?.length > 0) query1 += `about:"${query.about}",`;
        if (query?.creator?.length > 0) query1 += `creator:"${query.creator}",`;
        if (query?.value?.length > 0) query1 += `val:"${query.value}",`;
        query1 += `}) {            
        creator
        about
        key
        blockTimestamp
        transactionHash
        val
      }
    }`;
      }
      console.log(query1);
      try {
        const response = await axios.post(
          "https://api.studio.thegraph.com/query/44262/index/0.0.1",
          { query: query1 }
        );
        console.log(response);
        const res = response.data.data.attestationCreateds;
        for (let details of res) {
          const b = ethers.utils.arrayify(details.val);
          const v = new TextDecoder().decode(b);
          // console.log(details.key);
          let k;
          try {
            k = ethers.utils.parseBytes32String(details.key);
          } catch (e) {
            console.log(e);
            k = details.key;
          }
          const det = {
            about: details.about,
            creator: details.creator,
            key: k,
            val: v,
            hash: details.transactionHash,
            timestamp: details.blockTimestamp,
          };
          setAttestations((prev) => [...prev, det]);
        }
      } catch (e) {
        console.log(e);
      }
      setLoad(false);
    }
    fetch();
  }, [query]);
  return (
    <div className="mt-5">
      <form className="flex flex-wrap mx-auto bg-white rounded-lg w-11/12">
        <label className="p-2 my-2  flex justify-center items-center">
          <span className="m-2 text-xl  overflow-hidden scrollbar-hide text-center">
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
        <label className="p-2 my-2 flex justify-center items-center">
          <span className="m-2 text-xl overflow-hidden scrollbar-hide">About</span>
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
        <label className="p-2 my-2 flex justify-center items-center">
          <span className="m-2 text-xl">Key</span>
          <input
            className="p-2 focus:outline-gray-200"
            placeholder="Max 32 Characters"
            value={key}
            onChange={(e) => {
              const ke = e.target.value;
              setKey(ke);
              const valid = ke?.length < 32;
              setIsValidKey(valid);
              setError("");
            }}
          />
        </label>
        <label className="p-2 my-2 flex justify-center items-center">
          <span className="m-2 text-xl ">Value</span>
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
          className="text-xl bg-cyan-600 rounded p-2 w-fit h-fit my-auto text-white hover:opacity-80"
          type="submit"
        >
          {load ? <BiLoaderAlt className="animate-spin m-auto" /> : "Search"}
        </button>
        {error?.length > 0 ? (
          <div className="p-2 text-center w-fit mx-auto text-red-600 text-sm">
            {error}
          </div>
        ) : (
          <></>
        )}
      </form>
      <div className="w-11/12 mx-auto">
        {!key && !value && !creator && !about ? (
          <div className="p-2 text-xl font-semibold tracking-wider flex mx-auto w-fit">
            Fetched{" "}
            {load ? (
              <BiLoaderAlt className="mx-2 my-auto animate-spin text-lg"></BiLoaderAlt>
            ) : (
              <span className="mx-2 text-lg">{attestations?.length}</span>
            )}{" "}
            latest attestations
          </div>
        ) : (
          <div className="p-2 text-xl font-semibold tracking-wider flex mx-auto w-fit">
            Found{" "}
            {load ? (
              <BiLoaderAlt className="mx-2 my-auto animate-spin text-lg"></BiLoaderAlt>
            ) : (
              <span className="mx-2 text-lg">{attestations?.length}</span>
            )}{" "}
            matches
          </div>
        )}
        <div className="flex flex-col p-2 space-y-8">
          {attestations?.map((details, idx) => {
            return (
              <div
                key={idx}
                className="bg-white hover:scale-[1.05] duration-75 transition-all p-2 rounded-lg "
              >
                <div className="flex items-center ">
                  <div className="text-lg font-semibold w-[70px]">Creator</div>{" "}
                  {details.creator}
                  <div className="ml-auto">Block Timestamp: {details.timestamp}</div>
                </div>
                <div className="flex">
                  <div className="text-lg font-semibold w-[70px]">About</div>{" "}
                  {details.about}
                </div>
                <div className="flex">
                  <div className="text-lg font-semibold w-[70px]">Key</div>{" "}
                  {details.key}
                </div>
                <div className="flex">
                  <div className="text-lg font-semibold w-[70px]">Value</div>{" "}
                  {details.val}
                  <div className="ml-auto">
                    View transaction{" "}
                    <a
                      href={`https://goerli-optimism.etherscan.io/tx/${details.hash}`}
                      className="underline underline-offset-2 text-blue-600 mr-0"
                    >
                      here
                    </a>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default querying;
