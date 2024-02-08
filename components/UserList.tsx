import type { NextPage } from 'next'
import { useStore, useStoreActions, useStoreState } from "../utils/store"
import { useState, useEffect } from 'react'
import {
  Blockfrost, Lucid, Credential, TxHash, Lovelace, Constr, SpendingValidator, Data, fromText, toText, Unit, MintingPolicy,
  PolicyId, Address, UTxO, applyParamsToScript, Assets, ScriptHash, Redeemer, paymentCredentialOf, KeyHash,
  generatePrivateKey, getAddressDetails, toUnit
} from 'lucid-cardano'
import initLucid from '../utils/lucid'
import { getMintingPolicy, getPolicyId, getUnit, savePolicyData, fetchMintingPolicy } from '../utils/minitng'
import UtxoList from "./UtxoList";
import CardComponent from "./CardList";
import { getAssets } from "../utils/cardano";
import { getBackendUsers, User, deleteUser } from "../utils/backend";

import Link from 'next/link'
import { useRouter } from 'next/router';
import Layout from './Layout'
// import { AssetName } from 'lucid-cardano/types/src/core/wasm_modules/cardano_multiplatform_lib_web/cardano_multiplatform_lib'

const UserList: NextPage = () => {
  const walletStore = useStoreState((state: any) => state.wallet)
  const [nftList, setNftList] = useState([])
  const [balance, setBalance] = useState()
  const [lucid, setLucid] = useState<Lucid>()
  const [script, setScript] = useState<SpendingValidator>()
  const [scriptAddress, setScriptAddress] = useState<Address>()
  const [ariadyTxHash, setAriadyTxHash] = useState("")
  const [efrainTxHash, setEfrainTxHash] = useState("")
  const [tokenNameInput, setTokenNameInput] = useState("")
  const [datum, setDatum] = useState("")
  const [datumList, setDatumList] = useState<any[]>([]) // Change this to an array
  const [message, setMessage] = useState([])
  const [people, setPeople] = useState([])

  const userStore = useStoreState((state) => state.user.users) // Add this line
  const setUsers = useStoreActions((actions) => actions.user.setUsers) // Add this line

  const deleteUserFromStore = useStoreActions((actions) => actions.user.deleteUser);

  useEffect(() => {
    if (!lucid) {
      initLucid(walletStore.name).then((Lucid: Lucid) => { setLucid(Lucid) })
    } else {
      getBackendUsers();
      // getBackendUsers().then((res: any) => { setUsers(res.usersInfo)});
      // initializeAndFetchDatum();
    }
  }, [lucid, walletStore.name, userStore]); // Add dependencies here as needed

  return (

    <div className="flex-grow space-y-2">{userStore.map((user: User) => (
            <div key={user.id} className="flex items-center justify-between bg-white p-4 rounded-lg shadow">
              <CardComponent card={user} />
              <button onClick={() => deleteUser(user.id).then(user => {
                if (user) {
                  deleteUserFromStore(user.id);
                }
              })} className="bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded">
                Delete User
              </button>
            </div>
          ))}
        </div>
  );
};


export default UserList;