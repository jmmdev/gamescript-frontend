import {useEffect, useState} from "react";

export default function GameScreenshot({screenshot}) {

    const [myScreenshot, setMyScreenshot] = useState(null);

    useEffect(() => {
        setMyScreenshot(screenshot);
    }, [screenshot])

    const GetScreenshot = () => {
        return myScreenshot
    }

    return <GetScreenshot />
}