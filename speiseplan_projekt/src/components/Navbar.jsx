'use client';
import React, { useState, useEffect } from 'react';
import { AiOutlineMenu, AiOutlineClose } from 'react-icons/ai';
import { FaUser, FaHamburger, FaShoppingCart, FaUserShield } from 'react-icons/fa';
import Link from "next/link";
import { parseCookies } from 'nookies';
import { useRouter } from 'next/navigation';

export default function navbar() {
    const [nav, setNav] = useState(false);
    const [userName, setUserName] = useState('');
    const [isAdmin, setIsAdmin] = useState(false);
    const Router = useRouter();

    useEffect(() => {
        // Fetch the username from cookies
        const cookies = parseCookies();
        const name = cookies.name;
        if (name) {
            setUserName(name);
        }

        // Fetch admin status from the API
        async function fetchAdminStatus() {
            try {
                const res = await fetch('/api/checkAdmin');
                const data = await res.json();
                if (data.admin === true) {
                    setIsAdmin(true);
                }
            } catch (err) {
                console.error("Failed to check admin status", err);
            }
        };

        fetchAdminStatus();
    }, []);

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
            </div>

            {/* Login button - always visible, regardless of screen size */}
            <Link href={"/profile"}>
                <button className='bg-black text-white flex items-center py-2 rounded-full'>
                    <div className='flex items-center m-1'>
                        <FaUser className="w-5 h-5"/> {userName ? userName : 'Anmelden'}
                    </div>
                </button>
            </Link>

            {/* Mobile Menu */}
            {nav && <div className='fixed inset-0 bg-black/80 z-20'></div>}

            {/* Sidebar with increased z-index and transform classes for animation */}
            <div className={`fixed top-0 left-0 w-[300px] h-screen bg-white z-30 duration-300 transform ${nav ? 'translate-x-0' : '-translate-x-full'}`}>
                <h2 className='text-2xl p-4'>
                    <span className='font-bold text-green-500'>Kantinerado</span>
                </h2>
                <nav>
                    <ul className='flex flex-col p-4 text-gray-800'>
                        <li className='text-xl py-4 flex'>
                            <Link href={"/profile/cart"}>
                                <button className='text-xl py-4 flex transparent-button'> <FaShoppingCart size={25} className='mr-4' /> Einkaufswagen</button>
                            </Link>
                        </li>
                        <li className='text-xl py-4 flex'>
                            <Link href={"/speiseplan"}>
                                <button className='text-xl py-4 flex transparent-button'> <FaHamburger size={25} className='mr-4' /> Speiseplan</button>
                            </Link>
                        </li>
                        <li className='text-xl py-4 flex'>
                            <Link href={"/profile"}>
                                <button className='text-xl py-4 flex transparent-button'><FaUser size={25} className='mr-4' /> Profil</button>
                            </Link>
                        </li>
                        {isAdmin && (
                            <li className='text-xl py-4 flex'>
                                <Link href={"/admin"}>
                                    <button className='text-xl py-4 flex transparent-button'><FaUserShield size={25} className='mr-4' /> Admin Seite</button> 
                                </Link>
                            </li>
                        )}
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
