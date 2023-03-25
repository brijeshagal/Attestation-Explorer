import useChain from "@/hooks/useChain";
import React, { useState } from "react";
import dynamic from "next/dynamic";
import { AiOutlineDown } from "react-icons/ai";
import Link from "next/link.js";
import { Alchemy, Network } from "alchemy-sdk";
import { useDisconnect, useNetwork, useSwitchNetwork } from "wagmi";

const Profile = dynamic(() => import("./Profile.jsx"), {
  ssr: false,
});

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const { chains, chain, setChain, setSettings, setAlchemy } = useChain();

  const { disconnect } = useDisconnect();
  const { chain: currentChain } = useNetwork();
  const {
    chains: networkChains,
    error: switchError,
    isLoading: switchLoading,
    pendingChainId,
    switchNetwork,
  } = useSwitchNetwork();
  const network = useSwitchNetwork({
    chainId: chain.chainId,
  });

  return (
    <nav className="flex flex-wrap justify-between p-3 bg-cyan-600 items-center">
      <Link
        className="text-lg ml-5 font-bold tracking-widest text-white"
        href={"/"}
      >
        Attestation Explorer
      </Link>
      <div className="flex space-x-5">
        <div className=" relative flex space-x-3">
          <div
            onClick={() => setOpen(!open)}
            className="flex items-center peer cursor-pointer text-white"
          >
            {chain.name}
            <AiOutlineDown className="my-auto mx-2 text-lg" />
            {open ? (
              <div className="absolute bg-white rounded text-black top-[50px] left-0 cursor-pointer w-[150px]">
                {chains.map((net, idx) => {
                  if (net.chainId !== chain.chainId)
                    return (
                      <div
                        key={idx}
                        onClick={async () => {                          
                          network?.switchNetwork(net.chainId);
                          setChain(net);
                          const alch = new Alchemy(net.setting);
                          setAlchemy(alch);
                          setOpen(false);
                        }}
                        className="p-2 rounded"
                      >
                        {net.name}
                      </div>
                    );
                })}
              </div>
            ) : (
              <></>
            )}
          </div>
          <div className="flex justify-center items-center text-white">
            <Profile />
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
