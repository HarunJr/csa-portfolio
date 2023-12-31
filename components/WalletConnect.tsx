import { Lucid, Blockfrost, C } from "lucid-cardano";
import { useState, useEffect } from 'react';
import { useStoreActions, useStoreState } from "../utils/store";
import initLucid from "../utils/lucid";

const WalletConnect = () => {
    // const [availableWallets, setAvailableWallets] = useState<string[]>([])
    const walletStore = useStoreState(state => state.wallet)
    const setWallet = useStoreActions(actions => actions.setWallet)
    const availableWallets = useStoreState(state => state.availableWallets)
    const setAvailableWallets = useStoreActions(actions => actions.setAvailableWallets)
    
    const [connectedAddress, setConnectedAddress] = useState("")
    
    const loadWalletSession = async () => {
        if (walletStore.connected &&
            walletStore.name &&
            window.cardano &&
            (await window.cardano[walletStore.name.toLowerCase()].enable())
        ) {
            walletConnected(walletStore.name)
        }
    }

    const walletConnected = async (wallet: string, connect: boolean = true) => {
        const addr = connect ? await (await initLucid(wallet)).wallet.address() : ''
        const walletStoreObj = connect ? { connected: true, name: wallet, address: addr } : { connected: false, name: '', address: '' }
        setConnectedAddress(addr)
        setWallet(walletStoreObj)
    }

    const selectWallet = async (wallet: string) => {
        if (
            window.cardano &&
            (await window.cardano[wallet.toLocaleLowerCase()].enable())
        ) {
            walletConnected(wallet)
        }
    }

    const connectionButtionClick = () => {
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
            loadWalletSession()
        }
        setAvailableWallets(wallets)
    }, [])

    return (
        <>
            <div className="dropdown dropdown-end">
                <label tabIndex={0} className="btn m-1 normal-case">{connectionButtionClick()}</label>
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