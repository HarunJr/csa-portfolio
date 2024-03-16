import {
    Lucid, Credential, TxHash, Lovelace, Constr, SpendingValidator, Data, fromText, Unit, MintingPolicy,
    PolicyId, Address, UTxO, applyParamsToScript, Assets, ScriptHash, Redeemer, paymentCredentialOf, KeyHash,
    generatePrivateKey, getAddressDetails, toUnit, toText
} from 'lucid-cardano'
export const getAssets = async (address: string) => {
    // var allNFTs: any = []
    var allNFTs: any = []
    var allTokens: any = []
    var addressInfo = { nfts: allNFTs, tokens: allTokens, balance: 0 }
    const data = await fetch(
        `https://cardano-preprod.blockfrost.io/api/v0/addresses/${address}`,
        {
            headers: {
                // Your Blockfrost API key
                project_id: process.env.NEXT_PUBLIC_BLOCKFROST!,
                'Content-Type': 'application/json'
            }
        }
    ).then(res => res.json());
    console.log(data)
    if (data?.error) {
        // Handle error.
        console.log("error")
    }

    const amount = data['amount'] || [];
    if (amount.length > 0) {
        await Promise.all(amount.map(async (asset: any) => {
            //var allNFTs = []
            const data = await fetch(
                `https://cardano-preprod.blockfrost.io/api/v0/assets/${asset.unit}`,
                {
                    headers: {
                        // Your Blockfrost API key
                        project_id: process.env.NEXT_PUBLIC_BLOCKFROST!,
                        'Content-Type': 'application/json'
                    }
                }
            ).then(res => res.json());
            if (asset.unit !== "lovelace") {

                const tokenAsset = data['asset'];
                const policy_id = data['policy_id'];
                const assetName = Buffer.from(data['asset_name'], 'hex').toString(); // Decode from hex to string
                let assetQuant = data['quantity'];
                const meta = data['onchain_metadata'];
                if (asset.quantity > 1) {
                    if (assetName === "Djed_testMicroUSD") {
                        console.log("assetName: ", assetName);
                        assetQuant = (assetQuant / 1e15).toFixed(15);
                    }
                    allTokens.push({ tokenAsset, policy_id, assetName, assetQuant })
                    console.log("Other Tokens: " + assetName + "quant: " + assetQuant)

                } else {
                    if (meta && meta.image) {
                        console.log("meta", meta)
                        allNFTs.push({ ...meta, assetName, assetId: data.asset })

                    } else {
                        console.log("nometa: " + assetName)
                        allNFTs.push({ tokenAsset, policy_id, assetName })
                    }
                }

            } else if (asset.unit === 'lovelace') {
                const tokenAsset = data['asset'];
                const policy_id = data['policy_id'];
                // const assetName = Buffer.from(data['asset_name'], 'hex').toString(); // Decode from hex to string
                const assetName = "Ada"
                const assetQuant = asset.quantity/1000000;
                allTokens.push({ tokenAsset, policy_id, assetName, assetQuant })
                // addressInfo.balance = asset.quantity / 1000000
                addressInfo.balance = assetQuant
                console.log("Ada Token: " + assetQuant)
            }

        }));
    }
    return { addressInfo }
}