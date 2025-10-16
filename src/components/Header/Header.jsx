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
                to="/azucar"
                className={({ isActive }) => isActive ? `${styles.link} ${styles.active}` : styles.link}
              >
                Agencia de Azúcar
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/tienda"
                className={({ isActive }) => isActive ? `${styles.link} ${styles.active}` : styles.link}
              >
                LLegada a Tienda
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/dados"
                className={({ isActive }) => isActive ? `${styles.link} ${styles.active}` : styles.link}
              >
                Lanzamiento Dados
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/huevos"
                className={({ isActive }) => isActive ? `${styles.link} ${styles.active}` : styles.link}
              >
                Gallina Ponedora de Huevos
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/tasa-fija"
                className={({ isActive }) => isActive ? `${styles.link} ${styles.active}` : styles.link}
              >
                Tasa Fija
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/tasa-variable"
                className={({ isActive }) => isActive ? `${styles.link} ${styles.active}` : styles.link}
              >
                Tasa Variable
              </NavLink>
              </li>
          </ul>
        </nav>
      </div>
    </header>
  );
}

