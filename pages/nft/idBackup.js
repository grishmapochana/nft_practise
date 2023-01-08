import React from "react";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { ethers } from "ethers";
import axios from "axios";
import { nftaddress, nftMarketAddress } from "../../config";
import NFTabi from "../../vabi/nftabi.json";
import NFTMarketplaceabi from "../../vabi/nftmarketabi.json";
import { nftMarketplaceContractInstance, shortenAddress } from "../../utils";

export default function Nft() {
  const router = useRouter();
  const id = router.query.id;
  const [nfts, setNfts] = useState([]);
  const [account, setAccount] = useState(null);
  const [buy, setBuy] = useState(true);

  useEffect(() => {
    loadSingleNFT();
  }, [id]);

  const formatNFTData = async (data, nftContract) => {
    const tokenUri = await nftContract.tokenURI(parseInt(data.token));
    // console.log({ data });
    // console.log({ tokenUri });
    const meta = await axios.get(tokenUri);
    // console.log({ meta });
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
    return formattedData;
  };

  const loadSingleNFT = async () => {
    // console.log("LoadNFTs");
    try {
      if (window.ethereum) {
        const account = await window.ethereum.request({
          method: "eth_requestAccounts",
        });
        setAccount(account[0]);
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        const marketInstance = await nftMarketplaceContractInstance();
        const contract = new ethers.Contract(
          nftMarketAddress,
          NFTMarketplaceabi,
          signer
        );
        console.log({ marketInstance, contract });
        const nftContractInstance = new ethers.Contract(
          nftaddress,
          NFTabi,
          provider
        );

        let data = await marketInstance.Items(id);
        try {
          const formattedNFTList = await formatNFTData(
            data,
            nftContractInstance
          );
          // console.log({ formattedNFTList });
          setNfts(formattedNFTList);

          if (account[0].toLowerCase() === data.creator.toLowerCase()) {
            setBuy(false);
          }
        } catch (e) {
          console.log(e);
        }
      }
    } catch (e) {
      console.log(e.message);
    }
  };
  const buyNFT = async () => {
    try {
      if (window.ethereum) {
        const a = await window.ethereum.request({
          method: "eth_requestAccounts",
        });

        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        const contract = new ethers.Contract(
          nftMarketAddress,
          NFTMarketplaceabi,
          signer
        );

        let data = await contract.Items(1);
        // console.log(parseInt(data.token));
        // console.log(data.price.toString());

        var res = await contract.buyItem(parseInt(data.token), {
          value: data.price,
          from: a[0],
        });
        // console.log(res);
        const receipt = await res.wait();
        // console.log(receipt);
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  return (
    <div className="bg-gray-100 py-10 h-screen ">
      <div className=" m-auto max-w-5xl shadow-indigo-100 border border-indigo-200 shadow-lg ">
        <div className="grid grid-cols-2  ">
          <div>
            <img src={nfts.image} className="w-full h-full  " />
          </div>
          <div className="my-2 px-2">
            <p className="font-semibold my-3">
              <span className="font-bold">owned by:</span>{" "}
              {shortenAddress(nfts.owner)}
            </p>
            <p className="my-8">
              <span className="font-bold">Description: </span>
              {nfts.desc}
            </p>
            <div>
              <p className="font-bold">Attributes:</p>
              <div className="flex flex-row my-4">
                {nfts.attributes &&
                  nfts.attributes.map((item, index) => (
                    <div
                      className="bg-blue-100  text-center border border-blue-300 mx-2 rounded px-2 py-2 "
                      key={index}
                    >
                      <span className="text-blue-500">{item.trait_type}</span>
                      <p>{item.value}</p>
                    </div>
                  ))}
              </div>
            </div>
            <div className="flex flex-row">
              <span className="font-bold">Price: </span>
              <div className="mx-1">
                <img
                  className="w-5 h-7"
                  src="https://w7.pngwing.com/pngs/601/515/png-transparent-ethereum-cryptocurrency-blockchain-logo-neo-coin-stack-angle-triangle-logo-thumbnail.png"
                  alt="eth"
                />
              </div>
              <span> {nfts.price}</span>
            </div>
            <div className="text-center">
              {buy && (
                <button
                  className="bg-indigo-200 rounded px-4 py-2"
                  onClick={buyNFT}
                >
                  Buy
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
