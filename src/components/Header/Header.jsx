import styles from "./Header.module.css";
import { NavLink, Link } from "react-router-dom";

export default function Header() {
  return (
    <header className={styles.header} role="banner">
      <div className={styles.inner}>
        <Link to="/inicio" className={styles.brand} aria-label="Inicio – Proyecto de Modelado">
          <span className={styles.brandText}>Proyecto de Modelado</span>
        </Link>

        <nav className={styles.nav} aria-label="Navegación principal">
          <ul className={styles.navList}>
            <li>
              <NavLink
                to="/inicio"
                className={({ isActive }) => isActive ? `${styles.link} ${styles.active}` : styles.link}
              >
                Inicio
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/lineal"
                className={({ isActive }) => isActive ? `${styles.link} ${styles.active}` : styles.link}
              >
                Lineal
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/multiplicativo"
                className={({ isActive }) => isActive ? `${styles.link} ${styles.active}` : styles.link}
              >
                Multiplicativo
              </NavLink>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
}

