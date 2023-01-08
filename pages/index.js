import React, { useEffect, useState } from "react";
import { ethers } from "ethers";
import axios from "axios";
import { nftaddress, nftMarketAddress } from "../config";
import NFTabi from "../vabi/nftabi.json";
import NFTMarketplaceabi from "../vabi/nftmarketabi.json";
import Link from "next/link";

function Home() {
  const [nfts, setNfts] = useState([]);
  // const [loadingState, setLoadingState] = useState("not-loaded");

  useEffect(() => {
    loadNFTs();
  }, []);

  const formatNFTData = async (data, nftContract) => {
    const tokenUri = await nftContract.tokenURI(parseInt(data.token));

    const meta = await axios.get(tokenUri);

    const formattedData = {
      name: meta.data.name,
      image: "https://coretek-nft.infura-ipfs.io/ipfs/" + meta.data.image,
      desc: meta.data.description,
      price: ethers.utils.formatEther(data.price),
      token: data.token.toString(),
      creator: data.creator,
      attributes: meta.data.attributes,
    };
    return formattedData;
  };

  const loadNFTs = async () => {
    try {
      if (window.ethereum) {
        await window.ethereum.request({
          method: "eth_requestAccounts",
        });
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        console.log({ provider });
        const signer = provider.getSigner();
        console.log({ signer });
        const contract = new ethers.Contract(
          nftMarketAddress,
          NFTMarketplaceabi,
          signer
        );

        const nftContractInstance = new ethers.Contract(
          nftaddress,
          NFTabi,
          provider
        );
        // console.log("Hi");
        console.log({ contract });
        console.log("Calling fetchMarketItems");
        let data = await contract.fetchMarketItems();
        if (!data) throw new Error("data is undefined");

        console.log("Done calling fetchMarketItems");
        console.log({ data });

        const formattedNFTList = await Promise.all(
          data.map((nft) => {
            // console.log({ nft });
            var res = formatNFTData(nft, nftContractInstance);
            return res;
          })
        );

        console.log({ formattedNFTList });
        setNfts(formattedNFTList);
      }
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <div className="bg-gray-100   mt-4  p-4">
      <div className="grid grid-cols-4 mt-2  ">
        {nfts.map(
          (item, index) =>
            item && (
              <Link href={`/nft/${item.token}`} key={index}>
                <div className="max-w-xs text-center rounded overflow-hidden mt-2 mr-3 shadow-lg">
                  <img
                    src={item.image}
                    className="h-80 w-full object-cover object-center"
                    alt=""
                  />
                  <div className="px-6 py-4 text-center">
                    <div className="font-bold text-xl mb-2">{item.name}</div>
                    <div className="flex flex-row justify-center">
                      <span className="font-bold mr-1">Price: </span>
                      <span className="mr-1">
                        <img
                          className="w-5 h-7"
                          src="https://w7.pngwing.com/pngs/601/515/png-transparent-ethereum-cryptocurrency-blockchain-logo-neo-coin-stack-angle-triangle-logo-thumbnail.png"
                          alt="eth"
                        />
                      </span>
                      <span> {item.price}</span>
                    </div>
                  </div>
                </div>
              </Link>
            )
        )}
      </div>
    </div>
  );
}

export default Home;
