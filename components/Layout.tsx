import Link from 'next/link'
import SideNav from './SideNav';
import NavBar from './NavBar';


const Layout = ({ children }: any) => {
    return (
        <div className="max-width">
            <div className="h-screen flex flex-col justify-start">
                <NavBar />
                <SideNav>{children}</SideNav>
                {/* <div className="bg-white flex-1 p-4 ">
                    {children}
                </div> */}
            </div>
        </div>
    );
};

export default Layout;