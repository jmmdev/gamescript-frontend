import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {IoClose, IoMenu} from 'react-icons/io5';

export default function Header({isDynamic, categories}) {
    let threshold = 0;
    const [opacityRatio, setOpacityRatio] = useState(0);
    const [showMenu, setShowMenu] = useState(false);

    useEffect(() => {
        const menu = document.getElementById("menu");
        if (menu) {
            if (showMenu) {
                menu.classList.remove("translate-x-0", "-translate-y-full", "sm:-translate-x-full", "sm:translate-y-0");
                menu.getElementById("menu").classList.add("translate-x-0", "translate-y-0", "sm:translate-x-0", "sm:translate-y-0");
                return;
            }
            menu.getElementById("menu").classList.remove("translate-x-0", "translate-y-0", "sm:translate-x-0", "sm:translate-y-0");
            menu.getElementById("menu").classList.add("translate-x-0", "-translate-y-full", "sm:-translate-x-full", "sm:translate-y-0");
        }
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
        getData();
        updateLayout()
        return () => {
            window.removeEventListener('scroll', updateOpacity);
            window.removeEventListener('resize', updateLayout);
        }
    }, [])

    const GetCategories = () => {
        const genres = []
        const themes = []

        for (let g of categories.genres) {
            genres.push(
                <Link className="no-underline hover:underline" href={`/genres/${g.slug}/1`}>
                    <p className="text-sm text-white font-medium text-center">{g.name}</p>
                </Link>
            )
        }

        for (let t of categories.themes) {
            themes.push(
                <Link className="no-underline hover:underline" href={`/themes/${t.slug}/1`}>
                    <p className="text-sm text-white font-medium text-center">{t.name}</p>
                </Link>
            )
        }

        return (
            <div>
            <p>Genres</p>
            {genres}
            <p>Themes</p>
            {themes}
            </div>
        )
    }

    return (
        <>
        <div className="flex justify-between items-center h-16 w-full fixed top-0 p-4 z-30" style={{background: isDynamic ? `linear-gradient(180deg, rgba(3,17,18,1) 0%, rgba(17,24,39,${opacityRatio}) 100%)` : "linear-gradient(180deg, rgba(3,17,18,1) 0%, rgba(17,24,39,1) 100%)"}}>
            <div className="w-full flex justify-between items-center gap-1">
                <Link className="relative w-48 aspect-[4.875]" href={{pathname: '/'}}>
                    <Image src={'/assets/logo.png'} fill alt="alt-logo.png" />
                </Link>
                <button className="text-3xl text-gray-300 hover:text-white active:text-gray-400" onClick={() => setShowMenu(!showMenu)}>
                    <IoMenu />
                </button>
            </div>
        </div>
        {categories &&
            <div id="menu" className={`fixed w-full top-0 left-0 duration-200 ease-in-out bg-gray-800 z-40 flex flex-col justify-between items-center gap-4 p-4 sm:w-[14rem] sm:h-screen`}>
                <div className="w-full flex sm:hidden justify-end items-center">
                    <button className="text-3xl text-gray-300 hover:text-white active:text-gray-400" onClick={() => setShowMenu(false)}>
                        <IoClose />
                    </button>
                </div>
                <div className="flex flex-col gap-3">
                    <GetCategories />
                </div>
                <div>
                    Footer
                </div>
            </div>
        }
        </>
    )
}