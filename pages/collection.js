import React from "react";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { ethers } from "ethers";
import axios from "axios";
import { nftaddress, nftMarketAddress } from "../config";
import NFTabi from "../vabi/nftabi.json";
import NFTMarketplaceabi from "../vabi/nftmarketabi.json";

export default function collection() {
  useEffect(() => {
    getMyNft();
  }, []);
  const [nft, setNft] = useState([]);

  const formatNFTData = async (data, nftContract) => {
    // console.log({ nftContract });
    // console.log(data[0].creator);
    // console.log({ data });
    const tokenUri = await nftContract.tokenURI(parseInt(data.token));

    // console.log({ tokenUri });
    const meta = await axios.get(tokenUri);

    const formattedData = {
      name: meta.data.name,
      image: "https://coretek-nft.infura-ipfs.io/ipfs/" + meta.data.image,
      desc: meta.data.description,
      price: ethers.utils.formatEther(data.price),
      token: data.token.toString(),
      owner: data.owner,
      creator: data.creator,
      attributes: meta.data.attributes,
    };
    // console.log({ formattedData });
    return formattedData;
  };

  const getMyNft = async () => {
    try {
      if (window.ethereum) {
        const account = await window.ethereum.request({
          method: "eth_requestAccounts",
        });
        // console.log(window.ethereum);
        // console.log(account[0]);
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        const contract = new ethers.Contract(
          nftMarketAddress,
          NFTMarketplaceabi,
          signer
        );

        const nftcontract = new ethers.Contract(nftaddress, NFTabi, signer);
        const data = await contract.fetchOwnerItemsListed({ from: account[0] });
        if (!data) throw new Error("data is undefined");
        // console.log({ data });
        //   console.log(res);
        const formattedNFTList = await Promise.all(
          data.map((nft) => {
            // console.log({ nft });
            var res = formatNFTData(nft, nftcontract);
            return res;
          })
        );
        setNft(formattedNFTList);
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="grid grid-cols-4 mt-2 ml-4">
      {nft &&
        nft.map((item, index) => {
          console.log(item);
          return (
            item && (
              <div
                key={index}
                className="max-w-xs text-center rounded overflow-hidden mt-2 shadow-lg"
              >
                <img src={item.image} className="w-full" alt="" />
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
            )
          );
        })}
    </div>
  );
}
