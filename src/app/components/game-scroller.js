import React, {useEffect, useRef, useState} from "react";
import styles from '../page.module.css';
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
                {title && <p className={styles['scroller-title']}>{title}</p>}
                <div id={'sc-' + scrollerIndex} className={styles['recent-navigation']}>
                    <GetScrollButtons child={
                        <div id={'rc-' + scrollerIndex} key={4} ref={scrollerRef} className={styles['recent-container']}>
                            <div className={styles['recent-container-background']} />
                            <GetScrollerGames setActiveGame={externalFlags ? externalFlags.setActiveGame : setActiveGame} setShowGameDetails={setShowGameDetails}/>
                        </div>
                    } scrollPosition={scrollPosition} setScrollPosition={setScrollPosition} />
                </div>
                <DoShowGameDetails activeGame={activeGame} showGameDetails={showGameDetails} setShowGameDetails={setShowGameDetails}/>
            </div>
        )
    }

    const GetScrollButtons = ({child}) => {
        const [scrolled, setScrolled] = useState(0);
        const [threshold, setThreshold] = useState({min:0, max: 0});
        const [currentWidth, setCurrentWidth] = useState(0);

        function getThreshold(width) {
            if (width < 600)
                setThreshold({min: 0.2, max: 0.75})
            else if (width >= 600 && width < 1100)
                setThreshold({min: 0.2, max: 0.6})
            else
                setThreshold({min: 0.2, max: 0.5})
        }

        useEffect(() => {
            function updateWidth() {
                setCurrentWidth(document.getElementById('sc-' + scrollerIndex).clientWidth)
                setScrolled(scrollerRef.current.scrollLeft / scrollerRef.current.scrollWidth)
            }

            document.getElementById('rc-' + scrollerIndex).addEventListener('scrollend', 
                event => setScrolled(scrollerRef.current.scrollLeft / scrollerRef.current.scrollWidth)
            )
            window.addEventListener('resize', updateWidth);
            updateWidth();

            return () => window.removeEventListener('resize', updateWidth);
          }, []);

        useEffect(() => {
            getThreshold(currentWidth)
        }, [currentWidth])

        const result = [];

        result.push(
           <button key={0} className={styles['recent-navigation-button']} 
           style={{visibility: scrollerRef.current && scrolled > threshold.min ? 'visible' : 'hidden'}} 
           onClick={() => {
                    scrollerRef.current.scrollLeft -= Math.floor(currentWidth * 0.975)
            }}>
                <IoMdArrowDropleft size={48} />
            </button>
        )

        result.push(child);
        
        result.push(
            <button key={2} className={styles['recent-navigation-button']} 
            style={{visibility: scrollerRef.current && scrolled < threshold.max ? 'visible' : 'hidden'}}
            onClick={() => {
                    scrollerRef.current.scrollLeft += Math.floor(currentWidth * 0.975)
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