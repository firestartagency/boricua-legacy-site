import styles from './Footer.module.css';

const Footer = () => {
    return (
        <footer className={styles.footer}>
            <div className={styles.container}>

                {/* Newsletter Section */}
                <div className={styles.iconWrapper}>
                    <span className="material-symbols-outlined">mail</span>
                </div>

                <h2 className={styles.heading}>Join La Familia</h2>
                <p className={styles.subtext}>
                    Sign up for exclusive updates, behind-the-scenes content, and invitations to upcoming book signings.
                </p>

                <form className={styles.form}>
                    <input
                        type="email"
                        placeholder="Enter your email address"
                        className={styles.input}
                    />
                    <button type="button" className={styles.submitBtn}>
                        Subscribe
                    </button>
                </form>

                {/* Social Links */}
                <div className={styles.socials}>
                    <a href="#" className={styles.socialLink} aria-label="Instagram">
                        {/* Instagram Icon Placeholder */}
                        IG
                    </a>
                    <a href="#" className={styles.socialLink} aria-label="Twitter">
                        {/* Twitter Icon Placeholder */}
                        TW
                    </a>
                    <a href="#" className={styles.socialLink} aria-label="Facebook">
                        {/* Facebook Icon Placeholder */}
                        FB
                    </a>
                </div>

                <div className={styles.copyright}>
                    © {new Date().getFullYear()} Boricua Legacy Publishing Company. All rights reserved.
                </div>
            </div>
        </footer>
    );
};

export default Footer;
