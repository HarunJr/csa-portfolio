import Link from 'next/link'
import WalletConnect from './WalletConnect'
import SideNav from './SideNav';
import NavBar from './NavBar';


const Layout = ({ children }: any) => {
    return (
        <div className="max-width">
            <NavBar />
            <div className="h-screen flex flex-row justify-start">
                <SideNav>{children}</SideNav>
                {/* <div className="bg-white flex-1 p-4 ">
                    {children}
                </div> */}
            </div>
        </div>
    );
};

export default Layout;