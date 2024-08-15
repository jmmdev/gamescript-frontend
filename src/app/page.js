'use client'
import React, {useEffect, useState} from "react";
import Header from "./components/header";
import GameHighlight from "./components/game-highlight";
import GameScroller from "./components/game-scroller";
import styles from './page.module.css';
import Footer from "./components/footer";

export default function Home() {
    const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

    const [data, setData] = useState(null);

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
            return <GameScroller scrollerGames={data[games]} scrollerIndex={index} title={title} />
        }
        return null;
    }
    
    return (
        <main>
            <Header isDynamic={true}/>
            <GameHighlight />
            <div className={styles['scroller-list']}>
                <GetScrollerData games={'mostRecent'} index={0} title={'Latest releases'} />
                <GetScrollerData games={'overallFavorites'} index={1} title={'Prime picks'}/>
                <GetScrollerData games={'userFavorites'} index={2} title={'Fan favorites'} />
                <GetScrollerData games={'criticFavorites'} index={3} title={'Expert selections'}/>
            </div>
            <Footer />
        </main>
    )
}
