import { Button, Icon, IconButton, TextField } from '@mui/material';
import { AxiosError } from 'axios';
import { useCallback, useContext, useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { SearchBar } from '../../../components/items/search-bar/SearchBar';
import { SnackbarContext } from '../../../contexts/snackbarContext';
import { UploadableFile } from '../../../models/image.model';
import { AutoCompleteItem, DropdownItem } from '../../../models/menu.model';
import { Category, Season, Series } from '../../../models/series.model';
import { getCategoriesRequest } from '../../../utils/category-utils';
import { deleteImageRequest, getSeriesesRequest, getSeriesRequest, saveSeriesRequest, updateSeriesRequest } from '../../../utils/series-utils';
import * as yup from 'yup';
import styles from './SeriesHandler.module.css';
import { DropdownBar } from '../../../components/items/drop-down-bar/DropdownBar';
import { uploadRequest } from '../../../utils/image-utils';

type SeriesFormState = {
  id?: number;
  title: string;
  length: number | string;
  prodYear: number | string;
  ageLimit: number | string;
  seasons: Season[];
  categories: Category[];
  image?: UploadableFile;
}

type TempSeason = {
  season: number | string;
  episode: number | string;
}

type SeriesFormErrorMessage = {
  [key in keyof SeriesFormState]?: string;
}

type TempSeasonErrorMessage = {
  [key in keyof TempSeason]?: string;
}

export const SeriesHandler = () => {
  const [addNew, setAddNew] = useState(true);
  const [searchValue, setSearchValue] = useState("");
  const [autocompleteOptions, setAutocompleteOptions] = useState<AutoCompleteItem[]>([]);
  const [seriesId, setSeriesId] = useState<number | undefined>(undefined);
  const [series, setSeries] = useState<Series | undefined>(undefined);
  const [categories, setCategories] = useState<Category[]>([]);
  const [tempSeason, setTempSeason] = useState<TempSeason>(initSeason);
  const [removableSeasons, setRemovableSeasons] = useState<Season[]>([]);
  const [formState, setFormState] = useState<SeriesFormState>(formInit);
  const [errorMsg, setErrorMsg] = useState<SeriesFormErrorMessage>({});
  const [errorSeasonMsg, setErrorSeasonMsg] = useState<TempSeasonErrorMessage>({});
  const navigate = useNavigate();
  const { id } = useParams();
  const { setMessage } = useContext(SnackbarContext);
  const fileInput = useRef<any>(null);

  const submit = async (e: any) => {
    e.preventDefault();
    const errorMsg: SeriesFormErrorMessage = {} as SeriesFormErrorMessage;

    try {
      const result = await SeriesSchema.validate(formState);
      let saveSeries: Series = {} as Series;

      if(!seriesId) {
        saveSeries = {
          title: result.title,
          ageLimit: result.ageLimit,
          length: result.length,
          prodYear: result.prodYear,
          seasons: result.seasons,
          categories: result.categories,
          image: formState.image,
        }
        const response = await saveSeriesRequest(saveSeries);
        if(response) {
          resetValues();
          setMessage("Sikeres sorozat hozzáadás!", "success");
        }
      } else {
        //Meglévő módosítása
        if(result.title !== series.title) {
          saveSeries.title = result.title;
        }
        if(result.prodYear !== series.prodYear) {
          saveSeries.prodYear = result.prodYear;
        }
        if(result.length !== series.length) {
          saveSeries.length = result.length;
        }
        if(result.ageLimit !== series.ageLimit) {
          saveSeries.ageLimit = result.ageLimit;
        }
        if(result.image) {
          saveSeries.image = formState.image;
        }

        if(series.categories && series.categories.length > 0) {
          saveSeries.categories = [];
          const categoryMap: Map<number, Category> = new Map<number, Category>();
          for(let ct of series.categories) {
            if(ct.id)
              categoryMap.set(ct.id, { ...ct, remove: true });
          }
  
          for(let category of formState.categories) {
            if(category.id)
              categoryMap.set(category.id, category);
          }
  
          categoryMap.forEach((value, id) => {
            saveSeries.categories.push(value);
          });
  
        } else if(formState.categories && formState.categories.length > 0) {
          saveSeries.categories = formState.categories
        }

        saveSeries.seasons = [];
        if(!series.seasons || series.seasons.length < 0) {
          saveSeries.seasons = formState.seasons;
        } else {
          
  
          for(let season of formState.seasons) {
            if((!season.id && season.season && season.episode)
            || (season.id && season.season && season.episode)) {
              saveSeries.seasons.push(season);
            }
          }
        }
        
        removableSeasons.forEach(season => {
          saveSeries.seasons.push(season);
        })
        
        const response = await updateSeriesRequest(seriesId, saveSeries);
        if(response) {
          fetchSeriesData();
          setMessage(response, "success");
        }
      }

      setErrorMsg(errorMsg);
    } catch(err) {
      if(err instanceof yup.ValidationError) {
        for(const error of err.inner) {
          errorMsg[(error.path as keyof SeriesFormState)] = error.message;
        }
        setErrorMsg(errorMsg);
      } else {
        if((err as AxiosError<any>).response.status === 401) {
          navigate("/logout");
        }
        setMessage((err as AxiosError<any>).response.data.message);
      }
    }

    console.log(formState);

  }
  const saveSeason = () => {
    if(tempSeason.season && tempSeason.episode) {
      const seasonArray: Season[] = formState.seasons;
      const newSeason: Season = { season: Number(tempSeason.season), episode: Number(tempSeason.episode) }

      let index = -1;
      let i = 0;
      for(const season of seasonArray) {
        if(season.season === newSeason.season) {
          index = i;
          newSeason.id = season.id;
          break;
        }
        i++;
      }

      if(index === -1) {
        seasonArray.push(newSeason);
      } else {
        seasonArray[index] = newSeason;
      }

      resetSeasonValues();
      setFormState((pre) => ({
        ...pre,
        seasons: seasonArray
      }));
    } else {
      const errorSeasonMessage: TempSeasonErrorMessage = {};
      if(!tempSeason.season) {
        errorSeasonMessage.season = "Kötelező az évad megadása!"
      }
      if(!tempSeason.episode) {
        errorSeasonMessage.episode = "Kötelező az epizód megadása!"
      }
      setErrorSeasonMsg(errorSeasonMessage)
    }
  }
  const removeSeason = (season: number) => {
    if(!season) {
      return;
    }

    const seasonArray: Season[] = formState.seasons.filter((sn: Season) => {
      if(sn.season === season) {
        if(sn.id) {
          setRemovableSeasons((pre) => ([
            ...pre,
            { id: sn.id} as Season
          ]))
        }
        return false;
      }
      return true;
    });
    setFormState((pre) => ({
      ...pre,
      seasons: seasonArray
    }));
  }
  const removeImage = async () => {
    if(seriesId) {
      try {
        const response = await deleteImageRequest(seriesId);
        if(response) {
          setMessage(response, "success");
          fetchSeriesData();
        }
      } catch(err) {
        if((err as AxiosError<any>).response.status === 401) {
          navigate("/logout");
        }
        setMessage((err as AxiosError<any>).response.data.message);
      }
    }
  }
  const uploadFile = async (e) => {
    const uploadableFile = e.target.files[0] ?? null;
    if(uploadableFile) {
      try {
        const response = await uploadRequest(uploadableFile);
        if(response) {
          console.log("has response")
          setFormState((pre) => ({
            ...pre,
            image: {
              ...pre.image,
              ...response,
            }
          }));
          setMessage("Sikeres képfeltöltés!", "success");
        }
      } catch(err) {
        console.log(err);
        if((err as AxiosError<any>).response.status === 401) {
          navigate("/logout");
        }
        setMessage((err as AxiosError<any>).response.data.message);
      }
    }
  }

  const setSearchValueWrapper = (searchValue: string) => {
    setSearchValue(searchValue);
  }
  const setAutocompleteValue = (seriesId: number) => {
    navigate(`/admin/series/${seriesId}`)
  }


  const resetValues = () => {
    setSearchValue("");
    setAutocompleteOptions([]);
    setSeriesId(undefined);
    setSeries(undefined);
    setFormState(formInit);
    setErrorMsg({});
  }
  const resetSeasonValues = () => {
    setTempSeason(initSeason);
    setErrorSeasonMsg({});
  }
  const handleFieldChange = (e: any, fieldName: string) => {
    setFormState((pre) => ({
      ...pre,
      [fieldName]: e.target.value,
    }));
  }
  const handleImageOffsetChange = (e: any, fieldName: string) => {
    setFormState((pre) => ({
      ...pre,
      image: {
        ...pre.image,
        [fieldName]: e.target.value,
      }
    }));
  }
  const handleTempSeasonChange = (e: any, fieldName: string) => {
    setTempSeason((pre) => ({
      ...pre,
      [fieldName]: e.target.value,
    }));
  }
  const isTempSeasonValuesValid = () => {
    if(!tempSeason.season || tempSeason.season < 1) {
      return false;
    }
    if(!tempSeason.episode || tempSeason.episode < 1) {
      return false
    }

    return true;
  }
  const getCategoryOptions = useCallback(() => {
    if(!categories || categories.length < 1) {
      return [];
    }

    return categories.map((category) => {
      if(formState.categories.find((ct) => ct.id === category.id)) {
        return {
          shownValue: category.name,
          value: category.id,
          highlight: true
        } as DropdownItem;
      }
      return {
        shownValue: category.name,
        value: category.id
      } as DropdownItem;
    }) 
  }, [formState.categories, categories]);
  const handleCategory = (id: number) => {
    if(!id) {
      return;
    }

    const categoryArray: Category[] = formState.categories ?? [];
    if(categoryArray.find((category) => category.id === id)) {
      setFormState((pre) => ({
        ...pre,
        categories: categoryArray.filter((ct) => ct.id !== id)
      }));
    } else {
      const category = categories.find((ct) => ct.id === id);
      setFormState((pre) => ({
        ...pre,
        categories: [...categoryArray, category]
      }));
    }
  }
  const getSeasonOptions = useCallback(() => {
    if(formState.seasons) {
      return formState.seasons.sort((a: Season, b: Season) => a.season - b.season).map((season: Season) => ({
        value: season.season,
        shownValue: `${season.season}. évad, ${season.episode} rész`
      }) as DropdownItem)
    }

    return [];
  }, [formState.seasons]);

  const fetchSeriesData = useCallback(async () => {
    try {
      const response = await getSeriesRequest(seriesId);
      if(response) {
        setSeries(response);
        setFormState({
          ...response
        })
      }
    } catch(err) {
      if((err as AxiosError<any>).response.status === 401) {
        navigate("/logout");
      }
      setMessage((err as AxiosError<any>).response.data.message)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [seriesId]);
  const fetchSeriesesDataAndMakeOptions = useCallback(async () => {
    try {
      const response = await getSeriesesRequest(1, 10, searchValue);
      if(response) {
        setAutocompleteOptions(response.serieses.map((series) => ({ value: series.id, label: `${series.id}, ${series.title} | ${series.prodYear}`}) as AutoCompleteItem));
      }
    } catch(err) {
      if((err as AxiosError<any>).response.status === 401) {
        navigate("/logout");
      }
      setMessage((err as AxiosError<any>).response.data.message)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchValue]);
  const fetchCategoriesData = async () => {
    try {
      const response = await getCategoriesRequest();
      if(response) {
        setCategories(response);
      }
    } catch(err) {
      if((err as AxiosError<any>).response.status === 401) {
        navigate("/logout");
      }
      setMessage((err as AxiosError<any>).response.data.message)
    }
  }

  useEffect(() => {
    fetchSeriesesDataAndMakeOptions();
  }, [searchValue, fetchSeriesesDataAndMakeOptions]);
  useEffect(() => {
    if(seriesId) {
      fetchSeriesData();
    }
  }, [seriesId, fetchSeriesData]);
  useEffect(() => {
    if(!isNaN(Number(id))) {
      setAddNew(false);
      setSeriesId(Number(id));
    }
  }, [id]);
  useEffect(() => {
    fetchCategoriesData();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const routeTo = (type: string) => {
    switch (type) {
      case "new":
        setAddNew(true);
        resetValues();
        navigate("/admin/series", { replace: true });
        return;
      case "change":
        setAddNew(false);
        resetValues();
        navigate("/admin/series", { replace: true });
        return;
      default:
        return;
    }
  }

  return (
    <div>
      <div className={styles["sub-navbar"]}>
        <label onClick={() => routeTo('new')} className={styles["sub-navbar-item"]}>Új hozzáadás</label>
        <label onClick={() => routeTo('change')} className={styles["sub-navbar-item"]}>Módosítás</label>
      </div>
      <div className={styles["container"]}>
        {!addNew &&
        <div className={styles["search"]}>
          <SearchBar options={autocompleteOptions} setSearchValue={setSearchValueWrapper} setAutocompleteValue={setAutocompleteValue}/>
        </div>}
        {(addNew || seriesId) &&
        <div className={styles["form-container"]}>
          <form onSubmit={submit}>
            <div className={styles["form-header"]}>
              <div className={styles["title"]}>
                <label>Sorozat {addNew ? 'hozzáadás' : 'módosítás'}</label>
              </div>
              {seriesId &&
              <div className={styles["id"]}>
                <label>ID: {seriesId}</label>
              </div>}
            </div>
            <div className={styles["form-details"]}>
              <div className={styles["details-row"]}>
                <div className={styles["details-column"]}>
                  <div className={styles["form-field"]}>
                    <TextField label="Cím" variant='standard' autoComplete='off' InputLabelProps={{ style:{transformOrigin: "50%" }}}
                      value={formState.title} onChange={(e) => handleFieldChange(e, "title")}
                      error={errorMsg.title !== undefined} helperText={errorMsg.title}
                    />
                  </div>
                </div>
                <div className={styles["details-column"]}>
                  <div className={styles["form-field"]}>
                    <TextField label="Hossza" variant='standard' type='number' autoComplete='off' InputLabelProps={{ style:{transformOrigin: "50%" }}}
                      value={formState.length} onChange={(e) => handleFieldChange(e, "length")}
                      error={errorMsg.length !== undefined} helperText={errorMsg.length}
                    />
                  </div>
                </div>
              </div>
              <div className={styles["details-row"]}>
                <div className={styles["details-column"]}>
                  <div className={styles["form-field"]}>
                    <TextField label="Megjelenési év" variant='standard' type='number' autoComplete='off' InputLabelProps={{ style:{transformOrigin: "50%" }}}
                      value={formState.prodYear} onChange={(e) => handleFieldChange(e, "prodYear")}
                      error={errorMsg.prodYear !== undefined} helperText={errorMsg.prodYear}
                    />
                  </div>
                </div>
                <div className={styles["details-column"]}>
                <div className={styles["form-field"]}>
                    <TextField label="Korhatár" variant='standard' type='number' autoComplete='off' InputLabelProps={{ style:{transformOrigin: "50%" }}}
                      value={formState.ageLimit} onChange={(e) => handleFieldChange(e, "ageLimit")}
                      error={errorMsg.ageLimit !== undefined} helperText={errorMsg.ageLimit}
                    />
                  </div>
                </div>
              </div>
              <div className={styles["details-row"]}>
                <div className={styles["details-column"]}>
                  <div className={`${styles["form-field"]} ${styles["form-season-field"]}`}>
                    <div className={styles["season-field"]}>
                      <TextField label="Évad" variant='standard' InputProps={{ inputProps: { min: 1 } }} type='number' autoComplete='off' InputLabelProps={{ style:{transformOrigin: "50%" }}}
                        value={tempSeason.season} onChange={(e) => handleTempSeasonChange(e, "season")}
                        error={errorSeasonMsg.season !== undefined} helperText={errorSeasonMsg.season}
                      />
                    </div>
                    <div className={styles["season-field"]}>
                      <TextField label="Epizód" variant='standard' InputProps={{ inputProps: { min: 1 } }} type='number' autoComplete='off' InputLabelProps={{ style:{transformOrigin: "50%" }}}
                        value={tempSeason.episode} onChange={(e) => handleTempSeasonChange(e, "episode")}
                        error={errorSeasonMsg.episode !== undefined} helperText={errorSeasonMsg.episode}
                      />
                    </div>
                    <Button className={styles["season-button"]} type="button" variant="contained" color="success" onClick={saveSeason} disabled={!isTempSeasonValuesValid()}>
                      Mentés
                    </Button>
                  </div>
                </div>
                <div className={styles["details-column"]}>
                  <DropdownBar options={getCategoryOptions()} header='Kategóriák' width='100%'
                      changeHeader={false} action={true} setSelected={handleCategory}
                  />
                </div>
              </div>
              <div className={styles["details-row"]}>
                <div className={styles["details-column"]}>
                  <DropdownBar options={getSeasonOptions()} header="Évadok" width='100%'
                      changeHeader={false} action={true} setSelected={removeSeason}
                  />
                </div>
                <div className={`${styles["details-column"]} ${styles["form-season-field"]}`}>
                  <input hidden name="image" type="file" id="image" ref={fileInput} onChange={uploadFile}/>
                  <Button className={styles["image-button"]} type="button" variant="contained" onClick={() => fileInput.current.click()}>
                    {formState.image ? "Borítókép módosítás" : "Borítókép feltöltés"}
                  </Button>
                  {formState.image &&
                  <>
                    <IconButton title="Borítókép törlése" type="button" color="error" onClick={removeImage}>
                      <Icon>
                        delete
                      </Icon>
                    </IconButton>
                    <div>
                      <div className={styles["image-offset"]} title="Horizontális eltolás">
                        <TextField label="X" variant='standard' type='text' autoComplete='off' InputLabelProps={{ style:{transformOrigin: "50%" }}}
                            value={formState.image.x_offset} onChange={(e) => handleImageOffsetChange(e, "x_offset")}
                        />
                      </div>
                      <div className={styles["image-offset"]} title="Vertikális eltolás">
                        <TextField label="Y" variant='standard' type='text' autoComplete='off' InputLabelProps={{ style:{transformOrigin: "50%" }}}
                            value={formState.image.y_offset} onChange={(e) => handleImageOffsetChange(e, "y_offset")}
                        />
                      </div>
                    </div>
                  </>
                  }
                </div>
              </div>
            </div>
            <Button className={styles["form-button"]} variant="contained" type="submit" 
                disabled={!SeriesSchema.isValidSync(formState)}>
                  Mentés
            </Button>
          </form>
        </div>}
      </div>
    </div>
  )
}

const SeriesSchema = yup.object().shape({
  id: yup.number(),
  title: yup.string().required("Cím megadása kötelező!"),
  length: yup.number().required("Hossz megadása kötelező!").min(1, "Legalább 1 perc hosszúnak kell lennie!"),
  prodYear: yup.number().required("Kiadási éve megadása kötelező!").min(1900, "A kiadása legalább 1900 lehet!"),
  ageLimit: yup.number().required("Korhatár megadása kötelező!").min(1, "A korhatár alsóhatára 1 év!"),
  seasons: yup.array().optional(),
  categories: yup.array().optional()
});

const formInit: SeriesFormState = {
  id: undefined,
  title: "",
  length: "",
  prodYear: "",
  ageLimit: "",
  seasons: [],
  categories: [],
  image: undefined,
}

const initSeason: TempSeason = {
  season: "",
  episode: "",
}