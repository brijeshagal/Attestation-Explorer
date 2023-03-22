import { useEffect } from "react";
import { useAccount, useConnect } from "wagmi";
import { InjectedConnector } from "wagmi/connectors/injected";

function Profile() {
  const { address, isConnected } = useAccount();  
  const { connect } = useConnect({
    connector: new InjectedConnector(),
  });
  useEffect(() => {
    return () => {};
  }, []);
  
    if (isConnected) return <div>{address.substring(0,7)+'...'+address.substring(39)}</div>;
    return <button onClick={() => connect()}>Connect Wallet</button>;  
}
export default Profile;
