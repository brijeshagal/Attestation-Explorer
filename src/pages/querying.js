import React, { useEffect, useState } from "react";
import axios from "axios";
import { ethers } from "ethers";

const querying = () => {
  // const sdk = getBuiltGraphSDK();
  const [attestations, setAttestations] = useState([]);
  const [value, setValue] = useState();
  const key = ethers.utils.formatBytes32String("hello-world");
  useEffect(() => {
    // const id = process.env.DEPLOY_ID;
    async function fetch() {
      // console.log(key);
      const query = `query TrialQuery{            
          attestationCreateds(first: 5, where:{key:"${key}"}) {            
            creator
            about
            key
            blockTimestamp
            transactionHash
            val
          }
        }`;
      const res = await axios.post(
        `https://api.studio.thegraph.com/query/44262/index/0.0.1`,
        {
          query: query,
        }
      );
      console.log(res.data.data.attestationCreateds);

      for (let attest of res.data.data.attestationCreateds) {
        const key = ethers.utils.parseBytes32String(attest.key);
        // const hex = ethers.utils.hexlify(attest.val);
        const bytes = ethers.utils.arrayify(attest.val);
        // console.log(bytes)
        // const val = ethers.utils.toUtf8String(bytes);
        const val = new TextDecoder().decode(bytes);
        console.log(val);
        const details = {
          key: key,
          val: val,
          creator: attest.creator,
          about: attest.creator,
          hash: attest.transactionHash,
        };
        setAttestations((prev) => [...prev, details]);
      }
      //res.data.data.attestationCreateds is array.
    }
    // fetch();
  }, [key]);
  console.log(attestations);
  return (
    <div className="mt-5">
      <div className="">
        <div className=""></div>
        <div className="p-2 text-xl font-semibold tracking-wider mx-auto">Found {attestations.length} matches</div>
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
