import { useContext, useRef, useState } from 'react'
import { AuthContext } from '../../contexts/authContext'
import { IconButton, Icon } from '@mui/material';
import styles from './Profile.module.css';
import { useClickOutside } from '../../utils/component-utils';

export const Profile = () => {
  const [ open, setOpen ] = useState(false);
  const { user, logout } = useContext(AuthContext);
  const componentRef = useRef<any>(null);

  const toggle = () => {
    setOpen(pre => !pre);
  }
  
  const close = () => {
    setOpen(false);
  };

  const exit = () => {
    logout();
  }

  useClickOutside(componentRef, close);
  return (
    <div id={styles["profile"]} ref={componentRef}>
      <IconButton id={styles["profile-button"]} onClick={toggle}>
        <Icon id={styles["profile-icon"]}>manage_accounts</Icon>
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