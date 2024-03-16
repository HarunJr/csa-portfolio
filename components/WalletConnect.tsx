'use client'
import { Lucid, Blockfrost, C } from "lucid-cardano";
import { useState, useEffect } from 'react';
import { useStoreActions, useStoreState } from "../utils/store";
import initLucid from "../utils/lucid";

const WalletConnect = () => {
    // const [availableWallets, setAvailableWallets] = useState<string[]>([])
    const walletStore = useStoreState(state => state.walletModel)
    const setWallet = useStoreActions(actions => actions.walletModel.setWallet)
    const availableWallets = useStoreState(state => state.walletModel.availableWallets)
    const setAvailableWallets = useStoreActions(actions => actions.walletModel.setAvailableWallets)
    
    const [connectedAddress, setConnectedAddress] = useState("")
    
    const loadWalletSession = async () => {
        if (walletStore.wallet.connected &&
            walletStore.wallet.name &&
            window.cardano &&
            (await window.cardano[walletStore.wallet.name.toLowerCase()].enable())
        ) {
            walletConnected(walletStore.wallet.name, true)
        }
    }

    const walletConnected = async (wallet: string, connect: boolean) => {
        const lucid = await initLucid(wallet);
        const addr = connect && lucid ? await lucid.wallet.address() : ''
        const walletStoreObj = connect ? { connected: connect, name: wallet, address: addr } : { connected: false, name: '', address: '' }
      
        console.log("Address: "+addr)
        setConnectedAddress(addr)
        setWallet(walletStoreObj)
    }

    const selectWallet = async (wallet: string) => {
        if (window.cardano &&(await window.cardano[wallet.toLocaleLowerCase()].enable())) {
            walletConnected(wallet, true)
        }
    }

    const connectionButtonClick = () => {
        const first_part = connectedAddress.substring(0, 7);
        const last_part = connectedAddress.substring(connectedAddress.length - 5);
    
        return connectedAddress != "" ? first_part +"..."+ last_part : 'Connect'
    }

    useEffect(() => {
        let wallets = []
        if (window.cardano) {
            if (window.cardano.nami) wallets.push('Nami')
            if (window.cardano.eternl) wallets.push('Eternl')
            if (window.cardano.flint) wallets.push('Flint')
            if (window.cardano.yoroi) wallets.push('Yoroi')
            if (window.cardano.lace) wallets.push('Lace')

            loadWalletSession()
        }
        setAvailableWallets(wallets)
    }, [])

    return (
        <>
            <div className="dropdown dropdown-end">
                <label tabIndex={0} className="btn m-1 normal-case">{connectionButtonClick()}</label>
                <ul tabIndex={0} className="dropdown-content menu p-2 shadow bg-base-300 rounded-box w-52">
                    {availableWallets.map((wallet) =>
                        <li key={wallet} onClick={() => { selectWallet(wallet) }} ><a>{wallet}</a></li>
                    )}
                </ul>
            </div>
        </>
    )
}

export default WalletConnect;