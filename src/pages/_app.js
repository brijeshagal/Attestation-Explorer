import { ChainProvider } from "@/context/ChainProvider";
import "@/styles/globals.css";
import { WagmiConfig, createClient, configureChains, mainnet } from "wagmi";
import { alchemyProvider } from "wagmi/providers/alchemy";
import { optimismGoerli } from "wagmi/chains";
import { CoinbaseWalletConnector } from "wagmi/connectors/coinbaseWallet";
import { InjectedConnector } from "wagmi/connectors/injected";
import { MetaMaskConnector } from "wagmi/connectors/metaMask";
import { WalletConnectConnector } from "wagmi/connectors/walletConnect";
import { AlchemyProvider } from "@/context/AlchemyProvider";
import { Analytics } from '@vercel/analytics/react';
import Navbar from "@/components/Navbar";

const { chains, provider } = configureChains(
  [optimismGoerli],
  [alchemyProvider({ apiKey: process.env.OPT_GOERLI })]
);

const client = createClient({
  connectors: [
    new MetaMaskConnector({ chains }),
    new CoinbaseWalletConnector({
      chains,
    }),
    new InjectedConnector({
      chains,
    }),
  ],
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
            <Analytics />
          </div>
        </ChainProvider>
      </AlchemyProvider>
    </WagmiConfig>
  );
}
