export const getAssets = async (address: string) => {
    // var allNFTs: any = []
    var allNFTs: any = []
    var addressInfo = { nfts: allNFTs, balance: 0 }
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
        amount.map(async (asset: any) => {
            //var allNFTs = []
            if (asset.unit !== "lovelace") {
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
                const tokenAsset = data['asset'];
                const policy_id = data['policy_id'];
                const assetName = Buffer.from(data['asset_name'], 'hex').toString(); // Decode from hex to string
                const meta = data['onchain_metadata'];
                if (meta && meta.image) {
                    console.log("meta", meta)
                    allNFTs.push({ ...meta, assetName, assetId: data.asset })
                    
                } else {
                    console.log("nometa: "+ assetName )
                    allNFTs.push({tokenAsset, policy_id, assetName})
                }
            } else if (asset.unit === 'lovelace') {
                // addressInfo.balance === asset.quantity
                addressInfo.balance = asset.quantity / 1000000
            }
        })
    }
    return { addressInfo }
}