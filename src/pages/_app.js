import { ChainProvider } from "@/context/ChainProvider";
import "@/styles/globals.css";
import { WagmiConfig, createClient, configureChains, mainnet } from "wagmi";
import { alchemyProvider } from "wagmi/providers/alchemy";
import { optimism, optimismGoerli } from "wagmi/chains";
import { CoinbaseWalletConnector } from "wagmi/connectors/coinbaseWallet";
import { InjectedConnector } from "wagmi/connectors/injected";
import { MetaMaskConnector } from "wagmi/connectors/metaMask";
import { jsonRpcProvider } from "wagmi/providers/jsonRpc";
import { Analytics } from "@vercel/analytics/react";
import Navbar from "@/components/Navbar";

// Scroll Alphatestnet Deployed DestinationAttestationStation at -> 0x9A631b00c5E7f134CFcec4d2b5acF90E35cBb9a4
// Polygon Mumbai Testnet: 0xd43CfC3B6DB871d6960124bC653946C1765cCD18
const scrollAlphaTestnet = {
  id: 534353,
  name: "Scroll Alpha Testnet",
  network: "scroll",
  nativeCurrency: {
    decimals: 18,
    name: "SCroll Alpha Testnet",
    symbol: "ETH",
  },
  rpcUrls: {
    default: "https://alpha-rpc.scroll.io/l2",
  },
  blockExplorers: {
    default: {
      name: "Scroll Alpha Testnet Testnet",
      url: "https://blockscout.scroll.io",
    },
  },
  testnet: true,
};

const { chains, provider } = configureChains(
  [optimismGoerli, optimism],
  [
    alchemyProvider({ apiKey: process.env.NEXT_PUBLIC_OPT_GOERLI }),
    alchemyProvider({ apiKey: process.env.NEXT_PUBLIC_OPT }),
    jsonRpcProvider({
      rpc: (chain) => {
        if (chain.id === scrollAlphaTestnet.id)
          return { http: chain.rpcUrls.default };
        return { http: "https://rpc-mumbai.maticvigil.com" };
      },
    }),
  ]
);

const client = createClient({
  autoConnect: true,
  connectors: [
    new MetaMaskConnector({ chains }),
    new CoinbaseWalletConnector({
      chains,
    }),
    new InjectedConnector({
      chains,
      options: {
        name: "Injected Connector",
      },
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
