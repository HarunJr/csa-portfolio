'use client'
import React, { useState, useEffect } from "react";
import { Lucid } from 'lucid-cardano'
import Image from "next/image";
import toggleButton from "./icons/up-and-down-arrow.png";
// import { ConnectWalletButton } from '@cardano-foundation/cardano-connect-with-wallet';
import dynamic from 'next/dynamic'
import WalletConnectL from "./WalletConnectL";
import CurrencyConvert from "./CurrencyConvert";
import { getAssets } from "../utils/cardano";
import { useStoreActions, useStoreState } from "../utils/store"
import initLucid from '../utils/lucid'
import { getCardanoBuyPairs, getCardanoSellPairs } from "../utils/backend";
import Buttons from "./Buttons";

const CoinSwap = () => {
    interface Token {
        tokenAsset: string;
        policy_id: string;
        assetName: string;
        assetQuant: number;
    }

    const tempList: Token[] = [
        { tokenAsset: "fiat", policy_id: "", assetName: "USD", assetQuant: 0 },
        { tokenAsset: "fiat", policy_id: "", assetName: "KES", assetQuant: 0 },
        { tokenAsset: "fiat", policy_id: "", assetName: "EUR", assetQuant: 0 },
        { tokenAsset: "fiat", policy_id: "", assetName: "JPY", assetQuant: 0 },
    ];

    const [lucid, setLucid] = useState<Lucid>()
    const walletStore = useStoreState((state: any) => state.walletModel.wallet)
    const [topToken, setTopToken] = useState<Token>({ tokenAsset: "", policy_id: "", assetName: "ADA", assetQuant: 0 });

    const [bottomToken, setBottomToken] = useState<Token>({ tokenAsset: "", policy_id: "", assetName: "KES", assetQuant: 0 });
    const [amountInput, setAmountInput] = useState("");
    const [bottomAmountInput, setBottomAmountInput] = useState("");
    const [isOpenTop, setIsOpenTop] = useState(false);
    const [isOpenBottom, setIsOpenBottom] = useState(false);
    const [isLoading, setIsLoading] = useState(true)
    const [balance, setBalance] = useState()
    const [topTokenList, setTopTokenList] = useState<Token[]>([]);
    const [bottomTokenList, setBottomTokenList] = useState<Token[]>([]);
    const [isSwapping, setIsSwapping] = useState(false);
    const [showInputField, setShowInputField] = useState(false);
    const [showCloseButton, setShowCloseButton] = useState(false);
    const [isTopFiat, setIsTopFiat] = useState(false);
    // const [isLoadingTop, setIsLoadingTop] = useState(false);
    // const [isLoadingBottom, setIsLoadingBottom] = useState(false);

    useEffect(() => {
        if (lucid) {
            setIsLoading(true);
            getAssets(walletStore.address)
                .then((res: any) => {
                    setTopTokenList(res.addressInfo.tokens),
                        setBalance(res.addressInfo.balance),
                        setBottomTokenList(tempList),
                        setIsLoading(false)
                })

        } else {
            // setIsLoading(true)
            initLucid(walletStore.name).then((Lucid: Lucid | undefined) => { setLucid(Lucid) })
            // setIsLoading(false)
        }


    }, [lucid]);

    useEffect(() => {

        if (topTokenList.length > 0 && bottomTokenList.length > 0) {
            let topItem = topTokenList[0].assetName;
            const topQuantity = topTokenList[0].assetQuant;
            let bottomItem = bottomTokenList[0].assetName;
            const bottomQuant = bottomTokenList[0].assetQuant;
            console.log("First Item: ", topItem);

            setTopToken({ tokenAsset: "", policy_id: "", assetName: topItem, assetQuant: topQuantity });
            setBottomToken({ tokenAsset: "", policy_id: "", assetName: bottomItem, assetQuant: bottomQuant });

            const isAllTopFiat = topTokenList.every(token => token.tokenAsset === 'fiat');

            topItem = topItem === "Djed_testMicroUSD" ? "Djed" : topItem;
            bottomItem = bottomItem === "Djed_testMicroUSD" ? "Djed" : bottomItem;

            const pair = topItem.toUpperCase() + "-" + bottomItem.toUpperCase();

            if (isAllTopFiat) {
                console.log('All tokens in the list are of type fiat');
                setIsTopFiat(true);
                getCardanoBuyPairs(pair).then(handlePairResponse);
            } else {
                console.log('Not all tokens in the list are of type fiat');
                setIsTopFiat(false);
                getCardanoSellPairs(pair).then(handlePairResponse);
            }


        }
    }, [topTokenList, bottomTokenList, amountInput]);

    // if (isLoading) {
    //     return <div>Loading...</div> // Render a loading message while fetching data
    // }

    const handlePairResponse = (res: any) => {
        const buyAmount = res.resPair.amount;
        const bottomValue = Number(amountInput) * buyAmount;
        const tempBottomAmountInput = bottomValue > 0 ? Number(bottomValue).toFixed(6) : '';
        setBottomAmountInput(String(tempBottomAmountInput));
    };


    const handleSwapTokens = () => {
        const tempToken = topToken;
        setTopToken(bottomToken);
        setBottomToken(tempToken);

        setTopTokenList(bottomTokenList)
        setBottomTokenList(topTokenList)

        let tempAmountInput = ''
        const topValue = Number(amountInput);
        if (topValue > 0) {
            tempAmountInput = Number(amountInput).toFixed(6); // Format to 6 decimal places
            setBottomAmountInput(tempAmountInput);
        } else {
            setBottomAmountInput(tempAmountInput);
        }

        let tempBottomAmountInput = ''
        const bottomValue = Number(bottomAmountInput);

        if (bottomValue > 0) {
            tempBottomAmountInput = Number(bottomAmountInput).toFixed(6); // Format to 6 decimal places
            setAmountInput(tempBottomAmountInput);

        } else {
            setAmountInput(tempBottomAmountInput);
        }
    };

    const moveSelectedTokenToTop = (list: Token[], selectedToken: Token) => {
        const newList = list.filter(token => token.assetName !== selectedToken.assetName);
        newList.unshift(selectedToken);
        return newList;
    };

    const handleSelectTop = (token: Token) => {
        setTopToken(token);
        const newList = moveSelectedTokenToTop(topTokenList, token);
        setTopTokenList(newList);
        setIsOpenTop(false);
    };

    const handleSelectBottom = (token: Token) => {
        setBottomToken(token);
        const newList = moveSelectedTokenToTop(bottomTokenList, token);
        setBottomTokenList(newList);
        setIsOpenBottom(false);
    };
    const handleProceedClicked = () => {
        setShowInputField(true);
        setShowCloseButton(true);
    };

    const handleCloseButtonClicked = () => {
        setShowInputField(false);
        setShowCloseButton(false);
    };

    return (
        <div className="flex justify-center items-center">
            <div className="card w-[30rem] bg-base-100 shadow-lg">
                <div className="pt-10 w-full max-w-ms px-4">
                    <div className="flex justify-evenly flex-none pt-10 relative">
                        <div className="relative w-full max-w-ms">
                            <div className="absolute left-0 pl-3 pt-1 text-sm text-gray-500">You pay</div> {/* Add this line */}
                            <span onClick={() => setIsOpenTop(!isOpenTop)} className="absolute inset-y-0 left-0 cursor-pointer flex items-center pl-3 text-xl transform transition-transform duration-150 hover:scale-110 active:scale-95">{isLoading ? "Loading..." : topToken.assetName}
                                {isLoading ? null :
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="h-6 w-6 ml-2">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                    </svg>
                                }
                            </span>
                            <input
                                className="input input-bordered w-full text-right pl-20 h-24 border-gray-600 text-xl focus:outline-none focus:border-gray-800 focus:border-2"
                                type="number"
                                min={0}
                                placeholder={isLoading ? "Loading..." : "0.0"}
                                value={amountInput}
                                // onChange={handleInputChange}
                                onChange={e => setAmountInput(e.target.value)}
                            />

                            <div className="absolute inset-y-0 right-0 pr-3 text-sm text-gray-500 flex items-center pt-12 pointer-events-none">
                                {isLoading ? "Loading..." : `Balance: ${topToken.assetQuant ? Number(topToken.assetQuant).toFixed(2) : '0.0'}`}
                            </div>
                        </div>
                        <div className={`absolute top-full left-0 bg-white border border-gray-200 w-full z-10 ${isOpenTop ? '' : 'hidden'}`}>
                            {topTokenList.map((token: Token, index: number) => (
                                <p key={index} className="p-2 cursor-pointer hover:bg-gray-200" onClick={() => handleSelectTop(token)}>
                                    {token.assetName}
                                </p>
                            ))}
                        </div>
                    </div>

                    {/* Add the image here */}
                    <div className="relative items-center flex justify-center -mt-3 -mb-3">
                        <button className="flex transform transition-transform duration-150 hover:scale-110 active:scale-95 bg-white z-20" onClick={handleSwapTokens}>
                            <Image className="p-0" src={toggleButton} alt="Swap Icon" width={35} height={35} />
                        </button>
                    </div>

                    <div className="flex justify-evenly relative">
                        <div className="relative w-full max-w-ms">
                            <div className="absolute left-0 pl-3 pt-1 text-sm text-gray-500">You receive</div> {/* Add this line */}
                            <span onClick={() => setIsOpenBottom(!isOpenBottom)} 
                            className="absolute inset-y-0 left-0 cursor-pointer flex items-center pl-3 text-xl transform transition-transform duration-150 hover:scale-110 active:scale-95">
                                {isLoading ? "Loading..." : bottomToken.assetName}
                                {isLoading ? null :
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="h-6 w-6 ml-2">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                    </svg>
                                }
                            </span>
                            <input
                                className="input input-bordered w-full text-right pl-20 h-24 border-gray-600 text-xl focus:outline-none focus:border-gray-800 focus:border-2"                                // inputMode="numeric"
                                type="number"
                                min={0}
                                placeholder={isLoading ? "Loading..." : "0.0"}
                                value={bottomAmountInput}
                                readOnly
                            // onChange={e => setAmountInput(e.target.value)}
                            />
                            <div className="absolute inset-y-0 right-0 pr-3 text-sm text-gray-500 flex items-center pt-12">
                            {isLoading ? "Loading..." : `Balance: ${bottomToken.assetQuant ? Number(bottomToken.assetQuant).toFixed(2) : '0.0'}`}</div>

                        </div>
                        <div className={`absolute top-full left-0 bg-white border border-gray-200 w-full z-10 ${isOpenBottom ? '' : 'hidden'}`}>
                            {bottomTokenList.map((token: Token, index: number) => (
                                <p key={index} className="p-2 cursor-pointer hover:bg-gray-200" onClick={() => handleSelectBottom(token)}>
                                    {token.assetName}
                                </p>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="card-body items-center text-center">
                    {showCloseButton && (
                        <div className="w-full flex justify-between items-center">
                            <span className="text-sm">You get {bottomAmountInput} {bottomToken.assetName} for {amountInput} {topToken.assetName}</span>
                            <button className="flex transform transition-transform duration-150 hover:scale-125 active:scale-95" onClick={handleCloseButtonClicked}>
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="h-6 w-6">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>
                    )}
                    {/* Conditionally render the input field */}
                    {showInputField && (
                        isTopFiat ?
                            <input
                                className="input input-bordered w-[450px] text-left h-10 border-gray-600 text-base my-2 mb-6 focus:outline-none focus:border-gray-800 focus:border-2"
                                type="text"
                                placeholder="Enter wallet address"
                            />
                            :
                            <input
                                className="input input-bordered w-[450px] text-left h-10 border-gray-600 text-base my-2 mb-6 focus:outline-none focus:border-gray-800 focus:border-2"
                                type="email"
                                placeholder="Enter email"
                            />
                    )}

                    <button className="btn btn-primary w-[430px] h-[60px] normal-case text-xl flex transform transition-transform duration-150 hover:scale-105 active:scale-95" onClick={handleProceedClicked}>
                        {isTopFiat ? `Buy ${bottomToken.assetName}` : `Sell ${topToken.assetName}`}
                    </button>
                </div>
            </div>
        </div>

    );
}

export default CoinSwap;
