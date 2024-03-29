const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';
import axios from 'axios';
import { useStoreActions, useStoreState } from "./store"

interface Loan {
    loanId: string;
    loanName: string;
  }

export interface BorrowDatum {
    id: number,
    borrowersNftTn: string;
    borrower: string;
    collateral: string;
    collateralAmnt: string;
    lenderNftTn: string;
    interest: string;
    interestAmnt: string;
    loan: Loan;
    loanAmnt: string;
    requestExpiration: string;
    lendDate: string;
}

export interface MintData {
    id: number;
    tokenName: string;
    borrowPolicyId: string; 
    lendPolicyId: string; 
    mintingPolicy: string;
    scriptAddress: string;
    validator: string;
};


interface MintDataResponse {
    mints: MintData;
}

export interface NewMintData {
    tokenName: string;
    borrowPolicyId: string; 
    lendPolicyId: string; 
    mintingPolicy: string;
    scriptAddress: string;
    validator: string;
};

//create MintData
export const createMintData = async (newMintData: NewMintData) => {
    // e.preventDefault();
    try {
        const response = await axios.post<MintDataResponse>(`${apiUrl}/mints`, newMintData);
        const mint: MintData = response.data.mints;
        console.log(`Response Data: ${JSON.stringify(response.data, null, 2)}`);
        console.log(`Mint ID: ${mint.id}`);
        console.log(`Mint TokenName: ${mint.tokenName}`);
        console.log(`Mint BorrowPolicyId: ${mint.borrowPolicyId}`);
        console.log(`Mint LenderPolicyId: ${mint.lendPolicyId}`);
        console.log(`Mint MintingPolicy: ${mint.mintingPolicy}`);
        console.log(`Mint ScriptAddress: ${mint.scriptAddress}`);
        console.log(`Mint Validator: ${mint.validator}`);
        return mint;
    } catch (error) {
        console.error('BackendResponse: Error creating mint:', error);
    }
}

//fetch users
export const getMintData = async () => {
    console.log(`getMintData Mint : `);
    var mintsInfo: MintData[] = [] // Specify that usersInfo is an array of Users

    try {
        const response = await axios.get(`${apiUrl}/mints`);
        const mints: MintData[] = response.data['mints'] || [];
        console.log(`getMintData mints : ` + mints.length);
        if (mints.length > 0) {
            mintsInfo = mints.reverse();
            mintsInfo.forEach(mint => {
                console.log(`getMintData Mint Id: ${mint.id}`);
                console.log(`getMintData Mint TokenName: ${mint.tokenName}`);
                console.log(`Mint BorrowPolicyId: ${mint.borrowPolicyId}`);
                console.log(`Mint LenderPolicyId: ${mint.lendPolicyId}`);
                console.log(`Mint MintingPolicy: ${mint.mintingPolicy}`);
                console.log(`Mint ScriptAddress: ${mint.scriptAddress}`);
                console.log(`Mint Validator: ${mint.validator}`);

            });
        }
    } catch (error) {
        console.error('BackendResponse: Error fetching data:', error);
    }
    return { mintsInfo }
}

// Delete MintData
export const deleteMintData = async (mintId: number) => {
    try {
        const response = await axios.delete<MintDataResponse>(`${apiUrl}/users/${mintId}`);
        const mint: MintData = response.data.mints;
        console.log(`deleteMintData TokenName: ${mint.tokenName}`);
        console.log(`deleteMintData Mint TokenName: ${mint.tokenName}`);
        console.log(`deleteMintData BorrowPolicyId: ${mint.borrowPolicyId}`);
        console.log(`deleteMintData LenderPolicyId: ${mint.lendPolicyId}`);
        console.log(`deleteMintData MintingPolicy: ${mint.mintingPolicy}`);
        console.log(`deleteMintData ScriptAddress: ${mint.scriptAddress}`);
        console.log(`deleteMintData Validator: ${mint.validator}`);

        return mint;
    } catch (error) {
        console.error('BackendResponse: Error deleting mint:', error);
    }
}

export interface User {
    id: number;
    name: string;
    email: string;
}

interface UserResponse {
    users: User;
}

