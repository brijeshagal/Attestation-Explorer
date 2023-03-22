import { useContext } from "react";
import AlchemyContext from "../context/AlchemyProvider";
const useAlchemy = () => {
  return useContext(AlchemyContext);
};

export default useAlchemy;
