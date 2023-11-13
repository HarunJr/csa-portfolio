
import { useEffect } from 'react'
import NftCard from './NftCard'

const NftGrid = (props : any) => {
    useEffect(()=>{
    console.log("Log:" + props)

    },[props])

    if (!props || props.length === 0) {
        return <p>No NFTs found.</p>;
    }

    return (
        <>
        <div className="grid grid-cols-4 gap-2">
                {props.nfts.map((nft : any, index : Number) => {
                    return <NftCard key={index} meta={nft} />
                })}
            </div>
        </>

    )
}

export default NftGrid;