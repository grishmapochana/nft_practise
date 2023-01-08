import React, { useState, ReactNode, FC, useRef } from "react";
import Link from "next/link";

const navitems = {
  nft: { href: "/", name: "NFT", key: "nft" },
  market: { href: "/", name: "MarketPlace", key: "market" },
  create: { href: "/create-nft", name: "Create-Nft", key: "create" },
  minted: { href: "/minted", name: "Minted-Nft", key: "minted" },
  collection: { href: "/collection", name: "My-Collection", key: "collection" },
};

const Layout = ({ children }) => {
  return (
    <div>
      <nav className="grid pt-6 pb-6  justify-end mr-4 ">
        <div className="ml-2">
          {Object.values(navitems).map((n) => (
            <Link href={n.href} key={n.key}>
              <span className={`mr-3 text-gray-500`}>{n.name}</span>
            </Link>
          ))}
        </div>
      </nav>
      <div className="bg-gray-100 mt-4 p-4">{children}</div>
    </div>
  );
};

function NFT() {
  const [nfts, setNfts] = useState([
    { token: 1, image: "/favicon.ico", name: "item1", price: "100" },
    { token: 1, image: "/favicon.ico", name: "item1", price: "100" },
  ]);

  return (
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
  );
}

const CreateNFT = () => {
  const formRef = React.useRef(null);
  const [attributes, setAttributes] = React.useState(null);
  const [formData, setFormData] = React.useState({
    name: "",
    price: 0,
    description: "",
    image: "",
    attributes: [],
  });
  const fileRef = useRef();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };
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
        { id: 0, trait_type: e.target.key.value, value: e.target.value.value },
      ]);
    }
  };

  const removeAttribute = (id) => {
    var filteredAttr = attributes.filter((data) => data.id !== id);
    setAttributes(filteredAttr);
  };

  const handleMint = async () => {
    console.log(formData, fileRef.current.files[0]);
  };

  return (
    <div className="p-20 text-center bg-gray-50 h-screen">
      <p className="text-5xl font-semibold heading p-4">Minting</p>
      <div className="text-left bg-white p-10 shadow-lg w-1/3 m-auto">
        <p className="text-center underline mb-4 text-lg">Create you nft</p>
        <div className="my-4">
          <label className="block mb-2text-sm font-medium text-gray-900 dark:text-gray-300">
            NFT Name
          </label>
          <input
            className="bg-gray-200 p-4 w-full rounded focus:bg-gray-300 border-0 focus:outline-none"
            type="text"
            placeholder="Nft Name"
            name="name"
            value={formData.name}
            onChange={handleChange}
          />
        </div>

        <div className="my-4">
          <label className="block mb-2text-sm font-medium text-gray-900 dark:text-gray-300">
            Price
          </label>
          <input
            className="bg-gray-200 p-4 w-full rounded focus:bg-gray-300 border-0 focus:outline-none"
            type="text"
            placeholder="Bid Price"
            name="price"
            value={formData.price}
            onChange={handleChange}
          />
        </div>

        <div className="my-4">
          <label className="block mb-2text-sm font-medium text-gray-900 dark:text-gray-300">
            Description
          </label>
          <textarea
            className="bg-gray-200 p-4 w-full rounded focus:bg-gray-300 border-0 focus:outline-none"
            placeholder="Description"
            name="description"
            value={formData.description}
            onChange={handleChange}
          />
        </div>

        <div className="my-4">
          <label
            className="block mb-2text-sm font-medium text-gray-900 dark:text-gray-300"
            htmlFor="file_input"
          >
            Upload file
          </label>
          <input
            className="p-4 block w-full text-sm bg-gray-200 rounded-lg border border-gray-300 cursor-pointer dark:text-gray-400 focus:outline-none"
            id="file_input"
            type="file"
            name="image"
            ref={fileRef}
          />
        </div>

        <div className="my-4">
          <form onSubmit={(e) => addAttribute(e)} ref={formRef}>
            <label
              className="block mb-2text-sm font-medium text-gray-900 dark:text-gray-300"
              htmlFor="file_input"
            >
              Attributes
            </label>

            <div className="flex flex-wrap">
              {attributes
                ? attributes.map((attr, i) => {
                    return (
                      <span
                        key={i}
                        className="bg-blue-100 text-blue-800 text-xs font-semibold mr-2 px-3 py-0.5 rounded mb-1"
                        onClick={() => removeAttribute(attr.id)}
                      >
                        {attr.trait_type}:{attr.value}
                      </span>
                    );
                  })
                : ""}
            </div>
            <div className="flex gap-5">
              <input
                type="text"
                name="key"
                className="bg-gray-200 p-4 w-1/2 rounded focus:bg-gray-300 border-0 focus:outline-none"
                placeholder="Key"
                required
              />
              <input
                type="text"
                name="value"
                className="bg-gray-200 p-4 w-1/2 rounded focus:bg-gray-300 border-0 focus:outline-none"
                placeholder="Value"
                required
              />
              <button
                type="submit"
                className="bg-black text-white hover:bg-gray-800 px-8 rounded"
              >
                Add
              </button>
            </div>
          </form>
        </div>

        <div className="mb-4 mt-6">
          <button
            type="submit"
            className="w-full bg-black text-white hover:bg-gray-800 px-8 py-4 rounded"
            onClick={handleMint}
          >
            Mint NFT
          </button>
        </div>
      </div>
    </div>
  );
};

export default function Home() {
  return (
    <Layout>
      {/* <NFT /> */}
      <CreateNFT />
    </Layout>
  );
}
