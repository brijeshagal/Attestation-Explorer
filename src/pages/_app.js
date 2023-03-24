import { ChainProvider } from "@/context/ChainProvider";
import "@/styles/globals.css";
import { WagmiConfig, createClient, configureChains, mainnet } from "wagmi";
import { alchemyProvider } from "wagmi/providers/alchemy";
import { optimism, optimismGoerli } from "wagmi/chains";
import { CoinbaseWalletConnector } from "wagmi/connectors/coinbaseWallet";
import { InjectedConnector } from "wagmi/connectors/injected";
import { MetaMaskConnector } from "wagmi/connectors/metaMask";
import { WalletConnectConnector } from "wagmi/connectors/walletConnect";
import { Analytics } from '@vercel/analytics/react';
import Navbar from "@/components/Navbar";

const { chains, provider } = configureChains(
  [optimismGoerli, optimism],
  [alchemyProvider({ apiKey: process.env.OPT_GOERLI }), alchemyProvider({apiKey: process.env.OPT})]
);

const client = createClient({
  autoConnect:true,
  connectors: [
    new MetaMaskConnector({ chains }),
    new CoinbaseWalletConnector({
      chains,
    }),
    new InjectedConnector({
      chains,
      options: {
        name: "Injected Connector"
      }
    }),
  ],
  provider,  
});
export default function App({ Component, pageProps }) {
  return (
    <WagmiConfig client={client}>      
        <ChainProvider>
          <div className="min-h-screen bg-gray-200">
            <Navbar />
            <Component {...pageProps} />
            <Analytics />
          </div>
        </ChainProvider>      
    </WagmiConfig>
  );
}
