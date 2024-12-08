'use client'
import React, {useEffect, useState} from "react";
import Header from "./components/header";
import GameHighlight from "./components/game-highlight";
import GameScroller from "./components/game-scroller";
import Link from "next/link";
import Footer from "./components/footer";

export default function Home() {
    const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

    const [data, setData] = useState(null);
    const [showMenu, setShowMenu] = useState(false);

    useEffect(() => {
        async function getData() {
            try {
                const response = await fetch(`${BASE_URL}/homeData`,
                {
                method: 'GET'
                });
                const json = await response.json();
                setData(json);
            } catch(e) {
                return null;
            }
        }
        getData();
    }, [])

    const GetScrollerData = ({games, index, title}) => {
        if (data) {
            return <GameScroller scrollerGames={data[games]} scrollerIndex={index} title={title} setShowMenu={setShowMenu} />
        }
        return null;
    }

    const GetSideMenu = () => {
        return (
            <div className={`fixed -top-full left-0 w-full h-screen md:w-[250px] md:top-0 md:left-[-250px] ${showMenu ? "translate-x-0 translate-y-full md:translate-x-full md:translate-y-0" : "translate-x-0 translate-y-0"} transition-all duration-200 ease-linear bg-gray-800 z-20 flex flex-col justify-between items-center gap-4 p-3`}>
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
        )
    }
    
    return (
        <main>
            <Header isDynamic={true} showMenu={showMenu} setShowMenu={setShowMenu} />
            <GetSideMenu />
            <GameHighlight setShowMenu={setShowMenu} />
            <div className="flex flex-col gap-12 pt-12">
                <GetScrollerData games={'mostRecent'} index={0} title={'Latest releases'} />
                <GetScrollerData games={'overallFavorites'} index={1} title={'Prime picks'}/>
                <GetScrollerData games={'userFavorites'} index={2} title={'Fan favorites'} />
                <GetScrollerData games={'criticFavorites'} index={3} title={'Expert selections'}/>
            </div>
            <Footer />
        </main>
    )
}
