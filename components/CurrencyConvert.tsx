'use client'
import React, { useState } from "react";
// import WalletConnect from "./WalletConnect";
import Image from "next/image";
import toggleButton from "./icons/up-and-down-arrow.png";
// import { ConnectWalletButton } from '@cardano-foundation/cardano-connect-with-wallet';
import dynamic from 'next/dynamic'
import WalletConnectL from "./WalletConnectL";

const ConnectWalletButton = dynamic(
    () =>
        import('@cardano-foundation/cardano-connect-with-wallet').then(
            (mod) => mod.ConnectWalletButton
        ),
    {
        ssr: false,
    }
);

const CurrencyConvert = (props : any) => {
    const [topToken, setTopToken] = useState("ADA");
    const [bottomToken, setBottomToken] = useState("SNEK");
    const [amountInput, setAmountInput] = useState("");
    const [isOpenTop, setIsOpenTop] = useState(false);
    const [isOpenBottom, setIsOpenBottom] = useState(false);

    const handleSwapTokens = () => {
        const tempToken = topToken;
        setTopToken(bottomToken);
        setBottomToken(tempToken);
    };

    const handleSelectTop = (value: string) => {
        setTopToken(value);
        setIsOpenTop(false);
    };

    const handleSelectBottom = (value: string) => {
        setBottomToken(value);
        setIsOpenBottom(false);
    };

    return (

/*
  This example requires some changes to your config:
  
  ```
  // tailwind.config.js
  module.exports = {
    // ...
    plugins: [
      // ...
      require('@tailwindcss/forms'),
    ],
  }
  ```
*/
      <div>
        <label htmlFor="price" className="block text-sm font-medium leading-6 text-gray-900">
          Price
        </label>
        <div className="relative mt-2 rounded-md shadow-sm">
        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
            <span className="text-gray-500 sm:text-sm" id="price-currency">
              USD
            </span>
          </div>
          {/* <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
            <span className="text-gray-500 sm:text-sm">$</span>
          </div> */}
          <input
            type="text"
            name="price"
            id="price"
            className="block w-full text-right rounded-md border-0 py-1.5 pl-7 pr-12 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
            placeholder="0.00"
            aria-describedby="price-currency"
          />
        </div>
      </div>
    )
  }

export default CurrencyConvert;
