import { useState, useRef } from "react";
import { ethers } from "ethers";
import { create as ipfsClient } from "ipfs-http-client";
import { useRouter } from "next/router";
import { Buffer } from "buffer";
import { nftaddress, nftMarketAddress } from "../config";
import NFTMarketplaceabi from "../vabi/nftmarketabi.json";
import {
  ethersToWei,
  nftContractInstance,
  nftMarketplaceContractInstance,
} from "../utils";

const projectId = "2Gd2cSLJcKQlVRGLgfUsfZvLOql";
const projectSecret = "c308473b750eeb731e054852b3b9e877";
const auth =
  "Basic " + Buffer.from(projectId + ":" + projectSecret).toString("base64");

const client = ipfsClient({
  host: "ipfs.infura.io",
  port: 5001,
  protocol: "https",
  headers: {
    authorization: auth,
  },
});

function createNFT() {
  const router = useRouter();
  const formRef = useRef(null);
  const [file, setFile] = useState("");
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [attributes, setAttributes] = useState(null);

  const addAttribute = (e) => {
    e.preventDefault();
    if (attributes) {
      var attr = [
        ...attributes,
        {
          id: attributes.length,
          trait_type: e.target.key.value,
          value: e.target.value.value,
        },
      ];
      setAttributes(attr);
    } else {
      setAttributes([
        {
          id: 0,
          trait_type: e.target.key.value,
          value: e.target.value.value,
        },
      ]);
    }
    formRef.current.reset();
  };

  const removeAttribute = (id) => {
    var filteredAttr = attributes.filter((data) => data.id !== id);
    setAttributes(filteredAttr);
  };
  const uploadImageToIPFS = async () => {
    try {
      if (window.ethereum.networkVersion !== "97") {
        console.log("chainId not matched");
        return;
      }
      if (!name || !description || !price || !file) {
        console.log("please fill all details");
        return;
      }

      const added = await client.add(file);
      //  {
      //   progress: (prog) => console.log(`received: ${prog}`),
      // }

      const url = added.path;
      console.log(url);
      await uploadMetadataToIPFS(url);
    } catch (error) {
      console.log("Error uploading file: ", error);
    }
  };
  const uploadMetadataToIPFS = async (fileUrl) => {
    try {
      if (!name || !description || !price || !fileUrl) return;
      const data = JSON.stringify({
        name: name,
        description: description,
        image: fileUrl,
        attributes: attributes,
      });

      const added = await client.add(data);
      const uri = `https://coretek-nft.infura-ipfs.io/ipfs/${added.path}`;
      await mintNFT(uri);
      console.log(uri);
      return uri;
    } catch (error) {
      console.log("Error uploading file: ", error);
    }
  };
  const mintNFT = async (uri) => {
    try {
      if (window.ethereum) {
        const account = await window.ethereum.request({
          method: "eth_requestAccounts",
        });
       
        const contract = await nftMarketplaceContractInstance();

        const tx = await contract.sellItem(
          uri,
          ethers.utils.parseEther(price).toString(),
          nftaddress,
          {
            from: account[0],
            value: ethers.utils.parseEther("0.0001").toString(),
          }
        );
        const receipt = await tx.wait();
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  return (
    <div className="flex justify-center">
      <div className=" shadow-lg shadow-indigo-100 border rounded m-5 p-8">
        <div className="mb-3">
          <label htmlFor="nftName">NFT Name</label>
          <br></br>
          <input
            type="text"
            className="border border-indigo-200 mt-2 min-w-full  rounded p-2 outline-none"
            id="nftName"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <div className="mb-3">
          <label htmlFor="nftPrice" className="form-label">
            Price
          </label>
          <input
            type="number"
            className="border border-indigo-200 mt-2 min-w-full  rounded p-2 outline-none"
            id="nftPrice"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
          />
        </div>

        <div className="mb-3">
          <label htmlFor="NFTimage" className="form-label">
            Image
          </label>
          <input
            type="file"
            className="border border-indigo-200 mt-2 min-w-full  rounded p-2 outline-none"
            id="NFTimage"
            onChange={(e) => setFile(e.target.files[0])}
          />
        </div>

        <div className="mb-3">
          <label htmlFor="description" className="form-label">
            Description
          </label>
          <textarea
            className="border border-indigo-200 mt-2 min-w-full  rounded p-2 outline-none"
            id="description"
            rows="3"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          ></textarea>
        </div>

        <form onSubmit={(e) => addAttribute(e)} ref={formRef}>
          <div className="mb-3">
            <label htmlFor="attributes" className="form-label">
              Attributes
            </label>
            <div className="d-flex flex-wrap">
              {attributes
                ? attributes.map((attr, i) => {
                    return (
                      <span
                        key={i}
                        className="m-1 badge attr-badge"
                        onClick={() => removeAttribute(attr.id)}
                      >
                        {attr.trait_type}:{attr.value}
                      </span>
                    );
                  })
                : ""}
            </div>
            <div className="d-flex attribute">
              <input
                type="text"
                name="key"
                className="border border-indigo-200 mt-2 min-w-full  rounded p-2 outline-none"
                placeholder="Key"
                required
              />
              <input
                type="text"
                name="value"
                className="
                border
                border-indigo-200
                mt-2
                min-w-full
                rounded
                p-2
                outline-none"
                placeholder="Value"
                required
              />
              <button
                type="submit"
                className="bg-gray-300 mt-2 btn-sm p-2 px-5 rounded"
              >
                Add
              </button>
            </div>
          </div>
        </form>
        <div className="text-center">
          <button
            type="submit"
            className="border rounded text-white bg-indigo-500 hover:-translate-y-0.5 p-2 px-5"
            onClick={() => uploadImageToIPFS()}
          >
            Mint
          </button>
        </div>
      </div>
    </div>
  );
}
export default createNFT;
