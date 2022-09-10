import type { NextPage } from "next";
import Head from "next/head";
import Image from "next/image";
import styles from "../styles/Home.module.css";
import { useState } from "react";
import { NFTCard } from "../components/nftCard";

const Home: NextPage = () => {
  const [wallet, setWalletAddress] = useState("");
  const [collection, setCollectionAddress] = useState("");
  const [NFTs, setNFTs] = useState([]);
  const [fetchForCollection, setFetchForCollection] = useState(false);

  const api_key = process.env.NEXT_PUBLIC_API_KEY;

  const fetchNFTs = async () => {
    let nfts;
    console.log("fetching nfts");
    const requestOptions = {
      method: "GET"
    };
    const baseURL = `https://eth-mainnet.alchemyapi.io/v2/${api_key}/getNFTs/`;

    if (!collection.length) {
      const fetchURL = `${baseURL}?owner=${wallet}`
      nfts = await fetch(fetchURL, requestOptions).then(data => data.json())
    } else {
      console.log("fetching nfts for collection owned by address");
      const fetchURL = `${baseURL}?owner=${wallet}&contractAddresses%5B%5D=${collection}`;
      nfts = await fetch(fetchURL, requestOptions).then(data => data.json());
    }

    if (nfts) {
      console.log("nfts:", nfts);
      setNFTs(nfts.ownedNfts);
    }
  }

  const fetchNFTsForCollection = async () => {
    if (collection.length) {
      const requestOptions = {
        method: "GET"
      };
      const baseURL = `https://eth-mainnet.alchemyapi.io/v2/${api_key}/getNFTsForCollection/`;
      const fetchURL = `${baseURL}?contractAddress=${collection}&withMetadata=${"true"}`;
      const nfts = await fetch(fetchURL, requestOptions).then(data => data.json());
      if (nfts) {
        console.log("NFTs in collection:", nfts);
        setNFTs(nfts.nfts);
      }
    }
  }

	return (
		<div className="flex flex-col items-center justify-center py-8 gap-y-3">
			<Head>
				<title>NFT Gallary</title>
				<meta name="description" content="This page is gallary of your NFT" />
				<link rel="icon" href="/favicon.ico" />
			</Head>

			<main className={styles.main}>
				<h1 className={styles.title}>NFT Gallary</h1>
				<div className="mt-4 flex flex-col w-full justify-center items-center gap-y-4">
					<input onChange={(e)=>{setWalletAddress(e.target.value)}} disabled={fetchForCollection} type={"text"} value={wallet} placeholder="Add your wallet address" />
					<input onChange={(e)=>{setCollectionAddress(e.target.value)}} type={"text"} value={collection} placeholder="Add the collection address" />
          <label className="text-gray-600">
            <input onChange={(e) => {setFetchForCollection(e.target.checked)}} type={"checkbox"} className="mr-2" />Fetch for collection</label>
          <button className={"disabled:bg-slate-500 text-white bg-blue-400 px-4 py-2 mt-3 rounded-sm w-1/5"} onClick={
            () => {
              if (fetchForCollection) {
                fetchNFTsForCollection()
              } else fetchNFTs()
            }
          }>Let's go! </button>
				</div>
        <div className='flex flex-wrap gap-y-12 mt-4 w-5/6 gap-x-2 justify-center'>
        {
          NFTs.length >0 ? NFTs.map(nft => {
            return (
              <NFTCard nft={nft}></NFTCard>
            )
          }) : ""
        }
      </div>
			</main>
		</div>
	);
};

export default Home;
