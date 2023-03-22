import { useState } from "react";
import { createContext } from "react"

const ChainContext = createContext({});

export const ChainProvider = ({children}) => {
  const [chain, setChain] = useState(0);
  const chains = ['Goerli Optimism', 'Optimism Mainnet'];

  return (
    <ChainContext.Provider value={{chain, setChain, chains}}>
      {children}
    </ChainContext.Provider>
  )
}

export default ChainContext;