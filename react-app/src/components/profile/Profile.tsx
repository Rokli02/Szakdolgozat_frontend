import { useContext, useState } from 'react'
import { AuthContext } from '../../contexts/authContext'
import { IconButton, Icon } from '@mui/material';
import styles from './Profile.module.css';

export const Profile = () => {
  const [ open, setOpen ] = useState(false);
  const { user, logout } = useContext(AuthContext);

  const toggle = () => {
    setOpen(pre => !pre);
  }

  const exit = () => {
    logout();
  }

  return (
    <div id={styles["profile"]}> {/* (clickOutside)="close()" */}
      <IconButton id={styles["profile-button"]} onClick={toggle}>
        <Icon className={styles["profile-icon"]}>manage_accounts</Icon>
      </IconButton>
      <section className={`${styles["profile-data"]} ${open ? styles["open"] : ''}`}>
        <div id={styles["profile-username"]}>
          <div>{user!.username}</div>
          <div id={styles["profile-role"]}>{user!.role.name}</div>
        </div>
        <div className={styles["profile-details"]}>
          <div>{user!.name}</div>
          <div>{user!.email}</div>
          <div id={styles["profile-footer"]}>
            <span>Regisztráció: {user!.created.split('T')[0]}</span>
            <IconButton title="Kilépés" color="error" onClick={exit}>
              <Icon>logout</Icon>
            </IconButton>
          </div>
        </div>
      </section>
    </div>
  )
}