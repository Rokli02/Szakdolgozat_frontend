import { useContext } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { AuthContext } from '../../contexts/authContext';
import { Profile } from '../profile/Profile';
import { Sidebar } from '../sidebar/Sidebar';
import styles from './Navbar.module.css';
import { Icon } from '@mui/material';
import { BackendChooser } from '../backend-chooser/BackendChooser';

export function Navbar() {
  const { user } = useContext(AuthContext);
  const currentPath = useLocation().pathname;

  return (
    <header id={styles["navbar"]}>
      <section id={styles["left-navbar-section"]} className={styles["navbar-section"]}>
        <Sidebar></Sidebar>
        <Link to={"/series"} title="Sorozatok" className={styles["navbar-button"]}>Sorozatok</Link>
        <Link to={"/newsfeed"} title="Újdonságok" className={styles["navbar-button"]}>Újdonságok</Link>
      </section>
      <section id={styles["middle-navbar-section"]} className={styles["navbar-section"]}>
        {user 
        ? <Profile></Profile>
        : currentPath === "/login"
        ? <Link to={"/signup"} className={styles["navbar-main-button"]} title="Regisztráció">
            <Icon className={styles["navbar-auth-icon"]}>settings_accessibility</Icon>
            <span className={styles["navbar-auth-text"]}>Regisztráció</span>
          </Link>
        : <Link to={"/login"} className={styles["navbar-main-button"]} title="Bejelentkezés">
            <Icon className={styles["navbar-auth-icon"]}>key</Icon>
            <span className={styles["navbar-auth-text"]}>Bejelentkezés</span>
          </Link>
        }
      </section>
      <section id={styles["right-navbar-section"]} className={styles["navbar-section"]}>
        <BackendChooser></BackendChooser>
      </section>
    </header>
  );
}