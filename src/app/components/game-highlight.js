import React, {useEffect, useState} from "react";
import styles from '../page.module.css';
import Image from "next/image";
import {FaPlay, FaInfoCircle, FaChevronLeft, FaChevronRight} from 'react-icons/fa';
import ShowGameDetails from "./show-game-details";

export default function GameHighlight() {
    const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;
    
    const [randomGames, setRandomGames] = useState(null);
    const [screenshots, setScreenshots] = useState(null);
      
      useEffect(() => {
          async function getMostRecentGames() {
              try {
                  const response = await fetch(`${BASE_URL}/randomGames`,
                  {
                    method: 'GET'
                  });
                  const json = await response.json();
                  setRandomGames(json);
              } catch(e) {
                  return null;
              }
          }
          getMostRecentGames();
      }, [])

      useEffect(() => {
            async function getScreenshot(id) {
              try {
                  const response = await fetch(`${BASE_URL}/screenshot/${id}`, 
                  {
                      method: 'GET',
                  });
                  const json = await response.json();
                  return json;
              } catch(e) {
                  console.log(e.message);
                  return null;
              }
          }

          async function getScreenshots() {
            const screenshots = [];
            try {
                for (let game of randomGames) {
                    const image = await getScreenshot(game.screenshots[0]);
                    screenshots.push(<Image key={image.image_id} src={`https://images.igdb.com/igdb/image/upload/t_screenshot_med_2x/${image.image_id}.jpg`} fill alt="screenshot.jpg" priority/>);
                }
                setScreenshots(screenshots);
            } catch (e) {
                console.log(e.message);
            }
          }
  
          if (randomGames) {
            getScreenshots();
          }
      }, [randomGames]);

      const GetGameDetails = ({game, setShowGameDetails}) => {
        return (
            <div className="h-1/2 flex flex-col justify-center gap-4 p-4 pt-0 ">
                <div className="flex flex-col gap-2">
                    <p className="text-4xl font-bold text-white">{game.name}</p>
                    <p className="h-14 text-xl text-white text-justify line-clamp-2">{game.summary}</p>
                </div>
                <div className="flex gap-4">
                    <button className={"flex items-center gap-3 px-5 py-3 rounded text-lg font-semibold bg-white hover:bg-gray-300"}>
                        <FaPlay />
                        <p>Play</p>
                    </button>
                    <button className="flex items-center gap-3 px-5 py-3 rounded text-lg font-semibold bg-gray-600 text-white hover:bg-gray-500"
                        onClick={e => {
                            document.body.style.overflowY = "hidden";
                            setShowGameDetails(true);
                        }}>
                        <FaInfoCircle />
                        <p>Details</p>
                    </button>
                </div>
            </div>
        )
      }

      const DoShowGameDetails = ({activeGame, showGameDetails, setShowGameDetails}) => {
        if(showGameDetails)
            return <ShowGameDetails game={randomGames[activeGame]} setShowGameDetails={setShowGameDetails} />
        return null
    }

      const GetHighlightScroller = () => {
        const [activeGame, setActiveGame] = useState(0);
        const [showGameDetails, setShowGameDetails] = useState(false);


        useEffect(() => {
            const interval = setInterval(() => {
                if (!showGameDetails)
                    setActiveGame(activeGame < randomGames.length - 1 ? activeGame + 1 : 0)
            }, 5000);
            

            return () => clearInterval(interval);
        }, [activeGame, showGameDetails])

        
        if (screenshots && activeGame >= 0) {
            return (
                <>
                    {screenshots[activeGame]}
                    <div className="absolute w-full h-full bg-gradient-to-b from-transparent to-gray-900 to-98%" />
                    <div className="w-full absolute top-16 flex flex-col justify-end h-[calc(min(100vw_*_9_/_16,_100vh)_-_4rem)] ">
                        <div className={styles['highlight-navigation']}>
                            <button className={styles['highlight-navigation-button']} onClick={() => setActiveGame(activeGame > 0 ? activeGame-1 : randomGames.length-1)}>
                                <FaChevronLeft />
                            </button>
                            <button className={styles['highlight-navigation-button']} onClick={() => setActiveGame(activeGame < randomGames.length - 1 ? activeGame + 1 : 0)}>
                                <FaChevronRight />
                            </button>
                        </div>
                        <GetGameDetails game={randomGames[activeGame]} setShowGameDetails={setShowGameDetails} />
                    </div>
                    <DoShowGameDetails activeGame={activeGame} showGameDetails={showGameDetails} setShowGameDetails={setShowGameDetails} />
                </>
            )
        }
        return null;
      }

      const GetCurrentScreenshot = () => {
        return (
            <>
                <div className={styles['highlight-container']}>
                    <GetHighlightScroller />
                </div>
            </>
        )
      }

      return (
        <GetCurrentScreenshot />
      )
}