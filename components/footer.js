import Link from "next/link";
import styles from "./layout.module.css";

export default function Footer() {
  return <footer id={styles.footerSec}>
    <Link href="/">
      <button className="hover-btn">HOME</button>
    </Link>

    <Link href="/AboutW0nd3r">
      <div className={styles.wonderLogoHolder}>
        <img className={styles.wonderLogo} src="/images/wonder_weird_logo.png" alt="wonder_weird_logo"  />
        <h3>Built by w0nd3r.eth</h3>
      </div>
    </Link>

  </footer>
}
