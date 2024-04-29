import { useEffect, useState } from 'react';
import Image from 'next/image';
import styles from '../page.module.css';
import {FaStar} from 'react-icons/fa6';
import {TbLoader2} from 'react-icons/tb';
import {IoMdArrowDropleft, IoMdArrowDropright} from 'react-icons/io';
import {IoClose} from 'react-icons/io5';
import {FaPlay} from 'react-icons/fa';
import Link from 'next/link';

export default function ShowGameDetails({game, setShowGameDetails}){
    const [loading, setLoading] = useState(true);
    const [languages, setLanguages] = useState(null);
    const [screenshots, setScreenshots] = useState(null);
    const [genres, setGenres] = useState(null);
    const [themes, setThemes] = useState(null);

    useEffect(() => {
        async function getGameLanguages() {
            try {
                const response = await fetch(`https://gamescript-backend.onrender.com/languagesByGameId/${game._id}`,
                {
                    method: 'GET'
                });
                const json = await response.json();
                setLanguages(json);
            } catch(e) {
                return null;
            }
        }

        async function getGameGenres() {
            const res = [];
            for (let g of game.genres) {
                try {
                    const response = await fetch(`https://gamescript-backend.onrender.com/genre/${g}`,
                    {
                        method: 'GET'
                    });
                    const json = await response.json();
                    res.push(json);
                } catch(e) {
                    return null;
                }
            }
            setGenres(res);
        }

        async function getGameThemes() {
            const res = [];
            for (let t of game.themes) {
                try {
                    const response = await fetch(`https://gamescript-backend.onrender.com/theme/${t}`,
                    {
                        method: 'GET'
                    });
                    const json = await response.json();
                    res.push(json);
                } catch(e) {
                    return null;
                }
            }
            setThemes(res);
        }

        async function getScreenshots() {
          const screenshots = [];
          try {
              for (let screenshot of game.screenshots) {
                const response = await fetch(`https://gamescript-backend.onrender.com/screenshot/${screenshot}`, 
                {
                    method: 'GET',
                });
                const image = await response.json();
                screenshots.push(<Image loading="lazy" src={`https://images.igdb.com/igdb/image/upload/t_screenshot_med_2x/${image.image_id}.jpg`} fill sizes="100%" alt="screenshot.jpg" priority/>);
              }
              setScreenshots(screenshots);
          } catch (e) {
              console.log(e, e.message);
          }
        }

        getGameLanguages();
        getScreenshots();
        getGameGenres();
        getGameThemes();
    }, [game])

    useEffect(() => {
        if (languages !== null && screenshots !== null && genres !== null)
            setLoading(false);
    }, [languages, screenshots, genres])
    
    const GetRating = () => {
        let fixedNum = (game.total_rating / 20).toFixed(1);

        const numString = fixedNum.toString();
        if (numString.charAt(numString.length-1) === '0')
            fixedNum = Math.floor(fixedNum)

        return <p>{fixedNum}</p>
    }

    const GetSupportedLanguages = () => {
        if (languages !== null && languages.length > 0) {
            let output = '';
            for (let lg of languages) {
                output += `${lg}, `;
            }
            return (
                <b className={styles['supported-header']}>Supported languages: <span className={styles['supported-languages']}>{output.substring(0, output.length-2)}</span></b>
            )
        }
        return null
    }

    const GetOtherInfo = () => {
        const res = [];

        for (let [i, g] of genres.entries()) {
            res.push(
                <div style={{display: 'flex'}} key={`g${g._id}`}>
                    <Link className={styles['game-tag-link']} href={`https://gamescript-frontend.vercel.app/genres/${g.slug}/1`}>
                        <p>{g.name}</p>
                    </Link>
                    {(i < genres.length - 1 || (themes && themes.length > 0)) && <p>,&nbsp;</p>}
                </div>
            );
        }
        for (let [j, t] of themes.entries()) {
            res.push(
                <div style={{display: 'flex'}} key={`t${t._id}`}>
                    <Link className={styles['game-tag-link']} href={`https://gamescript-frontend.vercel.app/themes/${t.slug}/1`}>
                        <p>{t.name}</p>
                    </Link>
                    {j < themes.length - 1 && <p>,&nbsp;</p>}
                </div>
            );
        }

        return res;
    }

    const GetGameDetailsPopup = () => {
        const [activeScreenshot, setActiveScreenshot] = useState(0);
        const [screenshotWidth, setScreenshotWidth] = useState(0);

        useEffect(() => {
            function updateWidth() {
                if (!loading) {
                    setScreenshotWidth(document.getElementsByClassName(styles['game-info-container'])[0].clientWidth);
                }
            }
            window.addEventListener('resize', updateWidth)
            return () => window.removeEventListener('resize', updateWidth);
        }, [])

        useEffect(() => {
            if (!loading) {
                setScreenshotWidth(document.getElementsByClassName(styles['game-info-container'])[0].clientWidth);
            }
        }, [loading])

        if (!loading){
            return (
                <>
                    <div className={styles['close-container']}>
                        <button className={styles['close-details']} onClick={() => {
                            setShowGameDetails(false);
                            document.body.style.overflowY = "auto";
                            }}>
                            Close 
                            <IoClose size={22} />
                        </button>
                    </div>
                    <div className={styles['game-details-content']}>
                        <div className={styles['game-info__first']}>
                            <div style={{display: 'flex', gap: 8}}>
                                <p className={styles['game-info__name']}>{game.name}</p>
                                <div className={styles['game-info__score']}>
                                    <GetRating />
                                    <FaStar size={16} color="#fd0"/>
                                    <p className={styles['game-info__count']}>({game.total_rating_count})</p>
                                </div>
                            </div>
                        </div>
                        <div className={styles['game-info']}>
                            <div className={styles['game-info-container']}>
                                <p className={styles['game-info__summary']}>{game.summary}</p>
                                <div style={{position: 'relative', width: '100%', minHeight: screenshotWidth * 9 / 16, border: '1px solid #fff6'}}>
                                    {screenshots[activeScreenshot]}
                                    <div className={styles['screenshot-navigation']}>
                                        <button className={styles['screenshot-navigation-button']}
                                            onClick={() => {
                                                    if (activeScreenshot > 0)
                                                        setActiveScreenshot(activeScreenshot-1)
                                                    else
                                                        setActiveScreenshot(screenshots.length-1)
                                                }}>
                                                    <IoMdArrowDropleft size={40} />
                                        </button>
                                        <button className={styles['screenshot-navigation-button']}
                                            onClick={() => {
                                                    if (activeScreenshot < screenshots.length-1)
                                                        setActiveScreenshot(activeScreenshot+1)
                                                    else
                                                        setActiveScreenshot(0)
                                                }}>
                                                    <IoMdArrowDropright size={40} />
                                        </button>
                                    </div>
                                </div>
                                <GetSupportedLanguages />
                                <div className={styles['game-tags']}>
                                    Tags:&nbsp;<GetOtherInfo />
                                </div>
                                <div style={{width: '100%', display: 'flex', justifyContent: 'flex-end'}}>
                                <button className={`${styles['play-from-details']} ${styles.play}`}>
                                    <FaPlay size={14} />
                                    <p>Play</p>
                                </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </>
            )
        }
        return (
            <div className={styles['details-loader']}>
                <TbLoader2 size={48} color='#fff8' />
            </div>
        )
    }

        return (
            <div className={styles['game-details-container']}>
                <GetGameDetailsPopup />
            </div>
        )
}