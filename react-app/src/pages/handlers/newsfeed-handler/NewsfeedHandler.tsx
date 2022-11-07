import { Button, TextField } from '@mui/material';
import { AxiosError } from 'axios';
import { useCallback, useContext, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Confirmation } from '../../../components/items/confirmation/Confirmation';
import { SearchBar } from '../../../components/items/search-bar/SearchBar';
import { SnackbarContext } from '../../../contexts/snackbarContext';
import { AutoCompleteItem } from '../../../models/menu.model';
import { Newsfeed } from '../../../models/newsfeed.model';
import { deleteNewsfeedRequest, getNewsfeedRequest, getNewsfeedsRequest, saveNewsfeedRequest, updateNewsfeedRequest } from '../../../utils/newsfeed-utils';
import { getSeriesesRequest, getSeriesRequest } from '../../../utils/series-utils';
import * as yup from 'yup';
import styles from './NewsfeedHandler.module.css';

type NewsfeedFormState = {
  id?: number;
  title: string;
  description: string;
  series?: {
    id: number;
    title: string;
    prodYear: number;
  }
}

type NewsfeedFormErrorMessage = {
  [key in keyof NewsfeedFormState]?: string;
}

export const NewsfeedHandler = () => {
  const [addNew, setAddNew] = useState(true);
  const [searchNewsfeedValue, setSearchNewsfeedValue] = useState("");
  const [searchSeriesValue, setSearchSeriesValue] = useState("");
  const [autocompleteOptions, setAutocompleteOptions] = useState<AutoCompleteItem[]>([]);
  const [autocompleteSeriesOptions, setAutocompleteSeriesOptions] = useState<AutoCompleteItem[]>([]);
  const [newsfeedId, setNewsfeedId] = useState<number | undefined>(undefined);
  const [newsfeed, setNewsfeed] = useState<Newsfeed | undefined>(undefined);
  const [formState, setFormState] = useState<NewsfeedFormState>(formInit);
  const [errorMsg, setErrorMsg] = useState<NewsfeedFormErrorMessage>({});
  const [openConfirmation, setOpenConfirmation] = useState(false);
  const navigate = useNavigate();
  const { id } = useParams();
  const { setMessage } = useContext(SnackbarContext);

  const submit = async (e: any) => {
    e.preventDefault();
    const errorMsg: NewsfeedFormErrorMessage = {} as NewsfeedFormErrorMessage;
    try {
      const result = await NewsfeedSchema.validate(formState, { abortEarly: false });
      const updatableNewsfeed: Newsfeed = {
        series: {
          id: result.series.id,
          title: result.series.title,
          prodYear: result.series.prodYear
        },
      } as Newsfeed;

      if(newsfeedId) {
        if(result.title !== newsfeed.title) {
          updatableNewsfeed.title = result.title;
        }
        if(result.description !== newsfeed.description) {
          updatableNewsfeed.description = result.description;
        }

        const response = await updateNewsfeedRequest(newsfeedId, updatableNewsfeed);
        if(response) {
          setMessage(response, "success");
        }
      } else {
        updatableNewsfeed.title = result.title;
        updatableNewsfeed.description = result.description;

        const response = await saveNewsfeedRequest(updatableNewsfeed);
        if(response) {
          setMessage("Sikeres újdonság felvitel!", "success");
          resetValues();
        }
      }

      setErrorMsg(errorMsg);
    } catch(err) {
      if(err instanceof yup.ValidationError) {
        for(const error of err.inner) {
          errorMsg[(error.path as keyof NewsfeedFormState)] = error.message;
        }
        setErrorMsg(errorMsg);
      } else {
        if((err as AxiosError<any>).response.status === 401) {
          navigate("/logout");
        }
        setMessage((err as AxiosError<any>).response.data.message)
      }
    }
  }

  const setSearchValueWrapper = (searchValue: string) => {
    setSearchNewsfeedValue(searchValue);
  }
  const setSeriesSearchValueWrapper = (searchValue: string) => {
    setSearchSeriesValue(searchValue);
  }
  const setAutocompleteValue = (newsfeedId: number) => {
    navigate(`/admin/newsfeed/${newsfeedId}`)
  }
  const setAutocompleteSeriesValue = async (seriesId: number) => {
    try {
      const response = await getSeriesRequest(seriesId);
      if(response) {
        setFormState((pre) => ({
          ...pre,
          series: {
            id: response.id,
            title: response.title,
            prodYear: response.prodYear,
          }
        }));
      }
    } catch(err) {
      if((err as AxiosError<any>).response.status === 401) {
        navigate("/logout");
      }
      setMessage((err as AxiosError<any>).response.data.message)
    }
  }
  
  const resetValues = () => {
    setNewsfeedId(undefined)
    setNewsfeed(undefined);
    setFormState(formInit);
    setErrorMsg({});
    setSearchSeriesValue("");
    setSearchNewsfeedValue("");
    setAutocompleteOptions([]);
    setAutocompleteSeriesOptions([]);
  }
  const handleFieldChange = (e: any, fieldName: string) => {
    setFormState((pre) => ({
      ...pre,
      [fieldName]: e.target.value,
    }));
  }
  const deleteNewsfeed = async () => {
    const resp = await deleteNewsfeedRequest(newsfeedId);
    if(resp) {
      setMessage(resp, "success");
      navigate("/newsfeed");
    }
  }

  const fetchNewsfeedData = useCallback(async () => {
    try {
      const response = await getNewsfeedRequest(newsfeedId);
      if(response) {
        setNewsfeed(response);
        setFormState({
          id: response.id,
          title: response.title,
          description: response.description,
          series: response.series,
        })
      }
    } catch(err) {
      if((err as AxiosError<any>).response.status === 401) {
        navigate("/logout");
      }
      setMessage((err as AxiosError<any>).response.data.message)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [newsfeedId]);
  const fetchNewsfeedsDataAndMakeOptions = useCallback(async () => {
    try {
      const response = await getNewsfeedsRequest(1, 10, searchNewsfeedValue);
      if(response) {
        setAutocompleteOptions(response.newsfeeds.map((newsfeed) => ({ value: newsfeed.id, label: `${newsfeed.id}, ${newsfeed.title} | ${newsfeed.series.title}`}) as AutoCompleteItem));
      }
    } catch(err) {
      if((err as AxiosError<any>).response.status === 401) {
        navigate("/logout");
      }
      setMessage((err as AxiosError<any>).response.data.message)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchNewsfeedValue]);
  const fetchSeriesesDataAndMakeOptions = useCallback(async () => {
    try {
      const response = await getSeriesesRequest(1, 10, searchSeriesValue);
      if(response) {
        setAutocompleteSeriesOptions(response.serieses.map((series) => ({ value: series.id, label: `${series.id}, ${series.title} | ${series.prodYear}`}) as AutoCompleteItem));
      }
    } catch(err) {
      if((err as AxiosError<any>).response.status === 401) {
        navigate("/logout");
      }
      setMessage((err as AxiosError<any>).response.data.message)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchSeriesValue]);

  useEffect(() => {
    fetchSeriesesDataAndMakeOptions();
  }, [searchSeriesValue, fetchSeriesesDataAndMakeOptions]);
  useEffect(() => {
    fetchNewsfeedsDataAndMakeOptions();
  }, [searchNewsfeedValue, fetchNewsfeedsDataAndMakeOptions]);
  useEffect(() => {
    if(!isNaN(Number(id))) {
      setAddNew(false);
      setNewsfeedId(Number(id));
    }
  }, [id]);
  useEffect(() => {
    if(newsfeedId) {
      fetchNewsfeedData();
    }
  }, [newsfeedId, fetchNewsfeedData]);

  const routeTo = (type: string) => {
    switch (type) {
      case "new":
        setAddNew(true);
        resetValues();
        navigate("/admin/newsfeed", { replace: true });
        return;
      case "change":
        setAddNew(false);
        resetValues();
        navigate("/admin/newsfeed", { replace: true });
        return;
      default:
        return;
    }
  }

  return (
    <div>
      <Confirmation open={openConfirmation} question="Biztos, hogy törlöd az újdonságot?" handleClose={() => setOpenConfirmation(false)} onAccept={deleteNewsfeed}/>
      <div className={styles["sub-navbar"]}>
        <label onClick={() => routeTo('new')} className={styles["sub-navbar-item"]}>Új hozzáadás</label>
        <label onClick={() => routeTo('change')} className={styles["sub-navbar-item"]}>Módosítás</label>
      </div>
      <div className={styles["container"]}>
        {
          !addNew &&
          <div className={styles["search"]}>
            <SearchBar options={autocompleteOptions} setSearchValue={setSearchValueWrapper} setAutocompleteValue={setAutocompleteValue}/>
          </div>
        }
        {(addNew || newsfeedId) &&
        <div className={styles["form-container"]}>
          <form onSubmit={submit}>
            <div className={styles["form-header"]}>
              <div className={styles["title"]}>
                <label>Újdonság {addNew ? 'hozzáadás' : 'módosítás'}</label>
              </div>
              {newsfeedId &&
              <div className={styles["id"]}>
                <label>ID: {newsfeedId}</label>
              </div>}
            </div>
            <div className={styles["form-details"]}>
              <div className={`${styles["details-row"]} ${styles["first-row"]}`}>
                <div className={styles["newsfeed-title"]}>
                  <TextField label="Cím" variant='standard' autoComplete='off' InputLabelProps={{ style:{transformOrigin: "50%" }}}
                    value={formState.title} onChange={(e) => handleFieldChange(e, "title")}
                    error={errorMsg.title !== undefined} helperText={errorMsg.title}
                  />
                </div>
                <SearchBar className={styles["series-search"]} options={autocompleteSeriesOptions} header="Sorozat"
                    setSearchValue={setSeriesSearchValueWrapper} setAutocompleteValue={setAutocompleteSeriesValue} 
                    width='100%' 
                />
              </div>
              {formState.series &&
              <div className={styles["details-row"]}>
                <label className={styles["series-col"]}>Sorozat címe: {formState.series.title}</label>
                <label className={styles["series-col"]}>Sorozat megjelenése: {formState.series.prodYear}</label>
              </div>}
              <div className={styles["details-row"]}>
                <div className={styles["description"]}>
                  <TextField label="Leírás" variant='standard' autoComplete='off' multiline minRows={6} InputLabelProps={{ style:{transformOrigin: "50%" }}}
                    value={formState.description} onChange={(e) => handleFieldChange(e, "description")}
                    error={errorMsg.description !== undefined} helperText={errorMsg.description}
                  />
                </div>
              </div>
            </div>
            <div className={styles["button-container"]}>
            <Button className={styles["form-button"]} type="submit" variant="contained" disabled={!NewsfeedSchema.isValidSync(formState)}>Mentés</Button>
            {!addNew &&
              <Button className={styles["form-button"]} type="button" variant="contained" color="error"
                  onClick={() => setOpenConfirmation(true)}
              >
                Törlés
              </Button>}
            </div>
          </form>
        </div>}
      </div>
    </div>
  )
}

const NewsfeedSchema = yup.object().shape({
  id: yup.number().min(1),
  title: yup.string().required("Cím megadása kötelező!"),
  description: yup.string().required("Leírás megadása kötelező!"),
  series: yup.object({
    id: yup.number(),
    title: yup.string(),
    prodYear: yup.number(),
  }).required("Sorozat megadása kötelező!"),
});

const formInit: NewsfeedFormState = {
  id: undefined,
  title: "",
  description: "",
  series: undefined,
}