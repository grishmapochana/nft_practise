import "../styles/globals.css";
import Link from "next/link";
import { useEffect, useState } from "react";
import { shortenAddress } from "../utils/index";

function MyApp({ Component, pageProps }) {
  const [account, setAccount] = useState(null);
  useEffect(() => {
    connectWallet();
  }, []);

  const connectWallet = async () => {
    console.log("Calling connectWallet");
    if (window.ethereum) {
      const wallet = await window.ethereum.request({
        method: "eth_requestAccounts",
      });
      setAccount(wallet[0]);
      const chainId = 97;

      if (window.ethereum.networkVersion !== chainId) {
        try {
          const s_h = await window.ethereum.request({
            method: "wallet_switchEthereumChain",
            params: [{ chainId: ethers.utils.hexlify(chainId) }],
          });
        } catch (err) {
          if (err.code === 4902) {
            await window.ethereum.request({
              method: "wallet_addEthereumChain",
              params: [
                {
                  chainName: "Binance Smart Chain Testnet",
                  chainId: ethers.utils.hexlify(chainId),
                  nativeCurrency: {
                    name: "TBNB",
                    decimals: 18,
                    symbol: "TBNB",
                  },
                  rpcUrls: ["https://data-seed-prebsc-1-s1.binance.org:8545"],
                },
              ],
            });
          }
        }
      }

      // window.ethereum.request({
      //   method: "wallet_addEthereumChain",
      //
      // });
      // console.log({ wallet });
    }
  };
  return (
    <div>
      <nav className="grid grid-cols-3 pt-6 pb-6  ">
        <div>
          <Link href="/">
            <span className="ml-8 navbar-brand logo">NFT</span>
          </Link>
        </div>
        <span></span>
        <div className="ml-2">
          <Link href="/">
            <span className="mr-3 text-gray-500">MarketPlace</span>
          </Link>
          <Link href="/create-nft">
            <span className="mr-3 text-gray-500">Create-Nft</span>
          </Link>
          <Link href="/minted">
            <span className="mr-3 text-gray-500">Minted-Nft</span>
          </Link>

          <Link href="/collection">
            <span className="mr-3 text-gray-500">My-Collection</span>
          </Link>
          {account ? (
            <span className="mr-3 text-gray-500 cursor-pointer hover:text-red-500">
              {shortenAddress(account)}
            </span>
          ) : (
            <span
              className="mr-6 text-gray-500 cursor-pointer hover:text-red-500"
              onClick={connectWallet}
            >
              Connect
            </span>
          )}
        </div>
      </nav>

      <Component {...pageProps} />
    </div>
  );
}

export default MyApp;
