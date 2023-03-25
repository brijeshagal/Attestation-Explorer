import { useEffect, useState } from "react";
import {
  useAccount,
  useConnect,
  useDisconnect,
  useNetwork,
  useSwitchNetwork,
} from "wagmi";
import { MdContentCopy } from "react-icons/md";
// import metamaskIcon from "../../public/metamask-icon.svg";
export function Profile() {
  const [showConnectors, setShowConnectors] = useState(false);
  const { address, isConnected } = useAccount();
  const { connect, connector, connectors, error, isLoading, pendingConnector } =
    useConnect();

  if (isConnected) {
    return (
      <div>
        <div
          className="flex cursor-pointer hover:text-gray-300 text-white"
          onClick={() => {
            navigator.clipboard.writeText(address);
          }}
        >
          {address.substring(0, 6) + "..." + address.substring(38)}
          <MdContentCopy className="my-auto mx-2 text-lg" />
        </div>
        {/* <button onClick={disconnect}>Disconnect</button> */}
        {/* {chains.map((x) => (
          <button
            disabled={!switchNetwork || x.id === chain?.id}
            key={x.id}
            onClick={() => switchNetwork?.(x.id)}
          >
            {x.name}
            {isLoading && pendingChainId === x.id && " (switching)"}
          </button>
        ))} */}
      </div>
    );
  }
  if (showConnectors) {
    return (
      <div className="fixed m-auto flex flex-col top-0 items-center justify-center space-y-3 left-0 right-0 bottom-0 h-[200px] bg-white rounded w-[400px] shadow-md shadow-black">
        {connectors?.map((connector) => (
          <div
            disabled={!connector.ready}
            key={connector.id}
            onClick={() => {
              connect({ connector });
              setShowConnectors(false);
            }}
            className="p-2 rounded border cursor-pointer text-black border-black w-11/12 hover:scale-[1.01] duration-75 transition-all"
          >
            {connector.name}
            {/* {connector.name === 'Metamask'?<><img src='./></img></>:<></>} */}
            {!connector.ready && " (unsupported)"}
            {isLoading &&
              connector.id === pendingConnector?.id &&
              " (connecting)"}
          </div>
        ))}
        {error && <div>{error.message}</div>}
      </div>
    );
  }
  return (
    <button
      onClick={() => setShowConnectors(true)}
      className="bg-gray-200 text-black p-2 rounded "
    >
      Connect Wallet
    </button>
  );
}
export default Profile;
