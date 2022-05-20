import styles from "./loading.module.css";

export default function Posting() {

  return (
    <div className={`${styles.postingHolder} ANDtablet`}>
      <img className={`${styles.loadingImg}`} src="/images/FUO Cropped.png" />
      <h3>Submitting Post to the Andtheneum...</h3>
    </div>
  )
}
