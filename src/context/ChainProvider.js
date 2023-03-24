import { useState } from "react";
import { createContext } from "react";
import { Alchemy, Network } from "alchemy-sdk";
const ChainContext = createContext({});

export const ChainProvider = ({ children }) => {
  const [settings, setSettings] = useState({
    apiKey: process.env.OPT_GOERLI,
    network: Network.OPT_GOERLI,
  });
  const [alchemy, setAlchemy] = useState(new Alchemy(settings));
  const [chain, setChain] = useState({
    name: "Optimism Goerli",
    setting: {
      apiKey: process.env.OPT_GOERLI,
      network: Network.OPT_GOERLI,
    },
    chainId: 420,
    explorer: 'https://goerli-optimism.etherscan.io/tx/'
  });
  const chains = [
    {
      name: "Optimism Goerli",
      setting: {
        apiKey: process.env.OPT_GOERLI,
        network: Network.OPT_GOERLI,
      },
      chainId: 420,
      explorer: 'https://goerli-optimism.etherscan.io/tx/'
    },
    {
      name: "Optimism Mainnet",
      setting: {
        apiKey: process.env.OPT,
        network: Network.OPT_MAINNET,
      },
      chainId: 10,
      explorer: 'https://optimistic.etherscan.io/tx/'
    },
  ];

  return (
    <ChainContext.Provider
      value={{
        chain,
        setChain,
        chains,
        alchemy,
        // settings,
        // setSettings,
        setAlchemy,
      }}
    >
      {children}
    </ChainContext.Provider>
  );
};

export default ChainContext;
