
import { useEffect } from 'react'
import UtxoCard from './UtxoCard'

const UtxoList = (props : any) => {
    useEffect(()=>{
    console.log("Log:" + props)

    },[props])

    if (!props || props.length === 0) {
        return <p>No UTXO found.</p>;
    }

    return (
        <>
        <div className="grid grid-cols-4 gap-2">
                {props.nfts.map((nft : any, index : Number) => {
                    return <UtxoCard key={index} meta={nft} />
                })}
            </div>
        </>

    )
}

export default UtxoList;