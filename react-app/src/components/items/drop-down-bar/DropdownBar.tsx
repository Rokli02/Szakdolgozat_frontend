import { Icon } from '@mui/material';
import { FC, useRef, useState } from 'react';
import { DropdownItem } from '../../../models/menu.model';
import { useClickOutside } from '../../../utils/component-utils';
import styles from './DropdownBar.module.css';

type DropdownBarProps = {
  options: DropdownItem[],
  width?: string,
  header?: string,
  action?: boolean,
  setSelected?: (selected: any) => void,
  changeHeader?: boolean,
  className?: string,
}

export const DropdownBar: FC<DropdownBarProps> = ({ options, width = '280px', header = 'Unknown', action = false, changeHeader = true, setSelected, className }) => {
  const [open, setOpen] = useState(false);
  const [selectedValueHeader, setSelectedValueHeader] = useState(header);
  const componentRef = useRef<any>(null);

  const toggle = () => {
    setOpen((pre) => !pre);
  }
  const close = () => {
    setOpen(false);
  }

  const selectHandle = (option: DropdownItem) => {
    if(!action) {
      return;
    }
    if(changeHeader) {
      if(!option.value) {
        setSelectedValueHeader(header);
      } else {
        setSelectedValueHeader(option.shownValue);
      }
    }

    if(setSelected !== undefined) {
      setSelected(option.value);
    }
  }

  useClickOutside(componentRef, close);
  return (
    <div
      className={`${styles["dropdown-container"]} ${className ? className : ""}`}
      style={{
        width: width,
        borderRadius: open ? '8px 8px 0px 0px' : '8px',
      }}
      ref={componentRef}
      >
      <div className={styles["dropdown-header"]} onClick={toggle}>
        <label>{selectedValueHeader}</label>
        <label>
          <Icon className={`${styles["dropdown-icon"]} ${open ? styles["expanded"] : ''}`}>expand_more</Icon>
        </label>
      </div>
      <div className={`${styles["dropdown-body"]} ${open ? styles['open'] : ''}`}>
        {
          options.length > 0
          ? <span>
            <span className={styles["dropdown-item-container"]}>
            {
              options.map((option, index) => (
                <div className={`${styles["dropdown-body-item"]} ${option.highlight ? styles['highlight'] : ''}`}
                onClick={() => selectHandle(option)} key={index}
                  >{option.shownValue}</div>
              ))
            }
            </span>
          </span>
          : <span className={styles["dropdown-item-container"]}>
            <div className={styles["dropdown-body-item"]}>
              Üres...
            </div>
          </span>
        }
      </div>
    </div>
  )
}