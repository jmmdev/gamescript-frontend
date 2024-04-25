import styles from '../page.module.css';

export default function Footer() {
    return (
        <div className={styles.footer}>
            <p>
                This website is a portfolio project and not associated with any real entity. All content herein is for demonstration purposes only.
            </p>
            <p>
                All rights to the content displayed on this website are reserved by the respective owners. No infringement is intended.
            </p>
        </div>
    )
}