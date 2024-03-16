import React from "react";

function SwapCoin() {
  const [topToken, setTopToken] = React.useState("ADA");
  const [bottomToken, setBottomToken] = React.useState("SNEK");

  const handleSwapTokens = () => {
    const tempToken = topToken;
    setTopToken(bottomToken);
    setBottomToken(tempToken);
  };

  return (
    <div className="flex justify-center items-center h-screen">
      <div className="bg-gray-100 p-8 rounded-lg shadow-md max-w-md mx-auto">
        {/* Swap Tabs */}
        <div className="flex justify-between border-b border-gray-200 pb-4">
          <button className="text-gray-700 font-bold px-4 py-2 rounded-lg active:text-blue-500 active:border-blue-500">
            Market
          </button>
          <button className="text-gray-500 font-bold px-4 py-2 rounded-lg hover:text-gray-700">
            Limit
          </button>
          <button className="text-gray-500 font-bold px-4 py-2 rounded-lg hover:text-gray-700">
            DCA
          </button>
        </div>

        {/* Swap Details */}
        <div className="flex flex-col mt-4">
          <div className="text-gray-700 font-bold mb-2">You Pay</div>
          <div className="flex items-center mb-4">
            <input
              type="number"
              className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:border-blue-500"
              placeholder="0.00"
            />
            <span className="ml-2 text-gray-500">{topToken}</span>
            <div className="flex ml-auto items-center">
              <span className="text-gray-500 text-sm">Balance: 0</span>
              <button className="ml-2 text-blue-500 font-bold">MAX</button>
            </div>
          </div>

          {/* Toggle Button */}
          <button
            className="mt-4 text-blue-500 font-bold rounded-full hover:bg-blue-200 p-2 mx-auto flex items-center justify-center"
            onClick={handleSwapTokens}
          >
            <svg
              className="w-4 h-4 fill-current"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                d="M5 10a1 1 0 011-1h8a1 1 0 110 2H6a1 1 0 01-1-1zM5 5a1 1 0 011-1h8a1 1 0 110 2H6a1 1 0 01-1-1z"
                clipRule="evenodd"
              />
            </svg>
          </button>

          <div className="text-gray-700 font-bold mb-2">You Receive</div>
          <div className="flex items-center">
            <input
              type="number"
              className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:border-blue-500"
              placeholder="0.00"
            />
            <span className="ml-2 text-gray-500">{bottomToken}</span>
            <div className="flex ml-auto items-center">
              <span className="text-gray-500 text-sm">Balance: 0</span>
            </div>
          </div>
        </div>

        {/* Swap Button */}
        <button className="mt-8 bg-blue-500 text-white font-bold py-2 rounded-lg hover:bg-blue-700 disabled:bg-gray-500 cursor-pointer disabled:cursor-not-allowed">
          Swap
        </button>
      </div>
    </div>
  );
}

export default SwapCoin;
