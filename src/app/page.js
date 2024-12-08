'use client'
import React, {useEffect, useState} from "react";
import Header from "./components/header";
import GameHighlight from "./components/game-highlight";
import GameScroller from "./components/game-scroller";
import Footer from "./components/footer";

export default function Home() {
    const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

    const [data, setData] = useState(null);
    const [categories, setCategories] = useState(null);

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

    useEffect(() => {
        async function getCategories() {
            try {
                const response = await fetch(`${BASE_URL}/categories`,
                {
                method: 'GET'
                });
                const json = await response.json();
                setCategories(json);
            } catch(e) {
                return null;
            }
        }
        getCategories();
    }, [])

    const GetScrollerData = ({games, index, title}) => {
        if (data) {
            return <GameScroller scrollerGames={data[games]} scrollerIndex={index} title={title} />
        }
        return null;
    }
    
    return (
        <main>
            <Header isDynamic={true} categories={categories}/>
            <GameHighlight />
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
