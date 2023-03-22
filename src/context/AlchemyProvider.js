import { Alchemy, Network } from "alchemy-sdk";
import { createContext, useEffect, useState } from "react";

const AlchemyContext = createContext({});

export const AlchemyProvider = ({ children }) => {
  const [settings, setSettings] = useState({
    apiKey: process.env.OPT_GOERLI,
    network: Network.OPT_GOERLI,
  });
  const [alchemy, setAlchemy] = useState(new Alchemy(settings));
  // useEffect(() => {
  //   setAlchemy(new Alchemy(settings));
  // }, [settings]);
  return (
    <AlchemyContext.Provider value={{ alchemy, settings, setSettings, setAlchemy }}>
      {children}
    </AlchemyContext.Provider>
  );
};

export default AlchemyContext;
