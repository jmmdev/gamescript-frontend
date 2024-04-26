'use client'
import React, {useEffect, useState} from "react";
import Header from "../../../../components/header";
import { useParams } from "next/navigation";
import styles from './page.module.css';
import Image from "next/image";
import ShowGameDetails from "@/app/components/show-game-details";
import {LuChevronFirst, LuChevronLast} from 'react-icons/lu';
import Link from 'next/link';

export default function Home() {

    const [genre, setGenre] = useState(null);
    const [games, setGames] = useState(null);
    const [coverWidth, setCoverWidth] = useState(null)
    const [showGameDetails, setShowGameDetails] = useState({show: false, value: null});
    const [actualPage, setActualPage] = useState(0);
    const params = useParams();

    useEffect(() => {
        async function getGenre() {
            try {
                const response = await fetch(`https://gamescript-backend.vercel.app/genre/${params.slug}`,
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
                const response = await fetch(`https://gamescript-backend.vercel.app/gamesByGenre/${genre._id}/page/${params.number}`,
                {
                    method: 'GET'
                });
                const games = await response.json();
                
                for (let g of games.games) {
                    const cover = await fetch(`https://gamescript-backend.vercel.app/coverByGameId/${g.cover}`, {method: 'GET'});
                    const coverObj = await cover.json();
                    g.cover = coverObj;
                }
                setGames(games);
                setActualPage(params.number - 1);
            
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
                    <button key={g._id} className={styles['genre-game']} onClick={() => {
                        document.body.style.overflowY = 'hidden';
                        setShowGameDetails({show: true, value: index});
                    }}>
                        <div className={styles['cover-thumbnail']} style={{height: Math.max(coverWidth * 0.05, 64) / 0.75}}>
                            <Image loading="lazy" src={`https://images.igdb.com/igdb/image/upload/t_cover_big_2x/${g.cover.image_id}.jpg`} fill sizes="100%" alt="cover.jpg" priority />
                        </div>
                        <div className={styles['game-details']}>
                            <p className={styles['game-name']}>{g.name}</p>
                            <p className={styles['game-summary']}>{g.summary}</p>
                        </div>
                    </button>
                )
            }
            return (
                <div className={styles['genre-content']} style={{minHeight: window.innerHeight - 64 - Math.max(window.innerWidth * 0.01, 8) - 2 * Math.max(24, window.innerWidth * 0.022)}}>
                    <div className={styles['genre-list']}>
                        {gameComps}
                    </div>
                    <div className={styles['selector-container']}>
                        <div className={styles.selector}>
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
                <div key={i} className={styles['genre-game']} style={{position: 'relative'}}>
                    <div className={styles['cover-thumbnail']} style={{backgroundColor: '#fff8', height: Math.max(coverWidth * 0.05, 64) / 0.75}} />
                    <div className={styles['game-details']} style={{width: '100%'}}>
                        <p className={styles['game-name']} style={{width: '40%', height: headerHeight, backgroundColor: '#fff8', borderRadius: 24}}/>
                        <p className={styles['game-summary']} style={{width: '100%', height: descHeight, backgroundColor: '#fffc', borderRadius: 24}}/>
                        <p className={styles['game-summary']} style={{width: '100%', height: descHeight, backgroundColor: '#fffc', borderRadius: 24}}/>
                    </div>
                    <div className={styles['loading-gradient']} />
                </div>
            )
        }
        return (
            <div className={styles['genre-content']}>
                {loadingComps}
            </div>
        );
    }

    const GetPages = () => {
        if (games !== null && games.games.length > 0) {
            let numPages = games.totalPages;

            const selector = [];

            selector.push(
                <Link key={'goToFirst'} className={styles['selector-page-inactive']} style={{display: actualPage !== 0 ? 'block' : 'none'}} href={{pathname: `/genres/${params.slug}/page/${1}`}}>
                    <div className={styles['go-to-container']}>
                        <LuChevronFirst size={20}/>
                    </div>
                </Link>
            )
            for (let i=0; i<numPages; i++) {
                selector.push(
                    <Link key={`goToPage${i+1}`} className={actualPage === i ? styles['selector-page-active'] : styles['selector-page-inactive']} 
                    style={{display: i >= actualPage-1 && i <= actualPage+1 ? 'block' : 'none'}} href={{pathname: `/genres/${params.slug}/page/${i+1}`}}>
                        {i+1}
                    </Link>
                )
            }
            selector.push(
                <Link key={'goToLast'} className={styles['selector-page-inactive']} style={{display: actualPage !== numPages-1 ? 'block' : 'none'}} href={{pathname: `/genres/${params.slug}/page/${numPages}`}}>
                    <div className={styles['go-to-container']}>
                        <LuChevronLast size={20}/>
                    </div>
                </Link>
            )
            return selector;
        }
        return null;
    }

    const DoShowGameDetails = () => {
        if(showGameDetails.show && showGameDetails.value !== null)
            return <ShowGameDetails game={games.games[showGameDetails.value]} setShowGameDetails={setShowGameDetails} />
        return null
    }
    
    return (
        <main>
            <Header isDynamic={false}/>
            <div className={styles['genre-container']}>
                <p className={styles.genre}>{genre && `${genre.name} games`}</p>
                <GetGenreGames />
            </div>
            <DoShowGameDetails />
        </main>
    )
}
