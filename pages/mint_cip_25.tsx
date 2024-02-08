import type { NextPage } from 'next'
import { useStoreActions, useStoreState } from "../utils/store"
import { useState, useEffect } from 'react'
import { Lucid, Credential, TxHash, Lovelace, Constr, SpendingValidator, Data, fromText, Unit, MintingPolicy, 
  PolicyId, Address, UTxO, applyParamsToScript, Assets, ScriptHash, Redeemer, paymentCredentialOf, KeyHash, 
  generatePrivateKey, getAddressDetails, toUnit } from 'lucid-cardano'
import initLucid from '../utils/lucid'
import {mintNft, burnNft} from '../utils/minitng'
import NftGrid from "../components/NftGrid";
import { getAssets } from "../utils/cardano";

import Link from 'next/link'
import { useRouter } from 'next/router';
import Layout from '../components/Layout'

const MintCip68 : NextPage = () => {
    const walletStore = useStoreState((state: any) => state.walletModel.wallet)
    const [nftList, setNftList] = useState([])
    const [balance, setBalance] = useState()
    const [lucid, setLucid] = useState<Lucid>()
    const [script, setScript] = useState<SpendingValidator>()
    const [scriptAddress, setScriptAddress] = useState("")
    const [ariadyTxHash, setAriadyTxHash] = useState("")
    const [efrainTxHash, setEfrainTxHash] = useState("")
    const [tokenNameInput, setTokenNameInput] = useState("")
    const [isLoading, setIsLoading] = useState(true) // Add a loading state

    useEffect(() => {
      if (lucid) {
        setIsLoading(true) // Set loading to true when fetching data
        getAssets(walletStore.address)
        .then((res: any) => { setNftList(res.addressInfo.nfts), setBalance(res.addressInfo.balance) })
        setIsLoading(false) // Set loading to false after data is fetched

      } else {
        setIsLoading(true) // Set loading to true when fetching data
        initLucid(walletStore.name).then((Lucid: Lucid | undefined) => { setLucid(Lucid) })
      }
    }, [lucid]);

    if (isLoading) {
      return <div>Loading...</div> // Render a loading message while fetching data
    }
  

    // const MintRedeemerSchema = Data.Enum([
    //   Data.Literal("Mint"),
    //   Data.Literal("Burn"),
    //  ]);
    //  type MintRedeemer = Data.Static<typeof MintRedeemerSchema>;
    //  const MintRedeemer = MintRedeemerSchema as unknown as MintRedeemer;
    const MintRedeemer = () => Data.to(new Constr(0, []))
    const BurnRedeemer = () => Data.to(new Constr(1, []))  
            
  const burnNft = async () => {
    // console.log(tokenNameInput);
    const Parameter = Data.Object({
      utxo: Data.Bytes(),
      tokenName: Data.Bytes(),
    });

    if (lucid) {
      const utxos = await lucid.wallet.getUtxos();

      if(utxos.length == 0) throw 'No UTxO available';

      const txOutId = utxos[0].txHash
      const txId = new Constr(0, [txOutId])
      const txIndex = BigInt(utxos[0].outputIndex)
      const dumbNftCbor = "590a06590a03010000333323232323322323232323232323232323322323232323232323232323232323232323222322322322533553353333573466e1d40092002212200223333573466e1d400d2000212200123263202b33573805805605205026464646601a92012f57726f6e67204275726e656420416d6f756e743a20416d6f756e74206d757374206265206c657373207468616e2031005335335501500f300c300e00110292213500222253350041330173332001501800200733320015019001480048840c0c05800d401540184c8c8c8c8cc04ccc039241115554784f206e6f7420636f6e73756d65640033550163355301712001323212330012233350052200200200100235001220011233001225335002102e100102b2325335333573466e3cd400488008d4018880080b40b04ccd5cd19b873500122001350062200102d02c102c3500122002323500122222222222200c50013300e4911377726f6e6720616d6f756e74206d696e7465640053353010300d5001102a221350022225335004133018333200150190020083332001501a001480088840c44c038004c05800d4015401840a44c98c80a4cd5ce2490350543500029135573a6ea80044dd700089980c9bae002375a00246a00244444444444401044a66a002203e266ae700080788d4004880088cc0094040004c8004d540788894cd40044008884d400888cc01cccc02000801800400cc8004d5407488894cd40044008884d4008894cd4ccd5cd19b87001480000840804ccc02001c01800c4ccc02001ccd405048ccc00402000c00801800c894cd400840044064488ccd5cd19b8f002001019018122333573466e1c00800406005c4488c008004c8004d5406088448894cd40044d400c88004884ccd401488008c010008ccd54c01c480040140100048c8c8cccd5cd19b8735573aa0049000119910919800801801191919191919191919191919191999ab9a3370e6aae754031200023333333333332222222222221233333333333300100d00c00b00a00900800700600500400300233501301435742a01866a0260286ae85402ccd404c054d5d0a805199aa80bbae501635742a012666aa02eeb94058d5d0a80419a80980f9aba150073335501702075a6ae854018c8c8c8cccd5cd19b8735573aa00490001199109198008018011919191999ab9a3370e6aae754009200023322123300100300233502a75a6ae854008c0acd5d09aba2500223263202f33573806005e05a26aae7940044dd50009aba150023232323333573466e1cd55cea8012400046644246600200600466a054eb4d5d0a80118159aba135744a004464c6405e66ae700c00bc0b44d55cf280089baa001357426ae8940088c98c80accd5ce01601581489aab9e5001137540026ae854014cd404dd71aba150043335501701b200135742a006666aa02eeb88004d5d0a801180f1aba135744a004464c6404e66ae700a009c0944d5d1280089aba25001135744a00226ae8940044d5d1280089aba25001135744a00226ae8940044d5d1280089aba25001135573ca00226ea8004d5d0a80118069aba135744a004464c6403266ae7006806405c4d55cf280089baa0011232230023758002640026aa02e446666aae7c004940288cd4024c010d5d080118019aba2002017232323333573466e1cd55cea8012400046644246600200600460186ae854008c014d5d09aba2500223263201733573803002e02a26aae7940044dd50009191919191999ab9a3370e6aae75401120002333322221233330010050040030023232323333573466e1cd55cea80124000466442466002006004602c6ae854008cd403c054d5d09aba2500223263201c33573803a03803426aae7940044dd50009aba150043335500875ca00e6ae85400cc8c8c8cccd5cd19b875001480108c84888c008010d5d09aab9e500323333573466e1d4009200223212223001004375c6ae84d55cf280211999ab9a3370ea00690001091100191931900f19ab9c01f01e01c01b01a135573aa00226ea8004d5d0a80119a805bae357426ae8940088c98c8060cd5ce00c80c00b09aba25001135744a00226aae7940044dd5000899aa800bae75a224464460046eac004c8004d5405088c8cccd55cf80112804119a8039991091980080180118031aab9d5002300535573ca00460086ae8800c0544d5d080088910010910911980080200189119191999ab9a3370ea0029000119091180100198029aba135573ca00646666ae68cdc3a801240044244002464c6402666ae7005004c0440404d55cea80089baa001232323333573466e1d400520062321222230040053008357426aae79400c8cccd5cd19b875002480108c848888c008014c028d5d09aab9e500423333573466e1d400d20022321222230010053007357426aae7940148cccd5cd19b875004480008c848888c00c014dd71aba135573ca00c464c6402666ae7005004c04404003c0384d55cea80089baa001232323333573466e1cd55cea8012400046600a600c6ae854008dd69aba135744a004464c6401e66ae7004003c0344d55cf280089baa0012212330010030022323333573466e1cd55cea800a400046eb8d5d09aab9e500223263200c33573801a01801426ea80048c8c8c8c8c8cccd5cd19b8750014803084888888800c8cccd5cd19b875002480288488888880108cccd5cd19b875003480208cc8848888888cc004024020dd71aba15005375a6ae84d5d1280291999ab9a3370ea00890031199109111111198010048041bae35742a00e6eb8d5d09aba2500723333573466e1d40152004233221222222233006009008300c35742a0126eb8d5d09aba2500923333573466e1d40192002232122222223007008300d357426aae79402c8cccd5cd19b875007480008c848888888c014020c038d5d09aab9e500c23263201533573802c02a02602402202001e01c01a26aae7540104d55cf280189aab9e5002135573ca00226ea80048c8c8c8c8cccd5cd19b875001480088ccc888488ccc00401401000cdd69aba15004375a6ae85400cdd69aba135744a00646666ae68cdc3a80124000464244600400660106ae84d55cf280311931900719ab9c00f00e00c00b135573aa00626ae8940044d55cf280089baa001232323333573466e1d400520022321223001003375c6ae84d55cf280191999ab9a3370ea004900011909118010019bae357426aae7940108c98c802ccd5ce00600580480409aab9d50011375400224464646666ae68cdc3a800a40084244400246666ae68cdc3a8012400446424446006008600c6ae84d55cf280211999ab9a3370ea00690001091100111931900619ab9c00d00c00a009008135573aa00226ea80048c8cccd5cd19b8750014800880148cccd5cd19b8750024800080148c98c8020cd5ce00480400300289aab9d37540022440042440029309000a4810350543100112323001001223300330020020014c1225820fb4c146c9fe1a426ae1eac0cf21bd2d291acd475bd025bf791f1496500a464c7004c010100004c01084744756d624e66740001"          
      // const Params = Data.Tuple([Data.String, Data.BigInt, Data.String]);
      // type Params = Data.Static<typeof Params>;

      const tokenName = fromText(tokenNameInput)
      const txOutRefParam = new Constr(0, [txId, txIndex, tokenName])

      const emurgoMinting : MintingPolicy = {
        type:"PlutusV2", 
        script: applyParamsToScript(dumbNftCbor,[txOutRefParam])}
      // const emurgoMintingCS = lucid.utils.mintingPolicyToId(emurgoMinting)
      const policyId: PolicyId = lucid.utils.mintingPolicyToId(emurgoMinting)
      const assetName: Unit = policyId + tokenName;

      // const emurgoMetadataControl : SpendingValidator = 
      //   {type:"PlutusV2", script: applyParamsToScript(emurgoMetadataControlCbor, [emurgoMintingCS])}
    
      const txHash = await lucid.newTx()
        .collectFrom([utxos[0]])
        .mintAssets({ [assetName]: BigInt(-1) }, BurnRedeemer())
        .attachMintingPolicy(emurgoMinting)
        .complete()
        .then((tx) => tx.sign().complete())
        .then((tx) => tx.submit())
      console.log(txHash)
    };
};

    return (
        <Layout className="bg-white">
            <div>Address: {walletStore.address}</div>
            <div>Balance: {balance}</div>
            <div className='m-05'>
            <p> 
                Sample Minter:
            </p>
            </div>
            <div className="card w-96 bg-base-100 shadow-lg">
                <div className="px-10 pt-10">
                    <input className="input input-bordered w-full max-w-xs" type="text" placeholder="Type NFT Name" value={tokenNameInput} onChange={e => setTokenNameInput(e.target.value)}/>
                </div>
                <div className="card-body items-center text-center">
                    <p>Mint any CIP25 tokens</p>
                    <div className="card-actions flex-row">
                    <button className="btn btn-primary m-5" onClick={() => { mintNft(lucid, tokenNameInput)}}> Mint</button>
                    {/* <button className="btn btn-primary m-5" onClick={() => { burnNft() }}> Burn</button> */}
                </div>
            </div>
            </div>
            <div className="mx-40 my-10">
              <h2>Your NFTs:</h2>
                <NftGrid nfts={nftList} />
            </div>
        </Layout>
    );  
};



export default MintCip68;