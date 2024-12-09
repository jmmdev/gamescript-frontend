import React, {useEffect, useRef, useState} from "react";
import ScrollerGame from './scroller-game';
import ShowGameDetails from "./show-game-details";
import {IoMdArrowDropleft, IoMdArrowDropright} from "react-icons/io";

export default function GameScroller({externalFlags, scrollerGames, scrollerIndex, title, isHighlight}) {
    const scrollerRef = useRef(null);

    const GetScroller = () => {
        const [activeGame, setActiveGame] = useState(0);
        const [showGameDetails, setShowGameDetails] = useState(false);
        const [scrollPosition, setScrollPosition] = useState('left');
        return (
            <div>
                {title && <p className="px-[2.5%] py-3 lg:py-4 text-2xl sm:text-4xl font-bold text-white">{title}</p>}
                <div id={'sc-' + scrollerIndex} className="w-full flex items-center pb-[2.5%] z-10">
                    <GetScrollButtons child={
                        <div id={'rc-' + scrollerIndex} key={4} ref={scrollerRef} className="w-full flex overflow-x-scroll no-scrollbar gap-[2.5%] scroll-smooth">
                            <GetScrollerGames setActiveGame={externalFlags ? externalFlags.setActiveGame : setActiveGame} setShowGameDetails={setShowGameDetails}/>
                        </div>
                    } scrollPosition={scrollPosition} setScrollPosition={setScrollPosition} />
                </div>
                <DoShowGameDetails activeGame={activeGame} showGameDetails={showGameDetails} setShowGameDetails={setShowGameDetails}/>
            </div>
        )
    }

    const GetScrollButtons = ({child}) => {
        const maxClicks = useRef(0);
        const numClicks = useRef(0);
        const [scrolled, setScrolled] = useState(0);
        const [currentWidth, setCurrentWidth] = useState(0);

        function getThreshold(width) {
            if (width < 640)
                maxClicks.current = 6;
            else if (width >= 640 && width < 768)
                maxClicks.current = 4;
            else if (width >= 768 && width < 1280)
                maxClicks.current = 3;
            else if (width >= 1280 && width < 1536)
                maxClicks.current = 2;
            else
                maxClicks.current = 1;
        }

        useEffect(() => {
            function updateWidth() {
                const actualWidth = document.getElementById('sc-' + scrollerIndex).clientWidth;
                setCurrentWidth(actualWidth);
            }

            document.getElementById('rc-' + scrollerIndex).addEventListener('scrollend', 
                event => setScrolled(scrollerRef.current.scrollLeft / scrollerRef.current.scrollWidth)
            )
            window.addEventListener('resize', updateWidth);
            updateWidth();

            return () => window.removeEventListener('resize', updateWidth);
          }, []);

        useEffect(() => {
            scrollerRef.current.scrollLeft = scrollerRef.current.scrollWidth * scrolled;
            getThreshold(currentWidth)
        }, [currentWidth])

        const result = [];

        result.push(
           <button key={0} className="flex items-center justify-center w-[2.5%] text-white hover:text-[#dd202d]" 
           style={{visibility: scrollerRef.current && numClicks.current > 0 ? 'visible' : 'hidden'}} 
           onClick={() => {
                numClicks.current -= 1;
                scrollerRef.current.scrollLeft -= Math.floor(currentWidth * 0.975);
            }}>
                <IoMdArrowDropleft size={48} />
            </button>
        )

        result.push(child);
        
        result.push(
            <button key={2} className="flex items-center justify-center w-[2.5%] text-white hover:text-[#dd202d]"
            style={{visibility: scrollerRef.current && numClicks.current < maxClicks.current ? 'visible' : 'hidden'}}
            onClick={() => {
                    numClicks.current += 1;
                    scrollerRef.current.scrollLeft += Math.floor(currentWidth * 0.975);
                }}>
                <IoMdArrowDropright size={48} />
            </button>
        )
        return result;
    }

    const GetScrollerGames = ({setActiveGame, setShowGameDetails}) => {
        const games = [];
        if (scrollerGames) {
            scrollerGames.map((game, index) => {
                games.push(<ScrollerGame key={game._id} game={game} index={index} setActiveGame={setActiveGame} setShowGameDetails={isHighlight ? null : setShowGameDetails}/>)
            })
            return games;
        }
        return null;
    }

    const DoShowGameDetails = ({activeGame, showGameDetails, setShowGameDetails}) => {
        if(externalFlags && externalFlags.showGameDetails || showGameDetails)
            return <ShowGameDetails game={externalFlags ? scrollerGames[externalFlags.activeGame] : scrollerGames[activeGame]} 
            setShowGameDetails={externalFlags ? externalFlags.setShowGameDetails : setShowGameDetails} />
        return null
    }

    return (
        <>
            <GetScroller />
        </>
    )
}