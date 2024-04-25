import React, { useEffect, useState } from "react";
import styles from '../page.module.css';
import Image from "next/image";
import Link from "next/link";
import {IoMenu} from 'react-icons/io5';



export default function Header({isDynamic}) {
    let threshold = 0;
    const [opacityRatio, setOpacityRatio] = useState(0);

    const [layout, setLayout] = useState(0);
    const [showMenu, setShowMenu] = useState(false);

    useEffect(() => {
        function updateOpacity() {
            let opacityRatio = window.scrollY / threshold;

            if (opacityRatio > 1)
                opacityRatio = 1;

            setOpacityRatio(opacityRatio);
        }

        function updateLayout() {
            setLayout(window.innerWidth >= 380 ? 0 : 1)
            threshold = window.innerWidth * 9 / 16 - 64
        }

        threshold = window.innerWidth * 9 / 16 - 64
        window.addEventListener('scroll', updateOpacity)
        window.addEventListener('resize', updateLayout)
        updateLayout()
        return () => {
            window.removeEventListener('scroll', updateOpacity);
            window.removeEventListener('resize', updateLayout);
        }
    }, [])

    const GetLayout = () => {
        if (layout === 1)
            return (
                <div className={styles['alt-header']}>
                    <Link className={styles['alt-logo']} href={{pathname: '/'}}>
                        <Image src={'/assets/logo.png'} fill priority sizes="100%" alt="alt-logo.png" />
                    </Link>
                    <button className={styles['header-menu-button']} onClick={() => setShowMenu(!showMenu)}>
                        <IoMenu />
                    </button>
                </div>
            )
        return (
            <div className={styles['header-left']}>
                <Link className={styles.logo} href={{pathname: '/'}}>
                    <Image src={'/assets/logo.png'} fill priority sizes="100%" alt="logo.png" />
                </Link>
                <div className={styles['header-links']}>
                    <Link className={styles['header-button']} href={{pathname: '/genres'}}>
                        <p>Genres</p>
                    </Link>
                    <Link className={styles['header-button']} href={{pathname: '/themes'}}>
                        <p>Themes</p>
                    </Link>
                </div>
            </div>
        )
    }

    const GetHeaderMenu = () => {
        if (showMenu) {
            return (
                <div className={styles['header-menu']}>
                    <Link className={styles['header-button']} href={{pathname: '/genres'}}>
                        <p>Genres</p>
                    </Link>
                    <Link className={styles['header-button']} href={{pathname: '/themes'}}>
                        <p>Themes</p>
                    </Link>
                </div>
            )
        }
        return null;
    }

    return (
        <>
        <div className={styles.header}
        style={{background: isDynamic ? `linear-gradient(0deg, rgba(17,17,17,${opacityRatio}) 0%, rgba(0,0,0,1) 100%)` : `linear-gradient(0deg, rgba(17,17,17,1) 0%, rgba(0,0,0,1) 100%)`}}>
            <GetLayout />
        </div>
        <GetHeaderMenu />
        </>
    )
}