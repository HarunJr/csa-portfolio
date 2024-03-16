import type { NextPage } from 'next'
import { useStoreActions, useStoreState } from "../utils/store"
import { useState, useEffect } from 'react'
import {
  Lucid, Credential, TxHash, Lovelace, Constr, SpendingValidator, Data, fromText, Unit, MintingPolicy,
  PolicyId, Address, UTxO, applyParamsToScript, Assets, ScriptHash, Redeemer, paymentCredentialOf, KeyHash,
  generatePrivateKey, getAddressDetails, toUnit
} from 'lucid-cardano'
import initLucid from '../utils/lucid'
import { getAssets } from "../utils/cardano";

import Layout from '../components/Layout'
import CoinSwap from "../components/CoinSwap";
import NftGrid from '../components/NftGrid'
import CurrencyConvert from '../components/CurrencyConvert'

const ConnectSwap: NextPage = () => {
  const walletStore = useStoreState((state: any) => state.walletModel.wallet)
  const [nftList, setNftList] = useState([])
  const [tokenList, setTokenList] = useState([])
  const [balance, setBalance] = useState()
  const [lucid, setLucid] = useState<Lucid>()
  const [tokenNameInput, setTokenNameInput] = useState("")
  const [isLoading, setIsLoading] = useState(true) // Add a loading state

  // useEffect(() => {
  //   if (lucid) {
  //     setIsLoading(true) // Set loading to true when fetching data
  //     getAssets(walletStore.address)
  //       .then((res: any) => { setNftList(res.addressInfo.nfts), setTokenList(res.addressInfo.tokens), setBalance(res.addressInfo.balance) })
  //     setIsLoading(false) // Set loading to false after data is fetched

  //   } else {
  //     setIsLoading(true) // Set loading to true when fetching data
  //     initLucid(walletStore.name).then((Lucid: Lucid | undefined) => { setLucid(Lucid) })
  //   }
  // }, [lucid]);

  // if (isLoading) {
  //   return <div>Loading...</div> // Render a loading message while fetching data
  // }

  return (
    <Layout className="bg-white">
      {/* <div>Address: {walletStore.address}</div>
      <div>Balance: {balance}</div>
      <div className="mx-40 my-10">
        <h2>Your NFTs:</h2>
          <NftGrid nfts={tokenList} />
        </div>       */}
        <div className='mt-10'>
        <CoinSwap/>
        </div>
    </Layout>
  );
};

export default ConnectSwap;