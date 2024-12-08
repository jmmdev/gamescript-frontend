import React, { useEffect, useState } from "react";
import styles from '../page.module.css';
import Image from "next/image";
import Link from "next/link";
import {IoMenu} from 'react-icons/io5';

export default function Header({isDynamic}) {
    let threshold = 0;
    const [opacityRatio, setOpacityRatio] = useState(0);

    const [layout, setLayout] = useState(0);
    const [showMenu, setShowMenu] = useState(false);

    useEffect(() => {
        function updateOpacity() {
            let opacityRatio = window.scrollY / threshold;

            if (opacityRatio > 1)
                opacityRatio = 1;

            setOpacityRatio(opacityRatio);
        }

        function updateLayout() {
            setLayout(window.innerWidth >= 380 ? 0 : 1)
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
        if (layout === 1)
            return (
                <div className="w-full flex justify-between items-center gap-1">
                    <Link className="relative w-24 aspect-[4.875]" href={{pathname: '/'}}>
                        <Image src={'/assets/logo.png'} fill alt="alt-logo.png" />
                    </Link>
                    <button className="text-3xl text-gray-300" onClick={() => setShowMenu(!showMenu)}>
                        <IoMenu />
                    </button>
                </div>
            )
        return (
            <div className="flex items-center gap-6">
                <Link className="relative w-48 aspect-[4.875]" href={{pathname: '/'}}>
                    <Image src={'/assets/logo.png'} fill alt="logo.png" />
                </Link>
                <div className="flex gap-4 items-center">
                    <Link className="text-sm text-white font-bold hover:text-[#dd202d]" href={{pathname: '/genres'}}>
                        <p>Genres</p>
                    </Link>
                    <Link className="text-sm text-white font-bold hover:text-[#dd202d]" href={{pathname: '/themes'}}>
                        <p>Themes</p>
                    </Link>
                </div>
            </div>
        )
    }

    /*
    *
    * FULL REWORK
    * 
    */
  
    const GetHeaderMenu = () => {
        if (showMenu) {
            return (
                <div className="fixed top-0 left-0 w-screen h-screen md:w-[200px] bg-gray-800 z-50 flex flex-col justify-center items-center gap-4">
                    <Link className="no-underline" href={{pathname: '/genres'}}>
                        <p className="text-sm text-white font-bold text-center">Genres</p>
                    </Link>
                    <Link className="no-underline" href={{pathname: '/themes'}}>
                        <p className="text-sm text-white font-bold text-center">Themes</p>
                    </Link>
                </div>
            )
        }
        return null;
    }

    return (
        <>
        <div className="flex justify-between items-center h-16 w-full b-1 border-white fixed top-0 p-4 z-30"
        style={{background: isDynamic ? `linear-gradient(0deg, rgba(17,24,39,${opacityRatio}) 0%, rgba(3,7,18,1) 100%)` : `linear-gradient(0deg, rgba(17,24,39,1) 0%, rgba(3,7,18,1) 100%)`}}>
            <GetLayout />
        </div>
        <GetHeaderMenu />
        </>
    )
}