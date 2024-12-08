import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {IoClose, IoMenu} from 'react-icons/io5';

export default function Header({isDynamic}) {
    let threshold = 0;
    const [opacityRatio, setOpacityRatio] = useState(0);
    const [showMenu, setShowMenu] = useState(false);

    useEffect(() => {
        function updateOpacity() {
            let opacityRatio = window.scrollY / threshold;

            if (opacityRatio > 1)
                opacityRatio = 1;

            setOpacityRatio(opacityRatio);
        }

        function updateLayout() {
            threshold = window.innerWidth * 9 / 16 - 64
        }

        threshold = window.innerWidth * 9 / 16 - 64
        window.addEventListener('scroll', updateOpacity)
        window.addEventListener('resize', updateLayout)
        updateLayout()
        return () => {
            window.removeEventListener('scroll', updateOpacity);
            window.removeEventListener('resize', updateLayout);
        }
    }, [])

    const GetLayout = () => {
        return (
            <div className="w-full flex justify-between items-center gap-1">
                <Link className="relative w-48 aspect-[4.875]" href={{pathname: '/'}}>
                    <Image src={'/assets/logo.png'} fill alt="alt-logo.png" />
                </Link>
                <button className="text-3xl text-gray-300" onClick={() => setShowMenu(!showMenu)}>
                    <IoMenu />
                </button>
            </div>
        )
    }

    /*
    *
    * FULL REWORK
    * 
    */
  
    const GetSideMenu = () => {
        return (
            <div className={`fixed top-0 left-0 h-screen w-full md:w-[250px] ${showMenu ? "grid-rows-1 md:grid-cols-[1fr]" : "grid-rows-none md:grid-cols-[0fr]"} ease-in-out bg-gray-800 z-50 grid gap-4 p-3`}>
                <div className="w-full flex items-center justify-end overflow-hidden">
                    <button className="text-gray-300 hover:text-gray-400 active:text-white" onClick={() => setShowMenu(false)}>
                        <IoClose className="text-2xl" />
                    </button>
                </div>
                <div className="flex flex-col gap-3 overflow-hidden">
                    <Link className="no-underline hover:underline" href={{pathname: '/genres'}}>
                        <p className="text-sm text-white font-medium text-center">Genres</p>
                    </Link>
                    <Link className="no-underline hover:underline" href={{pathname: '/themes'}}>
                        <p className="text-sm text-white font-medium text-center">Themes</p>
                    </Link>
                </div>
                <div className="overflow-hidden">
                    Footer
                </div>
            </div>
        )
        return null;
    }

    return (
        <>
        <div className="flex justify-between items-center h-16 w-full b-1 border-white fixed top-0 p-4 z-30"
        style={{background: isDynamic ? `linear-gradient(0deg, rgba(17,24,39,${opacityRatio}) 0%, rgba(3,7,18,1) 100%)` : `linear-gradient(0deg, rgba(17,24,39,1) 0%, rgba(3,7,18,1) 100%)`}}>
            <GetLayout />
        </div>
        <GetSideMenu />
        </>
    )
}