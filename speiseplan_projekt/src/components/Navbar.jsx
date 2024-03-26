'use client'
import React, { useState, useEffect } from 'react';
import { AiOutlineMenu, AiOutlineClose } from 'react-icons/ai';
import { FaUser, FaHamburger, FaShoppingCart } from 'react-icons/fa';
import Link from "next/link";
import { parseCookies } from 'nookies';
import { useRouter } from 'next/navigation';

export default function Navbar() {
  const [nav, setNav] = useState(false);
  const [userName, setUserName] = useState('');
  const Router = useRouter();
  
  useEffect(() => {
    // Read the cookie value once the component mounts on the client side
    const cookies = parseCookies();
    const name = cookies.name;
    if (name) {
      setUserName(name);
    }
  }, []); // Empty dependency array ensures this effect runs only once on mount

  const handleLinkClick = (href) => {
    // Refresh the page
    Router.refresh();
    // Navigate to the desired href after the page is refreshed
    Router.push(href);
  };

  return (
    <div className='max-w-[1640px] mx-auto flex justify-between items-center p-4 text-white'>
      {/* Left side */}
      <div className='flex items-center'>
        <div onClick={() => setNav(!nav)} className='cursor-pointer'>
          <AiOutlineMenu color='black' size={30} />
        </div>
        <Link href={"/"}>
          <h1 className='text-2xl sm:text-3xl lg:text-4xl px-2 border-spacing-1 text-black font-serif'>
            <span className='font-bold font-sans text-green-500'>Kantinerado</span>
          </h1>
        </Link>
        <div className='hidden lg:flex items-center bg-gray-200 rounded-full p-1 text-[16px]'>
          <p className='bg-black text-white rounded-full p-2'>Light</p>
          <p className='p-2 text-black'>Dark</p>
        </div>
      </div>
      {/* Login button */}
      <Link href={"/login"}>
        <button className='bg-black text-white hidden md:flex items-center py-2 rounded-full'>
          <div className='flex items-center m-1'>
            <FaUser className="w-5 h-5"/> {userName ? userName : 'login'}
          </div>
        </button>
      </Link>

      {/* Mobile Menu */}
      {/* Overlay */}
      {nav ? <div className='bg-black/80 fixed w-full h-screen z-10 top-0 left-0'></div> : ''}

      {/* Side drawer menu */}
      <div className={nav ? 'fixed top-0 left-0 w-[300px] h-screen bg-white z-10 duration-300' : 'fixed top-0 left-[-100%] w-[300px] h-screen bg-white z-10 duration-300'}>
        <h2 className='text-2xl p-4'>
          <span className='font-bold text-green-500'>Kantinerado</span>
        </h2>
        <nav>
          <ul className='flex flex-col p-4 text-gray-800'>
            <li className='text-xl py-4 flex'>
              <button className='text-xl py-4 flex transparent-button' onClick={() => handleLinkClick("/profile/cart")}>
                <FaShoppingCart size={25} className='mr-4' /> Shopping Cart
              </button>
            </li>
            <li className='text-xl py-4 flex'>
              <button className='text-xl py-4 flex transparent-button' onClick={() => handleLinkClick("/speiseplan")}>
                <FaHamburger size={25} className='mr-4' /> Speiseplan
              </button>
            </li>
            <li className='text-xl py-4 flex'>
              <button className='text-xl py-4 flex transparent-button' onClick={() => handleLinkClick("/login")}>
                <FaUser size={25} className='mr-4' /> Profil
              </button>
            </li>
            <li>
              <AiOutlineClose
                onClick={() => setNav(!nav)}
                size={30}
                className='absolute right-4 top-4 cursor-pointer'
              />
            </li>
          </ul>
        </nav>
      </div>
    </div>
  );
}
