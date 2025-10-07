import styles from "./Card.module.css";

export default function Card({ title, children, onClick }) {
  return (
    <article className={styles.card} onClick={onClick} role="button" tabIndex={0}>
      <header className={styles.header}>
        <h2 className={styles.title}>{title}</h2>
      </header>
      <div className={styles.content}>
        {children}
      </div>
    </article>
  );
}
