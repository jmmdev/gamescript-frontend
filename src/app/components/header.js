import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {IoMenu} from 'react-icons/io5';

export default function Header({isDynamic, showMenu, setShowMenu}) {
    let threshold = 0;
    const [opacityRatio, setOpacityRatio] = useState(0);

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

    return (
        <div className="flex justify-between items-center h-16 w-full b-1 border-white fixed top-0 p-4 z-30"
        style={{background: isDynamic ? `linear-gradient(0deg, rgba(17,24,39,${opacityRatio}) 0%, rgba(3,7,18,1) 100%)` : `linear-gradient(0deg, rgba(17,24,39,1) 0%, rgba(3,7,18,1) 100%)`}}>
            <div className="w-full flex justify-between items-center gap-1">
                <Link className="relative w-48 aspect-[4.875]" href={{pathname: '/'}}>
                    <Image src={'/assets/logo.png'} fill alt="alt-logo.png" />
                </Link>
                <button className="text-3xl text-gray-300" onClick={() => setShowMenu(!showMenu)}>
                    <IoMenu />
                </button>
            </div>
        </div>
    )
}