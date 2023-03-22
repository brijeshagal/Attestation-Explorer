import { ChainProvider } from "@/context/ChainProvider";
import "@/styles/globals.css";
import { WagmiConfig, createClient, configureChains, mainnet } from "wagmi";
// import { publicProvider } from "wagmi/providers/public";
import { alchemyProvider } from "wagmi/providers/alchemy";
import { optimismGoerli } from "wagmi/chains";
import { InjectedConnector } from "wagmi/connectors/injected";
import { WalletConnectConnector } from "wagmi/connectors/walletConnect";
import { AlchemyProvider } from "@/context/AlchemyProvider";
import Navbar from "@/components/Navbar";

const { chains, provider } = configureChains(
  [optimismGoerli, mainnet],
  [alchemyProvider({ apiKey: process.env.OPT_GOERLI })]
);

const client = createClient({
  autoConnect: true,
  connectors: [new InjectedConnector({ chains })],
  provider,
});
export default function App({ Component, pageProps }) {
  return (
    <WagmiConfig client={client}>
      <AlchemyProvider>
        <ChainProvider>
          <div className="min-h-screen bg-gray-200">
            <Navbar />
            <Component {...pageProps} />
          </div>
        </ChainProvider>
      </AlchemyProvider>
    </WagmiConfig>
  );
}
