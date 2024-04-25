'use client'
import React, {useEffect, useState} from "react";
import Header from "./components/header";
import GameHighlight from "./components/game-highlight";
import GameScroller from "./components/game-scroller";
import styles from './page.module.css';
import Footer from "./components/footer";

export default function Home() {
    const [mostRecent, setMostRecent] = useState(null);
    const [userFavorites, setUserFavorites] = useState(null);
    const [criticFavorites, setCriticFavorites] = useState(null);
    const [overallFavorites, setOverallFavorites] = useState(null);
    useEffect(() => {
        async function getMostRecent() {
            try {
                const response = await fetch('https://gamescript-backend.onrender.com/mostRecentGames',
                {
                method: 'GET'
                });
                const json = await response.json();
                setMostRecent(json);
            } catch(e) {
                return null;
            }
        }

        async function getUserFavorites() {
            try {
                const response = await fetch('https://gamescript-backend.onrender.com/userFavorites',
                {
                  method: 'GET'
                });
                const json = await response.json();
                setUserFavorites(json);
            } catch(e) {
                return null;
            }
        }

        async function getCriticFavorites() {
            try {
                const response = await fetch('https://gamescript-backend.onrender.com/criticFavorites',
                {
                  method: 'GET'
                });
                const json = await response.json();
                setCriticFavorites(json);
            } catch(e) {
                return null;
            }
        }

        async function getOverallFavorites() {
            try {
                const response = await fetch('https://gamescript-backend.onrender.com/overallFavorites',
                {
                  method: 'GET'
                });
                const json = await response.json();
                setOverallFavorites(json);
            } catch(e) {
                return null;
            }
        }

        getMostRecent();
        getUserFavorites();
        getCriticFavorites();
        getOverallFavorites();
    }, [])
    
    return (
        <main>
            <Header isDynamic={true}/>
            <GameHighlight />
            <div className={styles['scroller-list']}>
                <GameScroller scrollerGames={mostRecent} scrollerIndex={0} title={'Latest releases'} />
                <GameScroller scrollerGames={overallFavorites} scrollerIndex={1} title={'Prime picks'}/>
                <GameScroller scrollerGames={userFavorites} scrollerIndex={2} title={'Fan favorites'} />
                <GameScroller scrollerGames={criticFavorites} scrollerIndex={3} title={'Expert selections'}/>
            </div>
            <Footer />
        </main>
    )
}
