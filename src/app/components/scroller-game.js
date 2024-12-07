import React, {useEffect, useState} from "react";
import Image from "next/image";

export default function ScrollerGame({game, index, setActiveGame, setShowGameDetails}) {
    const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

    const [cover, setCover] = useState(null);

    useEffect(() => {
        fetch(`${BASE_URL}/coverByGameId/${game.cover}`, 
        {
            method: 'GET',
        })
        .then(response => response.json().then(
            cover => setCover(cover)
        ))
        .catch(e =>  console.log(e.message))
    }, [])

    const GetCover = () => {
        if (cover !== null) {
            return (
                <button className="basis-[7.75%] grow-0 shrink-0 hover:ring-4 hover:ring-[#dd202d]" style={{aspectRatio: cover.width / cover.height}} onClick={() => {
                    setActiveGame(index);
                    if (setShowGameDetails) {
                        setShowGameDetails(true);
                        document.body.style.overflowY = "hidden";
                    }
                }}>
                    <div style={{width: '100%', height: '100%', position: 'relative'}}>
                        <Image loading="lazy" src={`https://images.igdb.com/igdb/image/upload/t_cover_big_2x/${cover.image_id}.jpg`} fill sizes="100%" alt="cover.jpg" priority />
                    </div>
                </button>
            )
        }
        return null;
    }

    return (
        <GetCover />
    )
}