import type { NextPage } from 'next'
import { useStoreActions, useStoreState } from "../utils/store"
import { useState, useEffect } from 'react'
import {
  Blockfrost, Lucid, Credential, TxHash, Lovelace, Constr, SpendingValidator, Data, fromText, toText, Unit, MintingPolicy,
  PolicyId, Address, UTxO, applyParamsToScript, Assets, ScriptHash, Redeemer, paymentCredentialOf, KeyHash,
  generatePrivateKey, getAddressDetails, toUnit
} from 'lucid-cardano'
import { getMintingPolicy, getPolicyId, getUnit, savePolicyData, fetchMintingPolicy } from '../utils/minitng'
import { requestValidator } from "../utils/contract";

// import { AssetName } from 'lucid-cardano/types/src/core/wasm_modules/cardano_multiplatform_lib_web/cardano_multiplatform_lib'
import { User, NewUser, createUser, updateUser } from "../utils/backend";

const UserUI: NextPage = () => {
  const walletStore = useStoreState((state: any) => state.wallet)
  const [lucid, setLucid] = useState<Lucid>()
  const [tokenNameInput, setTokenNameInput] = useState("")

  const [newUser, setNewUser] = useState<NewUser>({ name: '', email: '' });
  const [userToUpdate, setUserToUpdate] = useState<User>({ id: 0, name: '', email: '' });

  const addUser = useStoreActions((actions) => actions.user.addUser);
  const userUpdate = useStoreActions((actions) => actions.user.updateUser);

  const borrowName = fromText("BorrowNFT");
  const lendName = fromText("LendNFT");
  const djedName = fromText("Djed_testMicroUSD");

  useEffect(() => {
   
  }, [lucid, walletStore.name]); // Add dependencies here as needed

  //This works but the constructor are a challenge to handle
  const buildRequestDatum = (pkh: string, borrowTn: string, collateralAmount: bigint, lendTn: string) => {
    const dJedId: PolicyId = "9772ff715b691c0444f333ba1db93b055c0864bec48fff92d1f2a7fe"
    const dJed = getUnit(dJedId, djedName);
    const Ada = getUnit("", fromText(""))
    const borrowersNftTn = new Constr(0, [borrowTn]);
    const borrower = new Constr(0, [pkh]);
    const collateral = new Constr(0, [Ada]);
    const collateralAmnt = new Constr(0, [Data.to(collateralAmount)]);
    const lenderNftTn = new Constr(0, [lendTn]);
    const interest = new Constr(0, [Data.to(BigInt(10))]);
    const interestamnt = new Constr(0, [Data.to(BigInt(5_000_000))]);
    const loan = new Constr(0, [new Constr(0, [dJedId]), new Constr(0, [fromText("Djed_testMicroUSD")])])
    const loanAmnt = new Constr(0, [Data.to(BigInt(15_000_000))]);
    const requestExpiration = new Constr(0, [Data.to(BigInt(new Date('2/1/2024').getTime()))]);
    const lendDate = new Constr(0, [Data.to(BigInt(Date.now()))]);

    return new Constr(0, [
      borrowersNftTn,
      borrower,
      collateral,
      collateralAmnt,
      lenderNftTn,
      interest,
      interestamnt,
      loan,
      loanAmnt,
      requestExpiration,
      lendDate,
      // gToken,
    ]);
    // return new Constr(0, [Data.fromJson(requestDat), Data.to(BigInt(1))])
  }

  const borrowRequest = async () => {

    const MintRedeemer = () => Data.to(new Constr(0, []))
    const BorrowRedeemer = () => Data.to(new Constr(0, []))

    if (lucid) {
      const utxos = await lucid.wallet.getUtxos();

      if (utxos.length == 0) throw 'No UTxO available';

      const { paymentCredential } = lucid.utils.getAddressDetails(await lucid.wallet.address())
      console.log(paymentCredential!.hash)
      const pkh = paymentCredential!.hash
      const parameter = new Constr(0, [paymentCredential!.hash])

      const Redeemer = () => Data.to(new Constr(0, []))

      const borrowPolicy = getMintingPolicy(utxos[0], borrowName);
      const lendPolicy = getMintingPolicy(utxos[0], lendName);

      const borrowId = getPolicyId(lucid, borrowPolicy);
      const lendId = getPolicyId(lucid, lendPolicy);
      const borrowAssetName = getUnit(borrowId, borrowName);
      const lendAssetName = getUnit(lendId, lendName);

      const myValidator = requestValidator(lendAssetName, borrowAssetName);
      const requestAddress: Address = lucid.utils.validatorToAddress(myValidator);
      console.log("requestAddress: " + requestAddress)

      const collateralAmount = BigInt(5_000_000);

      const requestDatum = buildRequestDatum(pkh, borrowName, collateralAmount, lendName);
      // const requestDatum = buildBorrowDatum(pkh, borrowName, collateralAmount, lendName);

      const txHash = await lucid.newTx()
        .collectFrom([utxos[0]], BorrowRedeemer())
        .payToContract(requestAddress, { inline: Data.to(requestDatum) }, { lovelace: collateralAmount })
        .mintAssets({ [borrowAssetName]: BigInt(1) }, MintRedeemer())
        .attachMintingPolicy(borrowPolicy)
        .attachMetadata(721, { requestDatum })
        .complete()
        .then((tx) => tx.sign().complete())
        .then((tx) => tx.submit())

      if (!txHash) {
        throw new Error('Failed to Mint NFT');
      }

      // setScriptAddress(requestAddress);
      savePolicyData(borrowPolicy, borrowId, borrowName, requestAddress)
      console.log("Lock Test TxHash: " + txHash)

    }
  }

  return (
    <div className="bg-white">
      <div>
        {/* Create user */}
        <form onSubmit={(e) => createUser(newUser, e).then(user => {
          // Check if user is not null or undefined
          if (user) {
            console.log(`Borrow... User ID: ${user.id}`);
            addUser(user);
            // Reset newUser
            setNewUser({ name: '', email: '' });
          }
        })} className="p-4 bg-blue-100 rounded shadow">
          <input
            placeholder="Name"
            value={newUser.name}
            onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
            className="mb-2 w-full p-2 border border-gray-300 rounded"
          />
          <input
            placeholder="Email"
            value={newUser.email}
            onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
            className="mb-2 w-full p-2 border border-gray-300 rounded"
          />
          <button type="submit" className="w-full p-2 text-white bg-blue-500 rounded hover:bg-blue-600">
            Add User
          </button>
        </form>

        {/* Update user */}
        <form onSubmit={(e) => updateUser(userToUpdate, e).then(user => {
          if (user) {
            userUpdate(user)
          }

        })} className="p-4 bg-green-100 rounded shadow">
          <input
            placeholder="User ID"
            value={userToUpdate.id}
            onChange={(e) => setUserToUpdate({ ...userToUpdate, id: Number(e.target.value) })}
            className="mb-2 w-full p-2 border border-gray-300 rounded"
          />
          <input
            placeholder="New Name"
            value={userToUpdate.name}
            onChange={(e) => setUserToUpdate({ ...userToUpdate, name: e.target.value })}
            className="mb-2 w-full p-2 border border-gray-300 rounded"
          />
          <input
            placeholder="New Email"
            value={userToUpdate.email}
            onChange={(e) => setUserToUpdate({ ...userToUpdate, email: e.target.value })}
            className="mb-2 w-full p-2 border border-gray-300 rounded"
          />
          <button type="submit" className="w-full p-2 text-white bg-green-500 rounded hover:bg-green-600">
            Update User
          </button>
        </form>

      </div>
    </div>

  );
};

export default UserUI;