'use client'
import React, {useEffect, useState} from "react";
import Header from "../components/header";
import styles from './page.module.css';
import Image from "next/image";
import Link from "next/link";
import Footer from "../components/footer";

export default function Home() {
    const [themes, setThemes] = useState(null);

    useEffect(() => {
        async function getGenres() {
            try {
                const response = await fetch(`https://gamescript-backend.vercel.app/themes`,
                {
                    method: 'GET'
                });
                const json = await response.json();
                json.sort((a, b) => {
                    return a.name.localeCompare(b.name);
                })
                setThemes(json)
            } catch(e) {
                console.log(e.message);
            }
        }

        getGenres();
    }, [])

    const GetThemes = () => {
        if (themes !== null) {
            const themeComps = [];
            for (let t of themes) {
                themeComps.push( 
                    <Link key={t._id} className={styles['genre-link']} href={`/themes/${t.slug}/page/1`} as={`/themes/${t.slug}/page/1`}>
                        <div className={styles['genre-header']}>
                            <div className={styles['genre-icon-container']}>
                                <Image loading="lazy" src={`/assets/categories/themes/${t.slug}.png`} fill sizes="100%" alt="icon.png"/>
                            </div>
                            <p className={styles['genre-name']}>{t.name}</p>
                        </div>
                        <p className={styles['genre-description']}>{t.description}</p>
                    </Link>
                )
            }
            return (    
                <div className={styles['genres-container']}>
                    {themeComps}
                </div>
            );
        }
        
        if (typeof window !== 'undefined') {
            const loadingComps = [];
            const headerHeight = Math.max(21, window.innerWidth * 0.016);
            const descHeight = Math.max(14, window.innerWidth * 0.01);
        
            for (let i=0; i<30; i++) {
                loadingComps.push(
                    <div key={i} className={styles['genre-link']} style={{position: 'relative', display: 'flex', flexDirection: 'column', gap: 8}}>
                        <div className={styles['genre-header']}>
                            <p className={styles['genre-name']} style={{width: '40%', height: headerHeight, borderRadius: 24, backgroundColor: '#fff8', margin: `${headerHeight / 2}px 0`}} />
                        </div>
                        <p className={styles['genre-description']} style={{width: '70%', height: descHeight, borderRadius: 24, backgroundColor: '#fffc'}} />
                        <p className={styles['genre-description']} style={{width: '100%', height: descHeight, borderRadius: 24, backgroundColor: '#fffc'}} />
                        <p className={styles['genre-description']} style={{width: '60%', height: descHeight, borderRadius: 24, backgroundColor: '#fffc'}} />
                        <div className={styles['loading-gradient']} />
                    </div>
                )
            }
            return (
                <div className={styles['loading-grid']}>
                    {loadingComps}
                </div>
            );
            
        }
        return null;
    }
    
    return (
        <main>
            <Header isDynamic={false}/>
                <GetThemes />
            <Footer />
        </main>
    )
}
