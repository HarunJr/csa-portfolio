import { useStoreActions, useStoreState } from "../utils/store"
import { useState, useEffect } from 'react'
import {
  Lucid, Credential, TxHash, Lovelace, Constr, SpendingValidator, Data, fromText, Unit, MintingPolicy,
  PolicyId, Address, UTxO, applyParamsToScript, Assets, ScriptHash, Redeemer, paymentCredentialOf, KeyHash,
  generatePrivateKey, getAddressDetails, toUnit
} from 'lucid-cardano'
import {initLucid} from '../utils/lucid'
import NftGrid from "../components/NftGrid";
import { getAssets } from "../utils/cardano";
import { MintData } from "../pages/api/hello";

// const walletStore = useStoreState((state: any) => state.wallet);
// const [lucid, setLucid] = useState<Lucid>();
// const [tokenNameInput, setTokenNameInput] = useState("");

const MintRedeemer = () => Data.to(new Constr(0, []))
const BurnRedeemer = () => Data.to(new Constr(1, []))

export const getMintingPolicy = (utxo: UTxO, name: string) => {
  // if(utxo.length == 0) throw 'No UTxO available';
  const lucidNftCbor = "5909cd5909ca010000323232323322323232323232323232323322323232323232323232323232323232323222322322322533553353333573466e1d40092002212200223333573466e1d400d2000212200123263202b33573805805605205026464646601a9212f57726f6e67204275726e656420416d6f756e743a20416d6f756e74206d757374206265206c657373207468616e2031005335335501500f300c300e00110292213500222253350041330173332001501800200733320015019001480048840c0c05800d401540184c8c8c8c8cc04ccc039241115554784f206e6f7420636f6e73756d65640033550163355301712001323212330012233350052200200200100235001220011233001225335002102e100102b2325335333573466e3cd400488008d4018880080b40b04ccd5cd19b873500122001350062200102d02c102c3500122002323500122222222222200c50013300e4911377726f6e6720616d6f756e74206d696e7465640053353010300d5001102a221350022225335004133018333200150190020083332001501a001480088840c44c038004c05800d4015401840a44c98c80a4cd5ce2490350543500029135573a6ea80044dd700089980c9bae002375a00246a00244444444444401044a66a002203e266ae700080788d4004880088cc0094040004c8004d540788894cd40044008884d400888cc01cccc02000801800400cc8004d5407488894cd40044008884d4008894cd4ccd5cd19b87001480000840804ccc02001c01800c4ccc02001ccd405048ccc00402000c00801800c894cd400840044064488ccd5cd19b8f002001019018122333573466e1c00800406005c4488c008004c8004d5406088448894cd40044d400c88004884ccd401488008c010008ccd54c01c480040140100048c8c8cccd5cd19b8735573aa0049000119910919800801801191919191919191919191919191999ab9a3370e6aae754031200023333333333332222222222221233333333333300100d00c00b00a00900800700600500400300233501301435742a01866a0260286ae85402ccd404c054d5d0a805199aa80bbae501635742a012666aa02eeb94058d5d0a80419a80980f9aba150073335501702075a6ae854018c8c8c8cccd5cd19b8735573aa00490001199109198008018011919191999ab9a3370e6aae754009200023322123300100300233502a75a6ae854008c0acd5d09aba2500223263202f33573806005e05a26aae7940044dd50009aba150023232323333573466e1cd55cea8012400046644246600200600466a054eb4d5d0a80118159aba135744a004464c6405e66ae700c00bc0b44d55cf280089baa001357426ae8940088c98c80accd5ce01601581489aab9e5001137540026ae854014cd404dd71aba150043335501701b200135742a006666aa02eeb88004d5d0a801180f1aba135744a004464c6404e66ae700a009c0944d5d1280089aba25001135744a00226ae8940044d5d1280089aba25001135744a00226ae8940044d5d1280089aba25001135573ca00226ea8004d5d0a80118069aba135744a004464c6403266ae7006806405c4d55cf280089baa0011232230023758002640026aa02e446666aae7c004940288cd4024c010d5d080118019aba2002017232323333573466e1cd55cea8012400046644246600200600460186ae854008c014d5d09aba2500223263201733573803002e02a26aae7940044dd50009191919191999ab9a3370e6aae75401120002333322221233330010050040030023232323333573466e1cd55cea80124000466442466002006004602c6ae854008cd403c054d5d09aba2500223263201c33573803a03803426aae7940044dd50009aba150043335500875ca00e6ae85400cc8c8c8cccd5cd19b875001480108c84888c008010d5d09aab9e500323333573466e1d4009200223212223001004375c6ae84d55cf280211999ab9a3370ea00690001091100191931900f19ab9c01f01e01c01b01a135573aa00226ea8004d5d0a80119a805bae357426ae8940088c98c8060cd5ce00c80c00b09aba25001135744a00226aae7940044dd5000899aa800bae75a224464460046eac004c8004d5405088c8cccd55cf80112804119a8039991091980080180118031aab9d5002300535573ca00460086ae8800c0544d5d080088910010910911980080200189119191999ab9a3370ea0029000119091180100198029aba135573ca00646666ae68cdc3a801240044244002464c6402666ae7005004c0440404d55cea80089baa001232323333573466e1d400520062321222230040053008357426aae79400c8cccd5cd19b875002480108c848888c008014c028d5d09aab9e500423333573466e1d400d20022321222230010053007357426aae7940148cccd5cd19b875004480008c848888c00c014dd71aba135573ca00c464c6402666ae7005004c04404003c0384d55cea80089baa001232323333573466e1cd55cea8012400046600a600c6ae854008dd69aba135744a004464c6401e66ae7004003c0344d55cf280089baa0012212330010030022323333573466e1cd55cea800a400046eb8d5d09aab9e500223263200c33573801a01801426ea80048c8c8c8c8c8cccd5cd19b8750014803084888888800c8cccd5cd19b875002480288488888880108cccd5cd19b875003480208cc8848888888cc004024020dd71aba15005375a6ae84d5d1280291999ab9a3370ea00890031199109111111198010048041bae35742a00e6eb8d5d09aba2500723333573466e1d40152004233221222222233006009008300c35742a0126eb8d5d09aba2500923333573466e1d40192002232122222223007008300d357426aae79402c8cccd5cd19b875007480008c848888888c014020c038d5d09aab9e500c23263201533573802c02a02602402202001e01c01a26aae7540104d55cf280189aab9e5002135573ca00226ea80048c8c8c8c8cccd5cd19b875001480088ccc888488ccc00401401000cdd69aba15004375a6ae85400cdd69aba135744a00646666ae68cdc3a80124000464244600400660106ae84d55cf280311931900719ab9c00f00e00c00b135573aa00626ae8940044d55cf280089baa001232323333573466e1d400520022321223001003375c6ae84d55cf280191999ab9a3370ea004900011909118010019bae357426aae7940108c98c802ccd5ce00600580480409aab9d50011375400224464646666ae68cdc3a800a40084244400246666ae68cdc3a8012400446424446006008600c6ae84d55cf280211999ab9a3370ea00690001091100111931900619ab9c00d00c00a009008135573aa00226ea80048c8cccd5cd19b8750014800880148cccd5cd19b8750024800080148c98c8020cd5ce00480400300289aab9d37540022440042440029309000a4810350543100112323001001223300330020020011"

  const txOutId = utxo.txHash
  const txId = new Constr(0, [txOutId])
  const txIndex = BigInt(utxo.outputIndex)
  const txOutRefParam = new Constr(0, [txId, txIndex, name])

  console.log("txOutRefParam: " + txIndex + " " + txOutId)

  const emurgoMinting: MintingPolicy = {
    type: "PlutusV2",
    script: applyParamsToScript(lucidNftCbor, [txOutRefParam])
  }

  return emurgoMinting
}

