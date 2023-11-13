import { Blockfrost, Lucid } from 'lucid-cardano';

const initLucid = async (wallet: string) => {
    const api = (await window.cardano[
        wallet.toLowerCase()
    ].enable())

    // const nami = await window.cardano.nami.enable();
    // const eternl = window.cardano.eternl.enable();
    // const gero = await window.cardano.gero.enable();
    
    const lucid = await Lucid.new(
        new Blockfrost('https://cardano-preprod.blockfrost.io/api/v0', "preprodLT9nUTb22P26FiVH42jSFJU2IZaNxZVz") //process.env.NEXT_PUBLIC_BLOCKFROST as string),
        ,'Preprod')
    // const lucid = await Lucid.new(
    //         new Blockfrost('https://cardano-mainnet.blockfrost.io/api/v0', "mainneto2wd71NAi5sZMWDHUTXxgvMTEC6ciS2I") //process.env.NEXT_PUBLIC_BLOCKFROST as string),
    //         ,'Mainnet')
    lucid.selectWallet(api)
    //setLucid(lucid)
    return lucid;
}
// curl -H "project_id: preprodLT9nUTb22P26FiVH42jSFJU2IZaNxZVz" \
// "https://cardano-preprod.blockfrost.io/api/v0/addresses/addr_test1qzejxr24w9ld3t6fhx7ew03jd3ag9fr0s3tl8fyu206k9h06antkyruk5hsmyu5geq52w0cgfvg7fsju4qagpfkr90uqj93lmh/transactions?count=1&order=desc"

// curl -H "project_id: preprodLT9nUTb22P26FiVH42jSFJU2IZaNxZVz" \
// "https://cardano-preprod.blockfrost.io/api/v0/assets/a10bc10b9e82ad1f75741a8522c6f8c84175aae68c1617a1822699e5000de140456d7572676f544e"

export default initLucid;