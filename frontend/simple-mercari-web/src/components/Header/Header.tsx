import React, { useState, MouseEvent, ChangeEvent } from 'react'
import { useCookies } from "react-cookie";
import { Link } from 'react-router-dom';
import { useAppContext } from '../../contexts/AppContext';
import { useParams, useNavigate } from "react-router-dom";

const SearchIcon = () => <svg className="button-icon" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
  <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
</svg>


export const Header: React.FC = () => {
  const app = useAppContext();
  const [cookies] = useCookies(["name", "userID", "token"]);
  const [name, setName] = useState("")
  const navigate = useNavigate();

  const onLogout = (event: MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    app.logout();
  };
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => setName(e.currentTarget.value)

  return <header className='w-full px-4 flex flex-row justify-between items-center text-theme-100 bg-theme-800'style={{  top: '0' }}>
    <p>
    <b className='text-white'>
        <img 
          src="/logo.png"
          alt="Simple Mercari"
          style={{ height: "120px", width: "auto" ,marginTop: "-10px",position: "absolute", zIndex: 999}} 
          onClick={() => navigate(`/`)}
        />
      </b>
    </p>
    <div className='flex items-center'>
      <input className="input" type="text" placeholder="Search" value={name} onChange={handleChange} /><Link to={`/search?name=${name}`}><SearchIcon /></Link>
      <span className='px-4'>{cookies.token && cookies.name ? `${cookies.name}` : ''}</span>
      {cookies.token && <button className='text-theme-500 hover:text-theme-300' onClick={onLogout}>
        Logout
      </button>}
    </div>
  </header>;
}
