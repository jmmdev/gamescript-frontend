import React, {useEffect, useRef, useState} from "react";
import ScrollerGame from './scroller-game';
import ShowGameDetails from "./show-game-details";
import {IoMdArrowDropleft, IoMdArrowDropright} from "react-icons/io";

export default function GameScroller({externalFlags, scrollerGames, scrollerIndex, title, isHighlight}) {
    const scrollerRef = useRef(null);
    console.log(scrollerGames.length);

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
                            <GetScrollerGames setActiveGame={externalFlags ? externalFlags.setActiveGame : setActiveGame} setShowGameDetails={setShowGameDetails} scrollerIndex={scrollerIndex}/>
                        </div>
                    } scrollPosition={scrollPosition} setScrollPosition={setScrollPosition} />
                </div>
                <DoShowGameDetails activeGame={activeGame} showGameDetails={showGameDetails} setShowGameDetails={setShowGameDetails}/>
            </div>
        )
    }

    const GetScrollButtons = ({child}) => {
        const [lastIndexScrolled, setLastIndexScrolled] = useState(0);
        const [currentWidth, setCurrentWidth] = useState(0);
        const [range, setRange] = useState(0);

        function getThreshold(width) {
            if (width < 768)
                setRange(3);
            else if (width >= 768 && width < 1024)
                setRange(4);
            else if (width >= 1024 && width < 1280)
                setRange(6);
            else if (width >= 1280 && width < 1536)
                setRange(8);
            else 
                setRange(10);
        }

        useEffect(() => {
            function updateWidth() {
                const actualWidth = document.getElementById('rc-' + scrollerIndex).clientWidth;
                setCurrentWidth(actualWidth);
            }
            window.addEventListener('resize', updateWidth);
            updateWidth();

            return () => window.removeEventListener('resize', updateWidth);
          }, []);

        useEffect(() => {
            const elementToScroll = document.getElementById(`rc-${scrollerIndex}-game-${lastIndexScrolled}`);
            if (elementToScroll)
                elementToScroll.scrollIntoView({block: "nearest", inline: "start"});
            getThreshold(currentWidth);
        }, [currentWidth])

        const result = [];

        result.push(
           <button key={0} className="flex items-center justify-center w-[2.5%] text-white hover:text-[#dd202d]" 
           style={{visibility: scrollerRef.current && lastIndexScrolled > 0 ? 'visible' : 'hidden'}} 
           onClick={() => {

            }}>
                <IoMdArrowDropleft size={48} />
            </button>
        )

        result.push(child);
        
        result.push(
            <button key={2} className="flex items-center justify-center w-[2.5%] text-white hover:text-[#dd202d]"
            style={{visibility: scrollerRef.current && (lastIndexScrolled + range - 1 < (scrollerGames.length-1)) ? 'visible' : 'hidden'}}
            onClick={() => {
                let elem;

                const leftRef = lastIndexScrolled + range;
                const rightRef = leftRef + range - 1;

                if (rightRef <= scrollerGames.length - 1) {
                    elem = document.getElementById(`rc-${scrollerIndex}-game-${leftRef}`);
                    setLastIndexScrolled(leftRef);
                }
                else {
                    const diff = rightRef - leftRef;
                    const newElementIndex = lastIndexScrolled + diff;
                    elem = document.getElementById(`rc-${scrollerIndex}-game-${newElementIndex}`);
                    setLastIndexScrolled(newElementIndex);
                }
                elem.scrollIntoView({block: "nearest", inline: "start"});
            }}>
                <IoMdArrowDropright size={48} />
            </button>
        )
        return result;
    }

    const GetScrollerGames = ({setActiveGame, setShowGameDetails, scrollerIndex}) => {
        const games = [];
        if (scrollerGames) {
            scrollerGames.map((game, index) => {
                games.push(<ScrollerGame key={game._id} game={game} index={index} scrollerIndex={scrollerIndex} setActiveGame={setActiveGame} setShowGameDetails={isHighlight ? null : setShowGameDetails}/>)
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