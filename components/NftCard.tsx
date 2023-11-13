
import { useState, useEffect } from 'react'
import { useStoreActions, useStoreState } from "../utils/store";
import { getAssets } from "../utils/cardano";
import { Lucid, Credential, TxHash, Lovelace, Constr, SpendingValidator, Data, fromText, Unit, MintingPolicy, 
    PolicyId, Address, UTxO, applyParamsToScript, Assets, ScriptHash, Redeemer, paymentCredentialOf, KeyHash, 
    generatePrivateKey, getAddressDetails, toUnit } from 'lucid-cardano'
import initLucid from '../utils/lucid'
import {mintNft, burnNft} from '../utils/minitng'


const NftCard = (props: any) => {
    const walletStore = useStoreState((state: any) => state.wallet)
    const [lucid, setLucid] = useState<Lucid>()

    const imageSrc = props.meta.image?.replace("ipfs://", "https://ipfs.io/ipfs/");
    const tokenName = props.meta.assetName; // Assuming this is already a human-readable string
    const title = props.meta.name || "Unnamed NFT"; // Fallback for unnamed NFTs


    useEffect(() => {
        if (lucid) {
          ;
        } else {
          initLucid(walletStore.name).then((Lucid: Lucid) => { setLucid(Lucid) })
        }
      }, [lucid]);
  
    return (
        <div className="card w-76 bg-base-300 shadow-xl m-5 transition duration-500 ease-in-out transform hover:-translate-y-1 hover:shadow-2xl">
            <figure className="px-10 pt-10">
                <img src={imageSrc} className="rounded-xl" />
            </figure>
            <div className="card-body items-center text-center">
                <h2 className="card-title">{title}</h2>
                {tokenName && <p className="text-sm text-gray-500">{tokenName}</p>}
                {/* Display additional metadata here if you want */}
                <div className="card-actions mt-4">
                <button className="btn btn-primary m-5" onClick={() => { burnNft(lucid, tokenName) }}> Burn</button>
                </div>
            </div>
        </div>
    )
}

export default NftCard;