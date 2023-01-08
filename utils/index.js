import { ethers } from "ethers";
import { nftMarketAddress, nftaddress } from "../config";
import NFTMarketplaceabi from "../vabi/nftmarketabi.json";
import NFTabi from "../vabi/nftabi.json";

export const shortenAddress = (address) => {
  if (address) {
    const shortAddress = address.slice(0, 4) + "...." + address.slice(-4);
    return shortAddress;
  }
};

export const nftMarketplaceContractInstance = async () => {
  if (window.ethereum) {
    let signer;
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const addresses = await provider.listAccounts();
    if (addresses.length > 0) {
      signer = provider.getSigner();
    } else {
      signer = provider;
    }
    const contract = new ethers.Contract(
      nftMarketAddress,
      NFTMarketplaceabi,
      signer
    );
    return contract;
  }
};

export const nftContractInstance = async () => {
  if (window.ethereum) {
    let signer;
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const addresses = await provider.listAccounts();
    // console.log(addresses);
    if (addresses.length > 0) {
      signer = provider.getSigner();
    } else {
      signer = provider;
    }
    const contract = new ethers.Contract(nftaddress, NFTabi, signer);
    return contract;
  }
};

export const ethersToWei = (n) => {
  const weiBigNumber = ethers.utils.parseEther(n.toString());
  const wei = weiBigNumber.toString();
  return wei;
};