export const getPolicyId = (lucid: Lucid, mintingPolicy: MintingPolicy) => {
  const policyId: PolicyId = lucid!.utils.mintingPolicyToId(mintingPolicy)

  return policyId
}

export const getUnit = (policyId: PolicyId, name: string): Unit => {
  const assetName: Unit = policyId + name;

  return assetName;
}

export const savePolicyData = async (mintingPolicy: MintingPolicy, policyId: PolicyId, name: string, contractAddress: string | undefined) => {
  // Code to save minting policy
  const response = await fetch('/api/hello', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      tokenName: name,
      policyId: policyId,
      mintingPolicy: JSON.stringify(mintingPolicy),
      scriptAddress: contractAddress,
    }),
  });

  if (!response.ok) {
    const errorData = await response.json(); // parse the error data
    throw new Error('Failed to save minting policy. Error: '+errorData.message);
  }

  // Add success message handling here
  const result = await response.json();
  console.log("Minting policy saved successfully:", result);
  return "Minting policy saved successfully"; // or handle the success message as needed

}

export const mintNft = async (lucid: Lucid | undefined, name: string) => {
  // const mintRedeemer = Data.to<RedeemerType>("Mint",Redeemer)
  // const mintRedeemer = Data.to( "Mint", MintRedeemer);

  // console.log(tokenNameInput);
  // console.log(mintRedeemer);

  if (lucid) {
    const utxos = await lucid.wallet.getUtxos();

    if (utxos.length == 0) throw 'No UTxO available';

    const tokenName = fromText(name)

    const mintingPolicy = getMintingPolicy(utxos[0], tokenName);
    // const policyId: PolicyId = "15fcd310c41079df0e3004a397aaa2c5fd2917d9da6e8e7965665580"
    const policyId = getPolicyId(lucid, mintingPolicy);
    const assetName = getUnit(policyId, tokenName);
    const mintingAddress = lucid.utils.validatorToAddress(mintingPolicy)
    console.log("mintingAddress: "+mintingAddress)

    const datum = Data.to(new Constr(0, [fromText("Test Datum")]));

    const txHash = await lucid.newTx()
      .collectFrom([utxos[0]])
      // .payToContract(mintingAddress, { inline: datum}, { lovelace: BigInt(2_000_000) })
      .mintAssets({ [assetName]: BigInt(1) }, MintRedeemer())
      .attachMintingPolicy(mintingPolicy)
      .attachMetadata(721, {datum})
      .complete()
      .then((tx) => tx.sign().complete())
      .then((tx) => tx.submit())

    if (!txHash) {
      throw new Error('Failed to Mint NFT');
    }

    savePolicyData(mintingPolicy, policyId, tokenName, "")
    console.log(txHash)

  };
};