export interface NewUser {
    name: string;
    email: string;
}

export const getBackendMessage = async () => {
    var messageInfo = { message: "No message", people: [] }
    const data = await fetch("http://localhost:8000/api/home")
        .then(res => res.json());
    console.log("BackendData: " + data)
    if (data?.error) {
        // Handle error.
        console.log("BackendData: error no data")
    }
    const msg = data['message'] || [];
    const ppl = data['people'] || [];
    console.log("BackendData: msg: " + msg + " People: ", ppl)
    // console.log("BackendData: msg..: "+ data.message+" People: ", data.people)
    messageInfo.message = msg;
    messageInfo.people = ppl;
    console.log("BackendData: messageInfo: " + messageInfo)
    return { messageInfo }
}

//fetch users
export const getBackendUsers = async () => {
    var usersInfo: User[] = [] // Specify that usersInfo is an array of Users

    try {
        const response = await axios.get(`${apiUrl}/users`);
        const users: User[] = response.data['users'] || [];
        if (users.length > 0) {
            usersInfo = users.reverse();
            usersInfo.forEach(user => {
                console.log(`User ID: ${user.id}`);
                console.log(`User Name: ${user.name}`);
                console.log(`User Email: ${user.email}`);

            });
        }
    } catch (error) {
        console.error('BackendResponse: Error fetching data:', error);
    }
    return { usersInfo }
}

//create user
export const createUser = async (newUser: NewUser, e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
        const response = await axios.post<UserResponse>(`${apiUrl}/users`, newUser);
        const user: User = response.data.users;
        console.log(`Response Data: ${JSON.stringify(response.data, null, 2)}`);
        console.log(`User ID: ${user.id}`);
        console.log(`User Name: ${user.name}`);
        console.log(`User Email: ${user.email}`);
        return user;
    } catch (error) {
        console.error('BackendResponse: Error creating user:', error);
    }
}

// Update User
export const updateUser = async (userToUpdate: User, e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
        const response = await axios.put<UserResponse>(`${apiUrl}/users/${userToUpdate.id}`, userToUpdate);
        const user: User = response.data.users;
        console.log(`Updated User ID: ${user.id}`);
        console.log(`Updated User Name: ${user.name}`);
        console.log(`Updated User Email: ${user.email}`);
        return user;
    } catch (error) {
        console.error('BackendResponse: Error updating user:', error);
    }
}

// Delete User
export const deleteUser = async (userId: number) => {
    try {
        const response = await axios.delete<UserResponse>(`${apiUrl}/users/${userId}`);
        const user: User = response.data.users;
        console.log(`Deleted User ID: ${user.id}`);
        console.log(`Deleted User Name: ${user.name}`);
        console.log(`Deleted User Email: ${user.email}`);

        return user;
    } catch (error) {
        console.error('BackendResponse: Error deleting user:', error);
    }
}

export interface Pair {
    amount: number;
    base: string;
    currency: string;
}

interface PairResponse {
    pairs: Pair;
}

// https://docs.cloud.coinbase.com/sign-in-with-coinbase/docs/api-prices
export const getCardanoBuyPairs = async (pair: string) => {
    const response = await fetch(`https://api.coinbase.com/v2/prices/${pair}/buy`)
        .then(res => res.json());
    console.log("getCardanoBuyPairs: " + JSON.stringify(response))

    const resPair: Pair = response.data;
    console.log(`Buy Pair amount:    ${resPair.amount}`);
    console.log(`Buy Pair base :     ${resPair.base}`);
    console.log(`Buy Pair currency : ${resPair.currency}`);

    return { resPair }
}

export const getCardanoSellPairs = async (pair: string) => {
    const response = await fetch(`https://api.coinbase.com/v2/prices/${pair}/sell`)
        .then(res => res.json());
    console.log("getCardanoSellPairs: " + JSON.stringify(response))

    const resPair: Pair = response.data;
    console.log(`Sell Pair amount:    ${resPair.amount}`);
    console.log(`Sell Pair base :     ${resPair.base}`);
    console.log(`Sell Pair currency : ${resPair.currency}`);

    return { resPair }
}



