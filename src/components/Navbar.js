import useChain from "@/hooks/useChain";
import React from "react";
import dynamic from "next/dynamic";
import { AiOutlineDown } from "react-icons/ai";
import Link from "next/link.js";
import useAlchemy from "@/hooks/useAlchemy.js";
import { Alchemy, Network } from "alchemy-sdk";

const Profile = dynamic(() => import("./Profile.jsx"), {
  ssr: false,
});

const Navbar = () => {
  const { chains, chain, setChain } = useChain();
  const { setSettings, setAlchemy } = useAlchemy();
  return (
    <nav className="flex justify-between p-3 bg-cyan-600 h-[70px] items-center">
      <Link
        className="text-lg ml-5 font-bold tracking-widest text-white"
        href={"/"}
      >
        Attestation Explorer
      </Link>
      <div className="flex space-x-5">
        <div className="flex justify-center items-center text-white">
          {/* <Profile /> */}
        </div>
        <div className="group">
          <div className="flex cursor-pointer text-white w-[100px]">
            {chains[chain]}
            <AiOutlineDown className="my-auto mx-auto text-lg" />
          </div>
          <div className="hidden group-hover:block absolute bg-white cursor-pointer w-[200px]">
            {chains.map((net, idx) => {
              if (net !== chains[chain])
                return (
                  <div
                    key={idx}
                    onClick={() => {
                      setChain(idx);
                      const newSetting = {
                        apiKey: process.env.OPT,
                        network: Network.OPT_MAINNET,
                      };
                      setSettings(newSetting);
                      const alch = new Alchemy(newSetting);
                      setAlchemy(alch);
                    }}
                    className="p-2"
                  >
                    {net}
                  </div>
                );
            })}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
