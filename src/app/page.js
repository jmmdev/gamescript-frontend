'use client'
import React, {useEffect, useState} from "react";
import Header from "./components/header";
import GameHighlight from "./components/game-highlight";
import GameScroller from "./components/game-scroller";
import styles from './page.module.css';
import Footer from "./components/footer";

export default function Home() {
    const [data, setData] = useState(null);
    useEffect(() => {
        async function getData() {
            try {
                const response = await fetch('https://gamescript-backend.vercel.app/homeData',
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
    
    return (
        <main>
            <Header isDynamic={true}/>
            <GameHighlight />
            <div className={styles['scroller-list']}>
                <GameScroller scrollerGames={data.mostRecent} scrollerIndex={0} title={'Latest releases'} />
                <GameScroller scrollerGames={data.overallFavorites} scrollerIndex={1} title={'Prime picks'}/>
                <GameScroller scrollerGames={data.userFavorites} scrollerIndex={2} title={'Fan favorites'} />
                <GameScroller scrollerGames={data.criticFavorites} scrollerIndex={3} title={'Expert selections'}/>
            </div>
            <Footer />
        </main>
    )
}
