import styles from "./loading.module.css";

export default function Loading() {

  return (
    <div>
      <img className={`${styles.loadingImg} ANDtablet`} src="/images/Chaos_Portal.png" />
      <h3>Loading...</h3>
    </div>
  )
}
