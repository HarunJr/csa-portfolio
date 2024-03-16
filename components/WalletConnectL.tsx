'use client'
import { useState, useEffect } from 'react';
import { useStoreActions, useStoreState } from "../utils/store";
import initLucid from "../utils/lucid";
import dynamic from 'next/dynamic';
// import { ConnectWalletButton } from '@cardano-foundation/cardano-connect-with-wallet';
import { toast, ToastContainer } from 'react-toastify';

const ConnectWalletButton = dynamic(
    () =>
        import('@cardano-foundation/cardano-connect-with-wallet').then(
            (mod) => mod.ConnectWalletButton
        ),
    {
        ssr: false,
    }
);

const WalletConnectL = () => {
    const walletStore = useStoreState(state => state.walletModel)
    const setWallet = useStoreActions(actions => actions.walletModel.setWallet)
    const availableWallets = useStoreState(state => state.walletModel.availableWallets)
    const setAvailableWallets = useStoreActions(actions => actions.walletModel.setAvailableWallets)
    const [connectedAddress, setConnectedAddress] = useState("")
    const [connectedWallet, setConnectedWallet] = useState(null);

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

    const loadWalletSession = async () => {
        if (walletStore.wallet.connected &&
            walletStore.wallet.name &&
            window.cardano &&
            (await window.cardano[walletStore.wallet.name.toLowerCase()].enable())
        ) {
            walletConnected(walletStore.wallet.name)
        }
    }

   
    const walletConnected = async (wallet: string, connect: boolean = true) => {

        const lucid = await initLucid(wallet);
        const addr = connect && lucid ? await lucid.wallet.address() : ''
        const walletStoreObj = connect ? { connected: connect, name: wallet, address: addr } : { connected: false, name: '', address: '' }

        console.log("Address: " + addr)
        console.log("Wallet: " + wallet)
        setConnectedAddress(addr)
        setWallet(walletStoreObj)
    }

    const onConnect = (walletName: string) => {
        // Display a toast notification   
        console.log("onConnect: " + walletName)
        toast(`🦄 Wow so easy! Connacted to ${walletName}`, {
            position: 'bottom-left',
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
        });
    };

    enum NetworkType {
        MAINNET = 'mainnet',
        TESTNET = 'testnet',
        // other network types...
      }

    return (

        <div>
            <ToastContainer />

            <ConnectWalletButton
                // onConnect={e => console.log(e)}
                limitNetwork={NetworkType.TESTNET}
                onConnect={walletConnected}
                onConnectError={function noRefCheck() { }}
            // supportedWallets={function noRefCheck() { }}
            />
        </div>
    )
}

export default WalletConnectL;
