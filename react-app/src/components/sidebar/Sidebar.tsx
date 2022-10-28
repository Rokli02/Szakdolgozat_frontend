import { Link } from 'react-router-dom';
import styles from './Sidebar.module.css';
import { IconButton, Icon } from '@mui/material';
import { useContext, useState } from 'react';
import { AuthContext } from '../../contexts/authContext';

export function Sidebar() {
  const [open, setOpen] = useState(false);
  const { sidebarItems } = useContext(AuthContext);

  const toggle = () => {
    setOpen((preValue) => !preValue);
  }

  return (
    <div id={styles["sidebar"]} hidden={!sidebarItems}>
      <IconButton id={styles["sidebar-icon-button"]} title="Oldalsáv" onClick={() => toggle()}>
        <Icon id={styles["sidebar-icon"]}>menu</Icon>
      </IconButton>
      <div className={`${styles["sidebar-body"]} ${open ? styles["expanded"] : ''}`}>
        {sidebarItems && sidebarItems.map(item => (
          <div className={styles["sidebar-item"]} key={item.link}>
            <Link to={item.link} className={styles["sidebar-item-text"]} onClick={() => toggle()}>{item.name}</Link>
            <hr className={styles["sidebar-spacer"]}/>
          </div>
        ))}
        
      </div>
    </div>
  )
}