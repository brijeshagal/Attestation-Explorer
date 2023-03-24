import { useEffect, useState } from "react";
import {
  useAccount,
  useConnect,
  useDisconnect,
  useNetwork,
  useSwitchNetwork,
} from "wagmi";

export function Profile() {
  const [showConnectors, setShowConnectors] = useState(false);
  const { chain } = useNetwork();
  const { address, isConnected } = useAccount();
  const { connect, connector, connectors, error, isLoading, pendingConnector } =
    useConnect();
  const { disconnect } = useDisconnect();
  const { chains, error: switchError, isLoading: switchLoading, pendingChainId, switchNetwork } = useSwitchNetwork();
  useEffect(() => {
    if(connector?.name)
      setShowConnectors(false);
  }, [connector])
  console.log(pendingChainId);
  console.log('Loader: ',switchLoading);
  console.log('Err', switchError)
  console.log(chain?.id);
  if (isConnected) {
    return (
      <div>
        <div>{address}</div>
        {/* <button onClick={disconnect}>Disconnect</button> */}
        {chains.map((x) => (
          <button
            disabled={!switchNetwork || x.id === chain?.id}
            key={x.id}
            onClick={() => switchNetwork?.(x.id)}
          >
            {x.name}
            {isLoading && pendingChainId === x.id && " (switching)"}
          </button>
        ))}
      </div>
    );
  }
  if (showConnectors)
    return (
      <div>
        {connectors?.map((connector) => (
          <button
            disabled={!connector.ready}
            key={connector.id}
            onClick={() => connect({ connector })}
          >
            {connector.name}
            {!connector.ready && " (unsupported)"}
            {isLoading &&
              connector.id === pendingConnector?.id &&
              " (connecting)"}
          </button>
        ))}
        {error && <div>{error.message}</div>}
      </div>
    );
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
