import type { NextPage } from 'next'
import { useStoreActions, useStoreState } from "../utils/store"
import { useState, useEffect } from 'react'
import {
  Blockfrost, Lucid, Credential, TxHash, Lovelace, Constr, SpendingValidator, Data, fromText, toText, Unit, MintingPolicy,
  PolicyId, Address, UTxO, applyParamsToScript, Assets, ScriptHash, Redeemer, paymentCredentialOf, KeyHash,
  generatePrivateKey, getAddressDetails, toUnit
} from 'lucid-cardano'
import initLucid from '../utils/lucid'
import { getMintingPolicy, getPolicyId, getUnit, savePolicyData, fetchMintingPolicy } from '../utils/minitng'
import NftGrid from "../components/NftGrid";
import User from "../components/User";
import UsersList from "../components/UserList";
import { getAssets } from "../utils/cardano";

import Link from 'next/link'
import { useRouter } from 'next/router';
import Layout from '../components/Layout'
import { AssetName } from 'lucid-cardano/types/src/core/wasm_modules/cardano_multiplatform_lib_web/cardano_multiplatform_lib'

const UserPostgres: NextPage = () => {
  const walletStore = useStoreState((state: any) => state.wallet)
  const [balance, setBalance] = useState()
  const [isLoading, setIsLoading] = useState(true) // Add a loading state


  useEffect(() => {
    if (walletStore.address != "") {
      setIsLoading(true) // Set loading to true when fetching data
      getAssets(walletStore.address)
        .then((res: any) => {
          setBalance(res.addressInfo.balance),
          setIsLoading(false) // Set loading to false after data is fetched
        })
      // .then((res: any) => { setBalance(res.addressInfo.balance) })
    }
    else {
      setIsLoading(false) // Set loading to false if there's no address
    }
  }, [walletStore.address])

  if (isLoading) {
    return <div>Loading...</div> // Render a loading message while fetching data
  }
  return (
    <Layout className="bg-white">
      <div>Address: {walletStore.address}</div>
      <div>Balance: {balance}</div>

      <div className='flex flex-wrap -mx-2 ml-2 w-full justify-start'>
        <User/>
        <div className='mx-8'></div>
        <UsersList/>
      </div>
    </Layout>
  );
};


export default UserPostgres;