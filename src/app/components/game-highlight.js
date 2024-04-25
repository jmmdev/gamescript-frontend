import React, {useEffect, useState} from "react";
import styles from '../page.module.css';
import Image from "next/image";
import {FaPlay, FaInfoCircle, FaChevronLeft, FaChevronRight} from 'react-icons/fa';
import ShowGameDetails from "./show-game-details";

export default function GameHighlight() {
    const [randomGames, setRandomGames] = useState(null);
    const [screenshots, setScreenshots] = useState(null);
      
      useEffect(() => {
          async function getMostRecentGames() {
              try {
                  const response = await fetch('https://gamescript-backend.onrender.com/randomGames',
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
                  const response = await fetch(`https://gamescript-backend.onrender.com/screenshot/${id}`, 
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
                    screenshots.push(<Image key={image.image_id} src={`https://images.igdb.com/igdb/image/upload/t_screenshot_med_2x/${image.image_id}.jpg`} fill sizes="100%" alt="screenshot.jpg" priority/>);
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
            <div className={styles.details}>
                <p className={styles['details-name']}>{game.name}</p>
                <p className={styles['details-summary']}>
                    {game.summary}
                </p>
                <div className={styles['details-buttons']}>
                    <button className={`${styles['details-button']} ${styles.play}`}>
                        <FaPlay size={14} />
                        <p>Play</p>
                    </button>
                    <button className={`${styles['details-button']} ${styles.info}`} onClick={e => {
                        setShowGameDetails(true);
                        document.body.style.overflowY = "hidden";
                        }}>
                        <FaInfoCircle size={16} />
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
                    <div className={styles['gradient-container']} />
                    <div className={styles['highlight-inner-container']}>
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