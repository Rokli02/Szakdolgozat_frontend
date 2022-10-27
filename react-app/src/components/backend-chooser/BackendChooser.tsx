import styles from './BackendChooser.module.css';
import { Icon, IconButton, RadioGroup, Radio, FormControlLabel } from '@mui/material';
import { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../../contexts/authContext';

export const BackendChooser = () => {
  const [ open, setOpen] = useState(false);
  const [ activeName, setActiveName ] = useState("");
  const { getActiveBackendName, setBackendLocation } = useContext(AuthContext);

  useEffect(() => {
    setActiveName(getActiveBackendName());
  }, [getActiveBackendName]);

  const toggle = () => {
    setOpen(pre => !pre);
  }

  const setActiveBackend = (event: any) => {
    setActiveName(event.target.value);
    setBackendLocation(event.target.value);
  }

  return (
    <div id={styles["backend-chooser"]}> {/* (clickOutside)="close()" */}
      <IconButton id={styles["backend-chooser-button"]} onClick={toggle}>
        <Icon className={styles["backend-chooser-icon"]}>settings</Icon>
      </IconButton>
      <section className={`${styles["backend-chooser-data"]} ${open ? styles["open"] : ""}`}>
          <div>
            <h3>Backend választás!</h3>
          </div>
          <RadioGroup aria-label="Válassz backend-et!" value={activeName} onChange={setActiveBackend}>
            <div className={styles["radio-button-container"]}>
              <FormControlLabel value="fastify" control={<Radio size='medium' />} label="Fastify" />
            </div>
            <div className={styles["radio-button-container"]}>
              <FormControlLabel value="express" control={<Radio size='medium' />} label="Express" />
            </div>
            <div className={styles["radio-button-container"]}>
              <FormControlLabel disabled value="spring" control={<Radio size='medium' />} label="Spring" />
            </div>
          </RadioGroup>
      </section>
    </div>
  )
}