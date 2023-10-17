import Link from 'next/link'
import WalletConnect from './WalletConnect'

const NavBar = () => {
    return (
    <nav className="navbar px-5 bg-white shadow-md">
        <div className="flex-1">
            <Link href="/" className="btn btn-ghost normal-case text-xl">Cardano</Link>
        </div>
        <div className="flex-none">
            <WalletConnect />
        </div>
    </nav>

    );
};

export default NavBar;