import React from 'react'
import { useCookies } from "react-cookie";
import { Link, useLocation } from 'react-router-dom';
import { useAppContext } from '../../contexts/AppContext';
import { classNames } from '../../helper';

export const Header: React.FC = () => {
  const [cookies, _, removeCookie] = useCookies(["userID", "token"]);

  const onLogout = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    event.preventDefault();
    removeCookie("userID");
    removeCookie("token");
  };
  const app = useAppContext()
  const location = useLocation();
  const path: string = location.pathname;
  const navigation: { name: string, href: string, current: boolean }[] = [
//    { name: 'ボード', href: '/', current: path === '/' },
  ]
  return <header className='w-full px-4 flex flex-row justify-between items-center text-theme-100 bg-theme-800'>
    <p>
      <b className='text-white'>Simple Mercari</b>
    </p>
    <div>
      {navigation.map((item) => (
        <Link
          key={item.name}
          to={item.href}
          className={classNames(
            item.current ? 'bg-lime-600 text-white' : 'hover:bg-lime-700 hover:text-white',
            'px-3 py-2 rounded-md text-sm font-medium'
          )}
          aria-current={item.current ? 'page' : undefined}
        >
          {item.name}
        </Link>
      ))}    </div>
    <div>
      <span className='px-4'>{cookies.userID ? `User ID: ${cookies.userID}` : ''}</span>
      {cookies.token && <button className='text-theme-500 hover:text-theme-300' onClick={onLogout}>
        Logout
      </button>}
    </div>
  </header>;
}
