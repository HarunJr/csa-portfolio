import React from "react";
import {
  Blockfrost, Lucid, Credential, TxHash, Lovelace, Constr, SpendingValidator, Data, fromText, toText, Unit, MintingPolicy,
  PolicyId, Address, UTxO, applyParamsToScript, Assets, ScriptHash, Redeemer, paymentCredentialOf, KeyHash,
  generatePrivateKey, getAddressDetails, toUnit, Datum
} from 'lucid-cardano'

import { BorrowDatum } from "../utils/backend";

interface DatumCardProps {
  datum : BorrowDatum;
}

const DatumCardComponent: React.FC<DatumCardProps> = ({ datum }) => {
  console.log("DatumCardComponent: ")
  return (
    <div className="bg-white shadow-lg rounded-lg p-2 mb-2 hover:bg-gray-100">
      <div className="text-sm text-gray-600">Borrower Token Name: {toText(datum.borrowersNftTn)}</div>
      <div className="text-lg font-semibold text-gray-800">Borrower: {datum.borrower}</div>
      <div className="text-md text-gray-700">Collateral: {toText(datum.collateral)}</div>
      <div className="text-md text-gray-700">collateralAmnt: {Data.from(datum.collateralAmnt).toString()}</div>
      <div className="text-md text-gray-700">lenderNftTn: {toText(datum.lenderNftTn)}</div>
      <div className="text-md text-gray-700">interest: {Data.from(datum.interest).toString()}</div>
      <div className="text-md text-gray-700">interestAmnt: {Data.from(datum.interestAmnt).toString()}</div>
      <div className="text-md text-gray-700">loan: {toText(datum.loan && datum.loan.loanName)}</div>
      <div className="text-md text-gray-700">loanAmnt: {Data.from(datum.loanAmnt).toString()}</div>
      <div className="text-md text-gray-700">requestExpiration: {new Date(Number(Data.from(datum.requestExpiration))).toLocaleString()}</div>
      <div className="text-md text-gray-700">lendDate: {new Date(Number(Data.from(datum.lendDate))).toLocaleString()}</div>
      {/* Add more fields as needed */}
    </div>
  );
};

export default DatumCardComponent;