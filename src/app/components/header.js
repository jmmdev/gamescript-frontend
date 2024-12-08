import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {IoMenu} from 'react-icons/io5';

export default function Header({isDynamic}) {
    let threshold = 0;
    const [opacityRatio, setOpacityRatio] = useState(0);
    const [showMenu, setShowMenu] = useState(false);

    useEffect(() => {
        if (showMenu) {
            document.getElementById("menu").classList.remove("translate-x-0", "-translate-y-full", "sm:-translate-x-full", "sm:translate-y-0");
            document.getElementById("menu").classList.add("translate-x-0", "translate-y-0", "sm:translate-x-0", "sm:translate-y-0");
            return;
        }
        document.getElementById("menu").classList.remove("translate-x-0", "translate-y-0", "sm:translate-x-0", "sm:translate-y-0");
        document.getElementById("menu").classList.add("translate-x-0", "-translate-y-full", "sm:-translate-x-full", "sm:translate-y-0");
    }, [showMenu])

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

    function getHeaderDynamicBackground() {
        if (isDynamic)
            return `bg-gradient-to-t from-[rgba(17,24,39,${opacityRatio}] to-gray-950`
        return "bg-gradient-to-t from-gray-900 to-gray-950"
    } 

    return (
        <>
        <div className={`flex justify-between items-center h-16 w-full b-1 border-white fixed top-0 p-4 z-30
            ${
                showMenu
                    ? "bg-gradient-to-t from-gray-800 to-gray-800" 
                    : getHeaderDynamicBackground()
            }
            sm:${getHeaderDynamicBackground()}
        `}>
            <div className="w-full flex justify-between items-center gap-1">
                <Link className="relative w-48 aspect-[4.875]" href={{pathname: '/'}}>
                    <Image src={'/assets/logo.png'} fill alt="alt-logo.png" />
                </Link>
                <button className="text-3xl text-gray-300 hover:text-white active:text-gray-400" onClick={() => setShowMenu(!showMenu)}>
                    <IoMenu />
                </button>
            </div>
        </div>
        <div id="menu" className={`fixed w-full top-0 left-0 duration-200 ease-in-out bg-gray-800 z-40 flex flex-col justify-between items-center gap-4 p-4 pt-20 sm:w-[14rem] sm:h-screen`}>
            <div className="flex flex-col gap-3">
                <Link className="no-underline hover:underline" href={{pathname: '/genres'}}>
                    <p className="text-sm text-white font-medium text-center">Genres</p>
                </Link>
                <Link className="no-underline hover:underline" href={{pathname: '/themes'}}>
                    <p className="text-sm text-white font-medium text-center">Themes</p>
                </Link>
            </div>
            <div>
                Footer
            </div>
        </div>
        </>
    )
}