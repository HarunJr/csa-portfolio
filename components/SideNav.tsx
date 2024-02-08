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
          <Link href="/">
            <li><a>Home</a></li>
          </Link>
          <Link href="/helios">
            <li><a>Helios</a></li>
          </Link>
          <Link href="/mint_cip_25">
            <li><a>Mint CIP25</a></li>
          </Link>
          <Link href="/project">
            <li><a>Project</a></li>
          </Link>
          <Link href="/userspostgres">
            <li><a>Users Postgres</a></li>
          </Link>
          <Link href="/mint_cip_68">
            <li><a>Mint CIP68</a></li>
          </Link>
            <li><a>Sidebar Item 2</a></li>
        </ul>
      </div>
    </div>

    );
};

export default SideNav;