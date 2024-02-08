import { createTypedHooks } from 'easy-peasy';
import { Action, action } from 'easy-peasy';
import { createStore, persist } from 'easy-peasy';
import { User, MintData, BorrowDatum } from "../utils/backend";

interface Wallet { connected: boolean, name: string, address: string }
// interface User {  id: number, name: string, email: string}

interface UserModel {
  users: User[];
  setUsers: Action<UserModel, User[]>;
  addUser: Action<UserModel, User>;
  updateUser: Action<UserModel, User>;
  deleteUser: Action<UserModel, number>;
}

interface WalletModel {
  wallet: Wallet;
  setWallet: Action<WalletModel, Wallet>;
  availableWallets: string[]; 
  setAvailableWallets: Action<WalletModel, string[]>; 
}

interface MintDataModel {
  mints: MintData[];
  setMints: Action<MintDataModel, MintData[]>;
  addMint: Action<MintDataModel, MintData>;
  updateMint: Action<MintDataModel, MintData>;
  deleteMint: Action<MintDataModel, number>;
}

interface BorrowDatumModel {
  data: BorrowDatum[];
  setData: Action<BorrowDatumModel, BorrowDatum[]>;
  addData: Action<BorrowDatumModel, BorrowDatum>;
  updateData: Action<BorrowDatumModel, BorrowDatum>;
  deleteData: Action<BorrowDatumModel, number>;
}

interface StoreModel {
  walletModel: WalletModel; 
  user: UserModel;
  mintDataModel: MintDataModel;
  borrowDatumModel: BorrowDatumModel; // new model
  }

const model: StoreModel = {
  walletModel: {
    wallet: { connected: false, name: '', address: '' },
    setWallet: action((state, newWallet) => { state.wallet = newWallet; }),
    availableWallets: [],
    setAvailableWallets: action((state, newAvailableWallets) => { state.availableWallets = newAvailableWallets; }),
  },
  user: {
    users: [],
    setUsers: action((state, newUsers) => { state.users = newUsers }),
    addUser: action((state, newUser) => { state.users.push(newUser) }),
    updateUser: action((state, updatedUser) => {
      const userIndex = state.users.findIndex(user => user.id === updatedUser.id);
      if (userIndex !== -1) {
        state.users[userIndex] = updatedUser;
      }
    }),
  
    deleteUser: action((state, userId) => {
      state.users = state.users.filter(user => user.id !== userId);
    }),
  },
  mintDataModel: {
    mints: [],
    setMints: action((state, newMints) => { state.mints = newMints }),
    addMint: action((state, newMint) => { state.mints.push(newMint) }),
    updateMint: action((state, updatedMint) => {
      const mintIndex = state.mints.findIndex(mint => mint.id === updatedMint.id);
      if (mintIndex !== -1) {
        state.mints[mintIndex] = updatedMint;
      }
    }),
    deleteMint: action((state, mintId) => {
      state.mints = state.mints.filter(mint => mint.id !== mintId);
    }),
  },
  borrowDatumModel: {
    data: [],
    setData: action((state, newData) => { state.data = newData }),
    addData: action((state, newDatum) => { state.data.push(newDatum) }),
    updateData: action((state, updatedDatum) => {
      const datumIndex = state.data.findIndex(datum => datum.id === updatedDatum.id);
      if (datumIndex !== -1) {
        state.data[datumIndex] = updatedDatum;
      }
    }),
    deleteData: action((state, borrowId) => {
      state.data = state.data.filter(datum => datum.id !== borrowId);
    }),
  }
}

const store = createStore(persist(model))
export default store


const { useStoreActions, useStoreState, useStoreDispatch, useStore } = createTypedHooks<StoreModel>()

export {
  useStoreActions,
  useStoreState,
  useStoreDispatch,
  useStore
}