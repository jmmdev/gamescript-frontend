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

    const GetScrollerData = ({games, index, title}) => {
        if (data) {
            return <GameScroller scrollerGames={games} scrollerIndex={index} title={title} />
        }
        return null;
    }
    
    return (
        <main>
            <Header isDynamic={true}/>
            <GameHighlight />
            <div className={styles['scroller-list']}>
                <GetScrollerData games={data.mostRecent} index={0} title={'Latest releases'} />
                <GetScrollerData games={data.overallFavorites} index={1} title={'Prime picks'}/>
                <GetScrollerData games={data.userFavorites} index={2} title={'Fan favorites'} />
                <GetScrollerData games={data.criticFavorites} index={3} title={'Expert selections'}/>
            </div>
            <Footer />
        </main>
    )
}
