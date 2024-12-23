import React, {useEffect, useState} from "react";
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
                    screenshots.push(<Image key={image.image_id} className="animate-fade" src={`https://images.igdb.com/igdb/image/upload/t_screenshot_med_2x/${image.image_id}.jpg`} fill alt="screenshot.jpg" priority/>);
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
            <div className="w-full lg:w-3/5 h-1/2 flex items-center justify-between sm:flex-col sm:items-start sm:justify-center gap-4 px-[2.5%] pt-0 ">
                <div className="w-full flex flex-col">
                    <p className="text-2xl sm:text-4xl sm:leading-[3rem] font-bold text-white line-clamp-2">{game.name}</p>
                    <p className="hidden lg:line-clamp-2 truncate whitespace-normal text-xl text-white text-justify">{game.summary}</p>
                </div>
                <div className="flex gap-4">
                    <button className="w-8 h-8 p-2 rounded-full sm:rounded sm:w-auto sm:h-auto sm:px-5 sm:py-3 flex justify-center items-center gap-3 text-lg font-semibold bg-white hover:bg-zinc-300">
                        <FaPlay />
                        <p className="hidden sm:block">Play</p>
                    </button>
                    <button className="w-8 aspect-square p-2 rounded-full sm:rounded sm:w-auto sm:aspect-auto sm:px-5 sm:py-3 flex justify-center items-center gap-3 text-lg font-semibold bg-zinc-600 text-white hover:bg-zinc-500"
                        onClick={e => {
                            document.body.style.overflowY = "hidden";
                            setShowGameDetails(true);
                        }}>
                        <FaInfoCircle />
                        <p className="hidden sm:block">Details</p>
                    </button>
                </div>
            </div>
        )
      }

      const GetLoadingDetails = () => {
        return (
            <div className="w-full lg:w-3/5 h-1/2 flex items-center justify-between sm:flex-col sm:items-start sm:justify-center gap-4 px-[2.5%] pt-0 animate-pulse">
                <div className="w-full flex flex-col gap-3">
                    <div className="h-8 sm:h-10 bg-zinc-700 rounded-full" />
                    <div className="hidden lg:block h-[1.75rem] bg-zinc-700 rounded-full" />
                    <div className="hidden lg:block h-[1.75rem] bg-zinc-700 rounded-full" />
                </div>
                <div className="flex gap-4">
                    <div className="w-12 h-12 p-2 rounded-full sm:w-[7.5rem] sm:h-[2.625rem] bg-zinc-700" />
                    <div className="w-12 h-12 p-2 rounded-full sm:w-[7.5rem] sm:h-[2.625rem] bg-zinc-700" />
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
                    <div className="absolute w-full h-full bg-gradient-to-b from-transparent to-zinc-900 to-98%" />
                    <div className="w-full absolute top-16 flex flex-col justify-end h-[calc(min(100vw_*_9_/_16,_100vh)_-_4rem)] z-10">
                        <div className="w-full h-1/2 flex justify-between items-end px-[2.5%]">
                            <button className="text-[#fff8] text-4xl lg:text-5xl hover:text-white" onClick={() => setActiveGame(activeGame > 0 ? activeGame-1 : randomGames.length-1)}>
                                <FaChevronLeft />
                            </button>
                            <button className="text-[#fff8] text-4xl lg:text-5xl hover:text-white" onClick={() => setActiveGame(activeGame < randomGames.length - 1 ? activeGame + 1 : 0)}>
                                <FaChevronRight />
                            </button>
                        </div>
                        <GetGameDetails game={randomGames[activeGame]} setShowGameDetails={setShowGameDetails} />
                    </div>
                    <DoShowGameDetails activeGame={activeGame} showGameDetails={showGameDetails} setShowGameDetails={setShowGameDetails} />
                </>
            )
        }
        return (
            <>
                <div className="absolute w-full h-full bg-zinc-800" />
                <div className="absolute w-full h-full bg-gradient-to-b from-transparent to-zinc-900 to-98%" />
                <div className="w-full absolute top-16 flex flex-col justify-end h-[calc(min(100vw_*_9_/_16,_100vh)_-_4rem)] z-10">
                    <GetLoadingDetails />
                </div>
            </>
        );
      }

      const GetCurrentScreenshot = () => {
        return (
            <>
                <div className="relative max-w-full aspect-video">
                    <GetHighlightScroller />
                </div>
            </>
        )
      }

      return (
        <GetCurrentScreenshot />
      )
}