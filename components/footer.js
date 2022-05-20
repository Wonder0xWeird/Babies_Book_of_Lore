import Link from "next/link";
import styles from "./layout.module.css";

export default function Footer() {
  return <footer id={styles.footerSec}>
    <Link href="/">
      <button className="hover-btn">HOME</button>
    </Link>

    <Link href="https://andtheneum-test.vercel.app/">
      <div className={styles.wonderLogoHolder}>
        <h3>Powered by the <br/> Andtheneum</h3>
        <img className={styles.wonderLogo} src="/images/FUO Cropped.png" alt="Fair_Unbalanced_Oppressor"  />
      </div>
    </Link>

  </footer>
}
