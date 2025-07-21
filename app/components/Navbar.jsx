"use client"
import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter, usePathname } from 'next/navigation';

function Navbar() {
    const [toggleMenu, setToggleMenu] = useState(false)
    const [loggedIn, setLoggedIn] = useState(false);
    const router = useRouter();
    const pathname = usePathname();

    useEffect(() => {
        if (typeof window !== 'undefined') {
            setLoggedIn(!!localStorage.getItem('session'));
            // Listen for changes to localStorage (e.g., login/logout in other tabs)
            const onStorage = () => {
                setLoggedIn(!!localStorage.getItem('session'));
            };
            window.addEventListener('storage', onStorage);
            return () => window.removeEventListener('storage', onStorage);
        }
    }, [pathname]);

    const handleLogout = () => {
        localStorage.removeItem('session');
        localStorage.removeItem('sessionUser');
        localStorage.removeItem('hideNavbar');
        setLoggedIn(false);
        router.push('/login');
    };

    // if (hide) return null;

    const menuClasses = () => {
        let classes = []
        if (toggleMenu) {
            classes = [
                "flex",
                "absolute",
                "top-[60px]",
                "bg-gray-800",
                "w-full",
                "p-4",
                "left-0",
                "gap-10",
                "flex-col"
            ]
        } else {
            classes = ["hidden", "md:flex"]
        }
        return classes.join(" ")
    }
    return (
        <nav className='bg-gray-800 text-white flex p-4 sm:p-6 md:flex md:justify-between md:items-center'>
            <div className="container mx-auto flex justify-between items-center">
                <a href="/" className="text-2xl font-bold">Test-App</a>
                <div className={menuClasses()}>
                    <Link href="/" className='mx-2 hover:text-gray-300'>
                        Home
                    </Link>
                    <Link href="/about" className='mx-2 hover:text-gray-300'>
                        About
                    </Link>
                    <Link href="/services" className='mx-2 hover:text-gray-300'>
                        Services
                    </Link>
                    <Link href="/contact" className='mx-2 hover:text-gray-300'>
                        Contact
                    </Link>
                    {loggedIn ? (
                        <button onClick={handleLogout} className='mx-2 hover:text-gray-300 bg-transparent border-none outline-none'>
                            Log Out
                        </button>
                    ) : (
                        <Link href="/login" className='mx-2 hover:text-gray-300'>
                            Log In
                        </Link>
                    )}
                </div>
            </div>
            <div className='md:hidden flex items-center'>
                <button onClick={() => setToggleMenu(!toggleMenu)}>
                    {toggleMenu ? <Image src="/close.svg" width={30} height={30} alt="logo" /> : <Image
                        src="/hamburger-menu.svg"
                        width={30}
                        height={30}
                        alt="logo"
                        className="focus:border-none active:border-none"
                    />}
                </button>
            </div>
        </nav >
    )
}

export default Navbar