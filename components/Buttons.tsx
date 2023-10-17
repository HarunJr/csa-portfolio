import Link from 'next/link'
import WalletConnect from './WalletConnect'
import { useRouter } from 'next/router';

const Buttons = () => {
    return (
    <div>
        <label htmlFor="my-drawer" className="btn btn-circle btn-primary">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
        </label>
    </div>

    );
};

export default Buttons;