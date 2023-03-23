import React, { useEffect, useState } from "react";
import axios from "axios";
import { ethers } from "ethers";
import { useRouter } from "next/router";

const querying = () => {
  // const sdk = getBuiltGraphSDK();
  const { query } = useRouter();
  console.log(query);
  const [attestations, setAttestations] = useState([]);

  const [val, setVal] = useState("");
  const [key, setKey] = useState("");
  const [about, setAbout] = useState("");
  const [creator, setCreator] = useState("");
  // const key = ethers.utils.formatBytes32String("hello-world");
  useEffect(() => {
    async function fetch() {
      setKey(query?.key ?? null);
      setVal(query?.value ?? null);
      setCreator(query?.creator ?? null);
      setAbout(query?.about ?? null);
      let query1 = `query TrialQuery{            
      attestationCreateds(first: 10, where:{`;
      if (query.key) query1 += `key:"${query.key}",`;
      if (query.about) query1 += `about:"${query.about}",`;
      if (query.creator) query1 += `creator:"${query.creator}",`;
      if (query.value) query1 += `val:"${query.value}",`;
      query1 += `}) {            
        creator
        about
        key
        blockTimestamp
        transactionHash
        val
      }
    }`;
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
          };
          setAttestations((prev) => [...prev, det]);
        }
      } catch (e) {
        console.log(e);
      }
    }
    if (query.key || query.value || query.creator || query.about) fetch();
  }, [query]);
  console.log(attestations);
  return (
    <div className="mt-5">
      <div className="">
        <div className=""></div>
        <div className="p-2 text-xl font-semibold tracking-wider mx-auto w-fit">
          Found {attestations.length} matches
        </div>
        <div className="flex flex-col p-2 space-y-8">
          {attestations?.map((details) => {
            return (
              <div className="bg-white p-2 rounded-lg ">
                <div>Creator: {details.creator}</div>
                <div>About: {details.about}</div>
                <div>Key: {details.key}</div>
                <div>Val: {details.val}</div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default querying;
