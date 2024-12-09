import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {IoClose, IoMenu} from 'react-icons/io5';

export default function Header({isDynamic}) {
    const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

    const threshold = useRef(0);
    const showMenuRef = useRef(false);

    const [opacityRatio, setOpacityRatio] = useState(0);
    const [showMenu, setShowMenu] = useState(false);
    const [categories, setCategories] = useState(null);

    useEffect(() => {
        const menu = document.getElementById("menu");
        if (showMenu) {
            if (window.innerWidth < 640) {
                document.body.style.overflowY = "hidden";
            }
            menu.classList.remove("translate-x-0", "-translate-y-full", "sm:-translate-x-full", "sm:translate-y-0");
            menu.classList.add("translate-x-0", "translate-y-0", "sm:translate-x-0", "sm:translate-y-0");
            return;
        }
        document.body.style.overflowY = "auto";
        menu.classList.remove("translate-x-0", "translate-y-0", "sm:translate-x-0", "sm:translate-y-0");
        menu.classList.add("translate-x-0", "-translate-y-full", "sm:-translate-x-full", "sm:translate-y-0");
    }, [showMenu])

    useEffect(() => {
        function updateOpacity() {
            let opacityRatio = window.scrollY / threshold.current;

            if (opacityRatio > 1)
                opacityRatio = 1;

            setOpacityRatio(opacityRatio);
        }

        function updateLayout() {
            threshold.current = window.innerWidth * 9 / 16 - 64;
            if (window.innerWidth < 640) {
                if (showMenuRef.current) {
                    document.body.style.overflowY = "hidden";
                }
                else {
                    document.body.style.overflowY = "auto";
                }
            }
            else {
                document.body.style.overflowY = "auto";
            }
        }

        async function getCategories() {
            try {
                const response = await fetch(`${BASE_URL}/categories`,
                {
                method: 'GET'
                });
                const json = await response.json();
                setCategories(json);
            } catch(e) {
                console.log(e);
                return null;
            }
        }

        getCategories();
        threshold.current = window.innerWidth * 9 / 16 - 64
        window.addEventListener('scroll', updateOpacity);
        window.addEventListener('resize', updateLayout);
        updateLayout();
        return () => {
            window.removeEventListener('scroll', updateOpacity);
            window.removeEventListener('resize', updateLayout);
        }
    }, [])

    const GetCategories = () => {
        const genres = [];
        const themes = [];

        categories.genres.sort((a, b) => {
            return a.name.localeCompare(b.name);
        })

        categories.themes.sort((a, b) => {
            return a.name.localeCompare(b.name);
        })

        for (let g of categories.genres) {
            genres.push(
                <div className="pl-4">
                    <Link className="group w-fit no-underline" href={`/genres/${g.slug}/1`}>
                        <p className="text-sm text-white group-hover:text-[#dd202d]">{g.name}</p>
                    </Link>
                </div>
            )
        }

        for (let t of categories.themes) {
            themes.push(
                <div className="pl-4">
                    <Link className="group w-fit no-underline" href={`/themes/${t.slug}/1`}>
                        <p className="text-sm text-white group-hover:text-[#dd202d]">{t.name}</p>
                    </Link>
                </div>
            )
        }

        return (
            <div className="w-full flex flex-col gap-3 px-8">
                <div className="w-fit flex flex-col gap-3">
                    <p className="text-lg text-white font-bold uppercase">Genres</p>
                    <div className="flex flex-col gap-2">
                        {genres}
                    </div>
                </div>
                <div className="w-fit flex flex-col gap-3">
                    <p className="text-lg text-white font-bold uppercase">Themes</p>
                    <div className="flex flex-col gap-2">
                        {themes}
                    </div>
                </div>
            </div>
        )
    }

    return (
        <>
            <div className="flex justify-between items-center h-16 w-full fixed top-0 p-4 z-30" style={{background: isDynamic ? `linear-gradient(180deg, rgba(9,9,11,1) 0%, rgba(24,24,27,${opacityRatio}) 100%)` : "linear-gradient(180deg, rgba(9,9,11,1) 0%, rgba(24,24,27,1) 100%)"}}>
                <div className="w-full h-full flex justify-between items-center gap-1">
                    <Link className="relative h-full aspect-[4.875]" href={{pathname: '/'}}>
                        <Image src={'/assets/logo.png'} fill alt="alt-logo.png" />
                    </Link>
                    {categories &&
                        <button className={`text-3xl ${showMenu ? "text-[#dd202d]" : "text-zinc-300"} hover:text-white active:text-zinc-400 ${categories ? "block" : "hidden"}`}
                        onClick={() => {
                            showMenuRef.current = !showMenu;
                            setShowMenu(!showMenu);
                        }}>
                            <IoMenu />
                        </button>
                    }
                </div>
            </div>
            <div id="menu" className={`fixed w-full h-screen top-0 left-0 duration-200 ease-in-out bg-zinc-800 z-40 overflow-y-auto flex flex-col justify-between items-center sm:w-fit pb-4 sm:pt-4 translate-x-0 -translate-y-full sm:-translate-x-full sm:translate-y-0 scrollbar ${showMenu ? "visible" : "invisible"}`}>
                <div className="w-full flex sm:hidden justify-end items-center p-4">
                    <button className="text-3xl text-zinc-300 hover:text-white active:text-zinc-400"
                        onClick={() => {
                            showMenuRef.current = false;
                            setShowMenu(false);
                        }}>
                        <IoClose />
                    </button>
                </div>
                {categories && <GetCategories />}
            </div>
        </>
    )
}