export const getNftUtxo = (utxos: UTxO[], tokenName: string) => {
  const utxoWithNft = utxos.find(utxo =>
    Object.keys(utxo.assets).some((asset) =>
      asset.endsWith(tokenName)
    ));

  return utxoWithNft;
};

export const fetchMintingPolicy = async (tokenName: string): Promise<MintData> => {
  const response = await fetch(`/api/hello?tokenName=${encodeURIComponent(tokenName)}`);
  if (!response.ok) {
    console.log('Failed to fetch minting policy');
  }
  return response.json();
};

const deleteMintingPolicy = async (tokenName: string) => {
  const response = await fetch(`/api/hello?tokenName=${encodeURIComponent(tokenName)}`, {
    method: 'DELETE',
  });

  if (!response.ok) {
    throw new Error('Failed to delete minting policy');
  }

  const result = await response.json();
  console.log("Minting policy deleted successfully:", result);
  return result.message; // or handle the message as needed
};

const sendToAlwaysFailsScript = async (lucid: Lucid, assetName: string) => {

  const AlwaysFailsScript: SpendingValidator = {
    type: "PlutusV2",
    script: "581f581d01000022232632498cd5ce24810b6974206275726e7321212100120011"
  };
  const failScriptAddr = lucid.utils.validatorToAddress(AlwaysFailsScript)
  console.log("failScriptAddr: " + failScriptAddr)

  // const policyId: PolicyId = "15fcd310c41079df0e3004a397aaa2c5fd2917d9da6e8e7965665580"
  // const assetName = getUnit(policyId, tokenName);

  const tx = await lucid
    .newTx()
    .payToContract(failScriptAddr, { asHash: Data.void()}, { [assetName]: BigInt(1) })
    .complete();
  const signedTx = await tx.sign().complete();
  const txHash = await signedTx.submit();
  if (!txHash) {
    throw new Error('Failed to Send to Always Fails');
  }

  console.log(txHash);
};

export const burnNft = async (lucid: Lucid | undefined, assetName: string, tokenPolicy: string, name: string) => {

  if (lucid) {
    const utxos = await lucid.wallet.getUtxos();

    if (utxos.length == 0) throw 'No UTxO available';

    const tokenName = fromText(name)
    console.log("tokenName: " + tokenName);
    console.log("assetName: " + assetName);
    console.log("policyId: " + tokenPolicy);

    const utxoWithNft = getNftUtxo(utxos, tokenName)
    if (!utxoWithNft) {
      throw 'UTxO with the specified NFT not found';
    }

    try {
      const policyData = await fetchMintingPolicy(tokenName);
      // Now policyData contains the mintingPolicy and policyId
      console.log("policyData: ",policyData)

      if (!policyData || !policyData.mintingPolicy) {
        sendToAlwaysFailsScript(lucid, assetName)

      } else {

        // Parse the minting policy
        const mintingPolicy = JSON.parse(policyData.mintingPolicy);
        const policyId = policyData.policyId;

        console.log("PolicyId: " + policyId)
        console.log("MintingPolicy: " + mintingPolicy)

        const assetName = getUnit(policyId, tokenName);

        console.log("assetName: " + assetName);

        const txHash = await lucid.newTx()
          .collectFrom([utxoWithNft])
          .mintAssets({ [assetName]: BigInt(-1) }, BurnRedeemer())
          .attachMintingPolicy(mintingPolicy)
          .complete()
          .then((tx) => tx.sign().complete())
          .then((tx) => tx.submit())

        if (!txHash) {
          throw new Error('Failed to Burn NFT');
        }

        deleteMintingPolicy(tokenName)
        console.log(txHash)

      }

    } catch (error) {
      console.error('Error in burning NFT:', error);
      throw error;
    }

    // const mintingPolicy = getMintingPolicy(utxoWithNft, tokenName);
    // const policyId: PolicyId = "15fcd310c41079df0e3004a397aaa2c5fd2917d9da6e8e7965665580"
    // const policyId = getPolicyId(lucid, mintingPolicy);
  };
};
