'use client'
import React, {useEffect, useState} from "react";
import Header from "../../components/header";
import { useParams } from "next/navigation";
import styles from './page.module.css';
import Image from "next/image";
import ShowGameDetails from "@/app/components/show-game-details";
import {LuChevronFirst, LuChevronLast} from 'react-icons/lu';
import Link from 'next/link';

export default function Home() {
    const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

    const [genre, setGenre] = useState(null);
    const [games, setGames] = useState(null);
    const [coverWidth, setCoverWidth] = useState(null)
    const [showGameDetails, setShowGameDetails] = useState({show: false, value: null});
    const [actualPage, setActualPage] = useState(0);
    const params = useParams();

    useEffect(() => {
        async function getGenre() {
            try {
                const response = await fetch(`${BASE_URL}/genre/${params.slug[0]}`,
                {
                    method: 'GET'
                });
                const json = await response.json();
                setGenre(json)
            } catch(e) {
                console.log(e.message);
            }
        }

        function getCoverwidth() {
            setCoverWidth(window.innerWidth);
        }

        
        document.body.style.overflowY = "auto";
        getGenre();
        window.addEventListener('resize', getCoverwidth);
        getCoverwidth();

        return () => window.removeEventListener('resize', getCoverwidth)
    }, [])

    useEffect(() => {
        async function getGenreGames() {
            try {
                const response = await fetch(`${BASE_URL}/gamesByGenre/${genre._id}/page/${params.slug[1]}`,
                {
                    method: 'GET'
                });
                const games = await response.json();
                
                for (let g of games.games) {
                    const cover = await fetch(`${BASE_URL}/coverByGameId/${g.cover}`, {method: 'GET'});
                    const coverObj = await cover.json();
                    g.cover = coverObj;
                }
                setGames(games);
                setActualPage(params.slug[1] - 1);
            
            } catch(e) {
                console.log(e.message);
            }
        }
        if (genre !== null)
            getGenreGames()
    }, [genre])

    const GetGenreGames = () => {
        if (games !== null && games.games.length > 0) {
            const gameComps = [];
            for (let [index, g] of games.games.entries()) {
                gameComps.push( 
                    <button key={g._id} className="group flex items-center text-left gap-2" onClick={() => {
                        document.body.style.overflowY = 'hidden';
                        setShowGameDetails({show: true, value: index});
                    }}>
                        <div className="relative aspect-[0.75]" style={{height: Math.max(coverWidth * 0.05, 64) / 0.75}}>
                            <Image loading="lazy" src={`https://images.igdb.com/igdb/image/upload/t_cover_big_2x/${g.cover.image_id}.jpg`} fill sizes="100%" alt="cover.jpg" priority />
                        </div>
                        <div className="flex flex-col gap-2 text-white">
                            <p className="text-xl sm:text-3xl line-clamp-1 font-bold group-hover:text-[#dd202d]">{g.name}</p>
                            <p className="line-clamp-2">{g.summary}</p>
                        </div>
                    </button>
                )
            }
            return (
                <div className="flex flex-col justify-between gap-8" style={{minHeight: window.innerHeight - 64 - Math.max(window.innerWidth * 0.01, 8) - 2 * Math.max(24, window.innerWidth * 0.022)}}>
                    <div className="flex flex-col gap-8">
                        {gameComps}
                    </div>
                    <div className="flex justify-center py-8 justify-self-end">
                        <div className="w-fit flex gap-2">
                            <GetPages />
                        </div>
                    </div>
                </div>
            );
        }

        const loadingComps = [];
        const headerHeight = Math.max(21, window.innerWidth * 0.018);
        const descHeight = Math.max(14, window.innerWidth * 0.012);
        
        for (let i=0; i<15; i++) {
            loadingComps.push(
                <div key={i} className="relative flex items-center text-left gap-2">
                    <div className={`relative aspect-[0.75] bg-white h-[${Math.max(coverWidth * 0.05, 64) / 0.75}px]`} />
                    <div className="w-full flex flex-col gap-2 text-white">
                        <p className={`w-2/5 h-[${headerHeight}px] bg-white rounded-full`}/>
                        <p className={`w-full h-[${descHeight}px] bg-white rounded-full`}/>
                        <p className={`w-full h-[${descHeight}px] bg-white rounded-full`}/>
                    </div>
                </div>
            )
        }
        return (
            <div className="flex flex-col gap-8 justify-between">
                {loadingComps}
            </div>
        );
    }

    const GetPageButton = ({key, index, numPages, content, isFirst, isLast, href}) => {
        return (
            <Link key={key} className={`w-8 h-8 justify-center items-center rounded-full border-2 border-white text-white font-semibold text-center no-underline
                ${isFirst 
                    ? actualPage !== 0 
                        ? "flex" 
                        : "hidden"
                    : isLast
                        ? actualPage !== numPages - 1
                            ? "flex"
                            : "hidden"
                        : (index >= actualPage-1 && index <= actualPage+1 ? "flex" : "hidden") (actualPage === index ? "bg-[#dd202d]" : "bg-[#dd202d80]")
                }`} 
            href={href}>
                {content}
            </Link>
        )
    }

    const GetPages = () => {
        if (games !== null && games.games.length > 0) {
            let numPages = games.totalPages;

            const selector = [];

            selector.push(
                <GetPageButton key={'goToFirst'} isFirst={true} href={`/genres/${params.slug[0]}/1`} content={
                    <div className="w-full h-[95%] flex justify-center items-center">
                        <LuChevronFirst size={20}/>
                    </div>
                } />
            )
            for (let i=0; i<numPages; i++) {
                selector.push(
                    <GetPageButton key={`goToPage${i+1}`} index={i} href={{pathname: `/genres/${params.slug[0]}/${i+1}`}} content={
                        <>
                            {i+1}
                        </>
                    } />
                )
            }
            selector.push(
                <GetPageButton key={'goToLast'} numPages={numPages} isLast={true} href={`/genres/${params.slug[0]}/${numPages}`} content={
                    <div className="w-full h-[95%] flex justify-center items-center">
                        <LuChevronLast size={20}/>
                    </div>
                } />
            )
            return selector;
        }
        return null;
    }

    const DoShowGameDetails = () => {
        if(showGameDetails.show && showGameDetails.value !== null)
            return <ShowGameDetails game={games.games[showGameDetails.value]} setShowGameDetails={setShowGameDetails} category={genre.slug}/>
        return null
    }
    
    return (
        <main>
            <Header isDynamic={false}/>
            <div className="w-full mt-16 p-2">
                <p className="text-2xl sm:text-4xl font-extrabold text-white">{genre && `${genre.name} games`}</p>
                <GetGenreGames />
            </div>
            <DoShowGameDetails />
        </main>
    )
}
