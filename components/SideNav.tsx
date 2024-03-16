import Link from 'next/link'
import { useRouter } from 'next/router';
import Buttons from './Buttons';
import { useState } from 'react';

const SideNav = ({ children }: any) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="drawer">
      <input id="my-drawer" type="checkbox" className="drawer-toggle" />
      <div className="drawer-content mx-10 ">
        {/* Page content here */}
        {/* <label htmlFor="my-drawer" className="btn btn-primary drawer-button">Open drawer</label> */}
        {children}
      </div>
      <div className="drawer-side">
        <label htmlFor="my-drawer" aria-label="close sidebar" className="drawer-overlay"></label>
        <ul className="menu p-4 w-80 min-h-full bg-base-200 text-base-content">
          {/* Sidebar content here */}
          <div className='absolute -right-6'>
            <div>
              <label htmlFor="my-drawer" className="btn btn-circle btn-primary">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
              </label>
            </div>

          </div>
          {/* <label htmlFor="my-drawer" className="btn btn-primary drawer-button">Close drawer</label> */}
          <div className='text-[20px] pt-2 px-4 pb-4'>Projects</div>
          <style jsx>{`
            @keyframes pump {
              0% {
                transform: scale(1);
              }
              50% {
                transform: scale(1.05);
              }
              100% {
                transform: scale(1);
              }
            }
            li:active {
              animation: pump 0.3s ease-in-out;
            }
          `}</style>
          <ul className="menu p-2 bg-base-200 text-base-content">
            <Link href="/">
              <li className="p-3 pl-10 hover:bg-blue-100 rounded-lg transform transition duration-500 ease-in-out">Home</li>
            </Link>
            <Link href="/helios">
              <li className="p-3 pl-10 hover:bg-blue-100 rounded-lg transform transition duration-500 ease-in-out">Helios</li>
            </Link>
            <Link href="/mint_cip_25">
              <li className="p-3 pl-10 hover:bg-blue-100 rounded-lg transform transition duration-500 ease-in-out">Mint CIP25</li>
            </Link>
            <Link href="/project">
              <li className="p-3 pl-10 hover:bg-blue-100 rounded-lg transform transition duration-500 ease-in-out">Project</li>
            </Link>
            <Link href="/userspostgres">
              <li className="p-3 pl-10 hover:bg-blue-100 rounded-lg transform transition duration-500 ease-in-out">Users Postgres</li>
            </Link>
            <Link href="/mint_cip_68">
              <li className="p-3 pl-10 hover:bg-blue-100 rounded-lg transform transition duration-500 ease-in-out">Mint CIP68</li>
            </Link>
            <Link href="/connect_swap">
              <li className="p-3 pl-10 hover:bg-blue-100 rounded-lg transform transition duration-500 ease-in-out">Connect Swap</li>
            </Link>
            <li className="p-3 pl-10 hover:bg-blue-100 rounded-lg transform transition duration-500 ease-in-out">Sidebar Item 2</li>
          </ul>
        </ul>
      </div>
    </div>

  );
};

export default SideNav;