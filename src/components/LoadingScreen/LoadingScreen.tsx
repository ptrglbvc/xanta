import styles from "./LoadingScreen.module.css";

export default function LoadingScreen() {
  return (
    <div className={styles.posuda}>
      <span className={styles.loader} />
    </div>
  );
}
