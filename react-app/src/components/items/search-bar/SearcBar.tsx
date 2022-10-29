import { Autocomplete, TextField } from '@mui/material';
import { FC, useState } from 'react';
import { AutoCompleteItem } from '../../../models/menu.model';
import styles from './SearchBar.module.css';

type SearchBarProps = {
  options?: AutoCompleteItem[],
  header?: string,
  width?: string,
  setAutocompleteValue?: (value: any) => void;
  setSearchValue: (search: string) => void,
}

type SearchBarState = {
  clockId: NodeJS.Timeout,
  searchValue: string,
  autocompleteValue: any
}

export const SearchBar: FC<SearchBarProps> = ({ options, header = "Keresőmező", width = '350px', setSearchValue, setAutocompleteValue }) => {
  const [state, setState] = useState<SearchBarState>({ searchValue: "", autocompleteValue: undefined, clockId: null } as unknown as SearchBarState);


  const setValueWithDelay = (e: any) => {
    const currentState: SearchBarState = state;
    if(state.clockId) {
      clearTimeout(state.clockId);
    }
    currentState.searchValue = e.target.value;
    currentState.clockId = setTimeout(() => {
      setSearchValue(state.searchValue);
      clearTimeout(state.clockId);
    }, 620);

    setState((pre) => ({
      ...pre,
      searchValue: currentState.searchValue,
      clockId: currentState.clockId,
    }));
  }

  const selectAutocompleteValue = (e: any) => {

    if(setAutocompleteValue !== undefined) {
      console.log("van autocomplete func")
    }
    console.log(e);
  }

  return (
    <div className={styles["search-bar-container"]} style={{ width: width }}>
      <label className={styles["search-bar-header"]}>{header}</label>
      {
        options && options.length > 0 
        ?
        <Autocomplete
          options={options}
          renderInput={(params) =>
            <TextField value={state.searchValue} onChange={setValueWithDelay} 
                {...params} className={`${styles['search-input']} ${styles['search-field']}`} variant='standard' 
            />
          }
          onClick={selectAutocompleteValue}
        />
        : <TextField value={state.searchValue} className={`${styles['search-input']} ${styles['search-field']}`} variant='standard' autoComplete='off'
        onChange={setValueWithDelay}/>
      }
       {/* <mat-form-field className={styles["search-field">
         <input className={styles["search-input"]} type="text" (input)="startTimer()"
           matInput
           autocomplete="off"
           [formControl]="inputValue"
           [matAutocomplete]="auto">
         <mat-autocomplete #auto="matAutocomplete" (optionSelected)="setAutocompleteValue($event)">
           <mat-option *ngFor="let option of options" [value]="option.value" >
             {{option.shownValue}}
           </mat-option>
         </mat-autocomplete>
       </mat-form-field> */}
    </div>
  )
}