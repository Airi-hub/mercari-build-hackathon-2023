import React, { useState, MouseEvent, ChangeEvent } from 'react'
import { useCookies } from "react-cookie";
import { Link, useLocation } from 'react-router-dom';
import { useAppContext } from '../../contexts/AppContext';
import { classNames } from '../../helper';

const SearchIcon = () => <svg className="button-icon" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
  <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
</svg>


export const Header: React.FC = () => {
  const app = useAppContext();
  const [cookies, _, removeCookie] = useCookies(["name", "userID", "token"]);
  const [name, setName] = useState("")

  const onLogout = (event: MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    app.logout();
  };
  const location = useLocation();
  const path: string = location.pathname;
  const navigation: { name: string, href: string, current: boolean }[] = [
//    { name: 'ボード', href: '/', current: path === '/' },
  ]
  const handleChange = (e:ChangeEvent<HTMLInputElement>) => setName(e.currentTarget.value)

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
            item.current ? 'bg-theme-600 text-white' : 'hover:bg-theme-700 hover:text-white',
            'px-3 py-2 rounded-md text-sm font-medium'
          )}
          aria-current={item.current ? 'page' : undefined}
        >
          {item.name}
        </Link>
      ))}    </div>
    <div className='flex items-center'>
      <input className="input" type="text" value={name} onChange={handleChange} /><Link to={`/search/${name}`}><SearchIcon /></Link>
      <span className='px-4'>{cookies.token && cookies.name ? `${cookies.name}` : ''}</span>
      {cookies.token && <button className='text-theme-500 hover:text-theme-300' onClick={onLogout}>
        Logout
      </button>}
    </div>
  </header>;
}
