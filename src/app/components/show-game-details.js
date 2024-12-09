import { useEffect, useState } from 'react';
import Image from 'next/image';
import {FaStar} from 'react-icons/fa6';
import {TbLoader2} from 'react-icons/tb';
import {IoMdArrowDropleft, IoMdArrowDropright} from 'react-icons/io';
import {IoClose} from 'react-icons/io5';
import {FaPlay} from 'react-icons/fa';
import Link from 'next/link';

export default function ShowGameDetails({game, setShowGameDetails, category}){
    const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

    const [loading, setLoading] = useState(true);
    const [languages, setLanguages] = useState(null);
    const [screenshots, setScreenshots] = useState(null);
    const [genres, setGenres] = useState(null);
    const [themes, setThemes] = useState(null);

    useEffect(() => {
        async function getGameLanguages() {
            try {
                const response = await fetch(`${BASE_URL}/languagesByGameId/${game._id}`,
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
                    const response = await fetch(`${BASE_URL}/genre/${g}`,
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
                    const response = await fetch(`${BASE_URL}/theme/${t}`,
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
                const response = await fetch(`${BASE_URL}/screenshot/${screenshot}`, 
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

        return <p className="leading-3">{fixedNum}</p>
    }

    const GetSupportedLanguages = () => {
        if (languages !== null && languages.length > 0) {
            let output = '';
            for (let lg of languages) {
                output += `${lg}, `;
            }
            return (
                <b className="w-full text-xs">Supported languages: <span className="text-xs font-extralight">{output.substring(0, output.length-2)}</span></b>
            )
        }
        return null
    }

    const GetOtherInfo = () => {
        const res = [];

        for (let [i, g] of genres.entries()) {
            if (g.slug !== category) {
                res.push(
                    <div key={`g${g._id}`} className="flex">
                        <Link className="text-sm font-extralight text-[#fffb] no-underline hover:text-[#dd202d]" href={`/genres/${g.slug}/1`}>
                            <p>{g.name}</p>
                        </Link>
                        {(i < genres.length - 1 || (themes && themes.length > 0)) && <p>,&nbsp;</p>}
                    </div>
                );
            }
        }
        for (let [j, t] of themes.entries()) {
            if (t.slug !== category) {
                res.push(
                    <div key={`t${t._id}`} className="flex">
                        <Link className="text-sm font-extralight text-[#fffb] no-underline hover:text-[#dd202d]" href={`/themes/${t.slug}/1`}>
                            <p>{t.name}</p>
                        </Link>
                        {j < themes.length - 1 && <p>,&nbsp;</p>}
                    </div>
                );
            }
        }

        return res;
    }

    const GetGameDetailsPopup = () => {
        const [activeScreenshot, setActiveScreenshot] = useState(0);
        const [screenshotWidth, setScreenshotWidth] = useState(0);

        useEffect(() => {
            function updateWidth() {
                if (!loading) {
                    setScreenshotWidth(document.getElementsByClassName('game-info-container').clientWidth);
                }
            }
            window.addEventListener('resize', updateWidth)
            return () => window.removeEventListener('resize', updateWidth);
        }, [])

        useEffect(() => {
            if (!loading) {
                setScreenshotWidth(document.getElementById('game-info-container').clientWidth);
            }
        }, [loading])

        if (!loading){
            return (
                <>
                    <div className="w-full max-w-3xl flex justify-end">
                        <button className="flex text-zinc-300 text-lg font-semibold items-center gap-0.5 hover:text-white" onClick={() => {
                            setShowGameDetails(false);
                            document.body.style.overflowY = "auto";
                            }}>
                            Close 
                            <IoClose size={22} />
                        </button>
                    </div>
                    <div className="w-full max-w-3xl max-h-[min(70vh,_600px)] overflow-y-auto p-4 rounded bg-zinc-900 text-white scrollbar">
                        <div className="flex flex-col gap-1">
                            <p className="text-2xl font-extrabold">{game.name}</p>
                            <div className="flex items-center gap-0.5">
                                <GetRating />
                                <FaStar className="text-[#fd0] h-[0.75rem]"/>
                                <p className="text-xs leading-3">({game.total_rating_count})</p>
                            </div>
                        </div>
                        <div className="flex flex-col w-full mt-3">
                            <div id="game-info-container" className="w-full flex flex-col gap-3">
                                <p className="w-full text-sm font-light text-justify">{game.summary}</p>
                                <div className={`relative w-full aspect-video border border-[#fff6]`} style={{minHeight: screenshotWidth * 9 / 16}}>
                                    {screenshots[activeScreenshot]}
                                    <div className="w-full p-4 absolute top-1/2 left-1/2 z-50 flex justify-between items-center -translate-x-1/2 -translate-y-1/2">
                                        <button className="w-11 bg-[#000a] rounded aspect-square text-white flex items-center justify-center hover:text-[#dd202d]"
                                            onClick={() => {
                                                    if (activeScreenshot > 0)
                                                        setActiveScreenshot(activeScreenshot-1)
                                                    else
                                                        setActiveScreenshot(screenshots.length-1)
                                                }}>
                                                    <IoMdArrowDropleft size={40} />
                                        </button>
                                        <button className="w-11 bg-[#000a] rounded aspect-square text-white flex items-center justify-center hover:text-[#dd202d]"
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
                                <div className="w-full flex flex-wrap text-sm text-[#fffb]">
                                    More tags:&nbsp;<GetOtherInfo />
                                </div>
                                <div className="w-full flex justify-end">
                                <button className={"flex items-center gap-3 px-4 py-2 rounded font-semibold bg-white hover:bg-zinc-300 text-black"}>
                                    <FaPlay />
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
            <div className="w-12 aspect-square animate-spin">
                <TbLoader2 size={48} color='#fff8' />
            </div>
        )
    }

        return (
            <div className="fixed w-full h-screen bg-[#000c] top-0 left-0 z-40 flex flex-col justify-center items-center gap-2 p-4">
                <GetGameDetailsPopup />
            </div>
        )
}