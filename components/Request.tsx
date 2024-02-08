import type { NextPage } from 'next'
import { useStore, useStoreActions, useStoreState } from "../utils/store"
import { useState, useEffect } from 'react'
import {
  Blockfrost, Lucid, Credential, TxHash, Lovelace, Constr, SpendingValidator, Data, fromText, toText, Unit, MintingPolicy,
  PolicyId, Address, UTxO, applyParamsToScript, Assets, ScriptHash, Redeemer, paymentCredentialOf, KeyHash,
  generatePrivateKey, getAddressDetails, toUnit, Datum
} from 'lucid-cardano'
import initLucid from '../utils/lucid'
import { getValidatorsFromDB, getScriptDatum } from '../utils/contract'
import { getMintingPolicy, getPolicyId, getUnit, savePolicyData, fetchMintingPolicy } from '../utils/minitng'
import UtxoList from "../components/UtxoList";
import DatumCardComponent from "../components/CardListDatum";
import { getAssets } from "../utils/cardano";
import { BorrowDatum, User, deleteUser, getMintData } from "../utils/backend";

import Link from 'next/link'
import { useRouter } from 'next/router';
import Layout from '../components/Layout'
// import { AssetName } from 'lucid-cardano/types/src/core/wasm_modules/cardano_multiplatform_lib_web/cardano_multiplatform_lib'

import { requestValidator } from "../utils/contract";

const Request: NextPage = () => {
  const walletStore = useStoreState((state: any) => state.walletModel.wallet)
  const [lucid, setLucid] = useState<Lucid>()

  const userStore = useStoreState((state) => state.user.users) // Add this line

  const [validatorAddresses, setValidatorAddresses] = useState<Address[]>([]); // Add this line
  const [datumList, setDatumList] = useState<any[]>([]); // Add this line

  const [borrowDatum, setBorrowDatum] = useState<any[]>([]); // Add this line

  const setDatum = useStoreActions(actions => actions.borrowDatumModel.setData);
  const datumStore = useStoreState((state) => state.borrowDatumModel.data) // Add this line

  useEffect(() => {
    if (!lucid) {
      initLucid(walletStore.name).then((Lucid: Lucid | undefined) => { setLucid(Lucid) })
    } else {
      // getBackendUsers().then((res: any) => { setUsers(res.usersInfo)});
      getValidatorsFromDB().then((res: Address[]) => {
        console.log("getValidatorsFromDB: " + res);
        setValidatorAddresses(res)
      });

      let response: any[] = [];
      for (const validator of validatorAddresses) {
        getScriptDatum(lucid, validator).then((res: any) => {
          console.log("processedDatum: " + res)
          const datumObject = JSON.parse(res); // Parse the JSON string to an object
          setDatumList(prevState => [...prevState, datumObject]); // Append the new object to the existing state
        });
      }
    }
  }, [lucid, walletStore.name, userStore]); // Add dependencies here as needed

  useEffect(() => {
    console.log("Updated datumList: ", datumList);
  }, [datumList]);


  // const processFields = (fields: any) => {
  //   let resultString = ""; // Initialize an empty string to accumulate data

  //   for (const data of fields) {
  //     if (Array.isArray(data.fields)) {
  //       console.log('Processing nested fields:', data.fields);
  //       resultString += processFields(data.fields); // Concatenate the results of the recursive call
  //     } else {
  //       console.log('Field data:', data);
  //       resultString += JSON.stringify(data) + ", \n"; // Append the data to the result string
  //     }
  //   }
  //   return resultString; // Return the accumulated string
  // }

  async function deleteDatum(index: number): Promise<void> {
    throw new Error('Function not implemented.')
  }

  return (

    <div className="flex-grow space-y-2">
      {datumList.map((datum, index) => (
        <div key={index} className="flex items-center justify-between bg-white p-4 rounded-lg shadow">
          <DatumCardComponent datum={datum} />
          <button onClick={() => deleteDatum(index).then(datum => {
            // if (datum) {
            //   deleteDatumFromList(index);
            // }
          })} className="bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded">
            Delete Datum
          </button>
        </div>
      ))}
    </div>

    // <div className="flex-grow space-y-2">{userStore.map((user: User) => (
    //   <div key={user.id} className="flex items-center justify-between bg-white p-4 rounded-lg shadow">
    //     <CardComponent card={user} />
    //     <button onClick={() => deleteUser(user.id).then(user => {
    //       if (user) {
    //         deleteUserFromStore(user.id);
    //       }
    //     })} className="bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded">
    //       Delete User
    //     </button>
    //   </div>
    // ))}
    // </div>
  );
};


export default Request;