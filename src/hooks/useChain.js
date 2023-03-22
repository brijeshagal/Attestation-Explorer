import { useContext } from "react";
import ChainContext from "../context/ChainProvider";
const useChain = () => {
  return useContext(ChainContext);
}

export default useChain;