import { Button, TextField } from '@mui/material';
import { AxiosError } from 'axios';
import { useContext, useEffect, useState } from 'react';
import * as yup from 'yup';
import { DropdownBar } from '../../../components/items/drop-down-bar/DropdownBar';
import { SnackbarContext } from '../../../contexts/snackbarContext';
import { DropdownItem } from '../../../models/menu.model';
import { Category, Status } from '../../../models/series.model';
import { getCategoriesRequest, saveCategoryRequest, updateCategoryRequest } from '../../../utils/category-utils';
import { getStatusesRequest, saveStatusRequest, updateStatusRequest } from '../../../utils/status-utils';
import styles from './MiscHandler.module.css';

type StatusState = {
  id?: number;
  name: string;
}

type CategoryState = {
  id?: number;
  name: string;
}

type RefreshToken = {
  status: boolean;
  category: boolean;
}

type StatusErrorMessage = {
  [key in keyof StatusState]: string;
}

type CategoryErrorMessage = {
  [key in keyof CategoryState]: string;
}

export const MiscHandler = () => {
  const [statusState, setStatusState] = useState<StatusState>({ name: "" } as StatusState);
  const [categoryState, setCategoryState] = useState<CategoryState>({ name: "" } as CategoryState);
  const [statuses, setStatuses] = useState<Status[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [statusesOptions, setStatusesOptions] = useState<DropdownItem[]>([]);
  const [categoriesOptions, setCategoriesOptions] = useState<DropdownItem[]>([]);
  const [statusErrorMessage, setStatusErrorMessage] = useState<StatusErrorMessage>({} as StatusErrorMessage);
  const [categoryErrorMessage, setCategoryErrorMessage] = useState<CategoryErrorMessage>({} as CategoryErrorMessage);
  const [refreshToken, setRefreshToken] = useState<RefreshToken>({ status: false, category: false });
  const { setMessage } = useContext(SnackbarContext);

  const onStatusChange = (e: any) => {
    e.preventDefault();
    setStatusState((pre) => ({
      ...pre,
      name: e.target.value,
    }))
  }
  const onCategoryChange = (e: any) => {
    e.preventDefault();
    setCategoryState((pre) => ({
      ...pre,
      name: e.target.value,
    }))
  }

  const selectStatus = (id: number) => {
    if(!id) {
      setStatusState({ name: "" });
      return;
    }

    const findStatus = statuses?.find((value) => value.id === id);
    if(!findStatus) {
      setMessage("Nem sikerült az állapot megnyitása!");
      return;
    }
    
    setStatusState(findStatus);
  }
  const selectCategory = (id: number) => {
    if(!id) {
      setCategoryState({ name: "" });
      return;
    }

    const findCategory = categories?.find((value) => value.id === id);
    if(!findCategory) {
      setMessage("Nem sikerült a kategória megnyitása!");
      return;
    }
    
    setCategoryState(findCategory);
  }

  const resetStatus = () => {
    setStatusState({ name: "" });
  }
  const resetCategory = () => {
    setCategoryState({ name: "" });
  }

  const refresh = (fieldName: keyof RefreshToken) => {
    setRefreshToken((pre) => ({
      ...pre,
      [fieldName]: !pre[fieldName]
    }));
  }

  const submitStatus = async (e: any) => {
    e.preventDefault();
    const errorMsg: StatusErrorMessage = {} as StatusErrorMessage;

    try {
      const result = await StatusSchema.validate(statusState, { abortEarly: false });
      if(result.id) {
        const response = await updateStatusRequest(result.id, result);
        setMessage(response, "success");
      } else {
        await saveStatusRequest(result);
        setMessage("Sikeres állapot felvétel!", "success");
      }
      resetStatus();
      refresh("status");
      setStatusErrorMessage(errorMsg);
    } catch(err) {
      if(err instanceof yup.ValidationError) {
        for(const error of err.inner) {
          errorMsg[(error.path as keyof StatusState)] = error.message;
        }
        setStatusErrorMessage(errorMsg);
      } else {
        setMessage((err as AxiosError<any>).response?.data.message);
      }
    }
  }
  const submitCategory = async (e: any) => {
    e.preventDefault();
    const errorMsg: CategoryErrorMessage = {} as CategoryErrorMessage;

    try {
      const result = await CategorySchema.validate(categoryState, { abortEarly: false });
      if(result.id) {
        const response = await updateCategoryRequest(result.id, result);
        setMessage(response, "success");
      } else {
        await saveCategoryRequest(result);
        setMessage("Sikeres kategória felvétel!", "success");
      }
      resetCategory();
      refresh("category");
      setCategoryErrorMessage(errorMsg);
    } catch(err) {
      if(err instanceof yup.ValidationError) {
        for(const error of err.inner) {
          errorMsg[(error.path as keyof CategoryState)] = error.message;
        }
        setCategoryErrorMessage(errorMsg);
      } else {
        setMessage((err as AxiosError<any>).response?.data.message);
      }
    }
  }

  useEffect(() => {
    getStatusesRequest()
      .then((statuses) => {
        setStatuses(statuses);
        setStatusesOptions([{ value: undefined, shownValue: "+" } ,...statuses.map((status) => ({ value: status.id, shownValue: status.name }) as DropdownItem)]);
      })
      .catch((err) => setMessage((err as AxiosError<any>).response?.data.message))
    
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [refreshToken.status]);

  useEffect(() => {
    getCategoriesRequest()
      .then((categories) => {
        setCategories(categories);
        setCategoriesOptions([{ value: undefined, shownValue: "+" } ,...categories.map((category) => ({ value: category.id, shownValue: category.name }) as DropdownItem)]);
      })
      .catch((err) => setMessage((err as AxiosError<any>).response?.data.message))
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [refreshToken.category]);

  return (
    <div className={styles["container"]}>
      <div className={styles["sub-container"]}>
        <div className={styles["title"]}>
          <label>Sorozat állapotok</label>
        </div>
        {statusState.id && <div className={styles["selected-id"]}>ID: {statusState.id}</div>}
        <form onSubmit={submitStatus}>
          <div className={styles["form-row"]}>
          <div className={styles["form-field"]}>
            <TextField className={styles["form-input"]} label="Állapot megnevezés" value={statusState.name} 
                onChange={onStatusChange} autoComplete="off" variant='standard'
                error={statusErrorMessage.name !== undefined} helperText={statusErrorMessage.name}
                />
          </div>
          <div className={styles["form-field"]}>
            <DropdownBar width='100%' className={styles["form-input"]} header="Állapotok" changeHeader={false} action={true} options={statusesOptions} setSelected={selectStatus}/>
          </div>
          </div>
          <Button className={styles["form-button"]} color="primary" type="submit" variant='contained' disabled={!StatusSchema.isValidSync(statusState)}
            >Mentés
            </Button>
        </form>
      </div>
      <div className={styles["sub-container"]}>
        <div className={styles["title"]}>
          <label>Kategóriák</label>
        </div>
        {categoryState.id && <div className={styles["selected-id"]}>ID: {categoryState.id}</div>}
        <form onSubmit={submitCategory}>
          <div className={styles["form-row"]}>
            <div className={styles["form-field"]}>
              <TextField className={styles["form-input"]} label="Kategória megnevezés" value={categoryState.name} 
                  onChange={onCategoryChange} autoComplete="off" variant='standard'
                  error={categoryErrorMessage.name !== undefined} helperText={categoryErrorMessage.name}
              />
            </div>
            <div className={styles["form-field"]}>
              <DropdownBar width='100%' className={styles["form-input"]} header="Kategóriák" changeHeader={false} action={true} options={categoriesOptions} setSelected={selectCategory}/>
            </div>
          </div>
          <Button className={styles["form-button"]} color="primary" type="submit" variant='contained' disabled={!CategorySchema.isValidSync(categoryState)}
            >Mentés
          </Button>
        </form>
      </div>
    </div>
  )
}

const StatusSchema = yup.object().shape({
  id: yup.number().min(1, "Hibás ID!"),
  name: yup.string().required("Kötelező megadni egy megnevezést!"),
})

const CategorySchema = yup.object().shape({
  id: yup.number().min(1, "Hibás ID!"),
  name: yup.string().required("Kötelező megadni egy megnevezést!"),
})