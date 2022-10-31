import { Button } from '@mui/material';
import { AxiosError } from 'axios';
import { useCallback, useContext, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Confirmation } from '../../../components/items/confirmation/Confirmation';
import { DropdownBar } from '../../../components/items/drop-down-bar/DropdownBar';
import { SearchBar } from '../../../components/items/search-bar/SearchBar';
import { SnackbarContext } from '../../../contexts/snackbarContext';
import { AutoCompleteItem, DropdownItem } from '../../../models/menu.model';
import { Status, UserSeries } from '../../../models/series.model';
import { getStatusesRequest } from '../../../utils/status-utils';
import { deleteUserSeriesRequest, getUserSeriesesRequest, getUserSeriesRequest, updateUserSeriesRequest } from '../../../utils/userseries-utils';
import styles from './UserseriesHandler.module.css';

export const UserseriesHandler = () => {
  const [searchValue, setSearchValue] = useState("");
  const [autocompleteOptions, setAutocompleteOptions] = useState<AutoCompleteItem[]>([]);
  const [seriesId, setSeriesId] = useState<number | undefined>(undefined);
  const [userseries, setUserseries] = useState<UserSeries | undefined>(undefined);
  const [statuses, setStatuses] = useState<Status[]>([]);
  const [openConfirmation, setOpenConfirmation] = useState(false);
  const navigate = useNavigate();
  const { id } = useParams();
  const { setMessage } = useContext(SnackbarContext);

  const submit = async (e: any) => {
    e.preventDefault();

    try {
      const response = await updateUserSeriesRequest(seriesId, userseries);
      if(response) {
        setMessage(response, "success");
        resetValues();
      }
    } catch(err) {
      if((err as AxiosError<any>).response.status === 401) {
        navigate("/logout");
      }
      setMessage((err as AxiosError<any>).response.data.message)
    }
  } 
  const remove = async () => {
    try {
      const response = await deleteUserSeriesRequest(seriesId);
      if(response) {
        setMessage(response, "success");
        navigate("/user/series");
      }
    } catch(err) {
      if((err as AxiosError<any>).response.status === 401) {
        navigate("/logout");
      }
      setMessage((err as AxiosError<any>).response.data.message)
    }
  }

  const setSearchValueWrapper = (searchValue: string) => {
    setSearchValue(searchValue);
  }
  const setAutocompleteValue = (seriesId: number) => {
    navigate(`/user/handle/series/${seriesId}`)
  }
  const setStatus = (statusId: number) => {
    const status = statuses.find((st) => st.id === statusId);
    if(status) {
      setUserseries((pre) => ({
        ...pre,
        status: status
      }));
    }
  }
  const closeConfirmation = () => {
    setOpenConfirmation(false);
  }
  const setSeason = (season: number) => {
    setUserseries((pre) => ({
      ...pre,
      season,
      episode: 1,
    }));
  }
  const setEpisode = (episode: number) => {
    setUserseries((pre) => ({
      ...pre,
      episode
    }));
  }

  const fetchUserseriesData = useCallback(async () => {
    try {
      const response = await getUserSeriesRequest(seriesId);
      if(response) {
        setUserseries(response);
      }
    } catch(err) {
      if((err as AxiosError<any>).response.status === 401) {
        navigate("/logout");
      }
      setMessage((err as AxiosError<any>).response.data.message)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [seriesId]);
  const fetchUserseriesDataAndMakeOptions = useCallback(async () => {
    try {
      const response = await getUserSeriesesRequest(1, 10, -1, searchValue);
      if(response) {
        setAutocompleteOptions(response.serieses.map((userseries) => ({ value: userseries.series.id, label: `${userseries.series.id}, ${userseries.series.title} | ${userseries.series.prodYear}`}) as AutoCompleteItem));
      }
    } catch(err) {
      if((err as AxiosError<any>).response.status === 401) {
        navigate("/logout");
      }
      setMessage((err as AxiosError<any>).response.data.message)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchValue]);
  const fetchStatusesData = useCallback(async () => {
    try {
      const response = await getStatusesRequest();
      if(response) {
        setStatuses(response);
      }
    } catch(err) {
      if((err as AxiosError<any>).response.status === 401) {
        navigate("/logout");
      }
      setMessage((err as AxiosError<any>).response.data.message)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const resetValues = () => {
    setSearchValue("");
    setAutocompleteOptions([]);
    fetchUserseriesData();
  }
  const getCategories = useCallback((): string => {
    if(userseries) {
      return userseries.series.categories.map((category) => category.name).join(", ") as string;
    }
    return "";
  }, [userseries]);
  const getStatusOptions = useCallback(() => {
    return statuses.map((status) => ({ value: status.id, shownValue: status.name, highlight: status.id === userseries.status.id }) as DropdownItem);
  }, [statuses, userseries]);
  const getSeasonOptions = () => {
    return userseries.series.seasons.map(season => ({ value: season.season, shownValue: season.season+'. Évad', highlight: season.season === userseries.season}) as DropdownItem);
  };
  const getEpisodeOptions = useCallback(() => {
    const episodeOptions: DropdownItem[] = [];
    const season = userseries.series.seasons.find((season) => season.season === userseries.season);

    if(season) {
      for(let i = 1; i <= season.episode; i++) {
        episodeOptions.push({ value: i, shownValue: i+'. Epizód', highlight: i === userseries.episode});
      }
    }
    return episodeOptions;
  }, [userseries]);

  useEffect(() => {
    
  }, [userseries]);
  useEffect(() => {
    fetchUserseriesDataAndMakeOptions()
  }, [searchValue, fetchUserseriesDataAndMakeOptions]);
  useEffect(() => {
    if(seriesId) {
      fetchUserseriesData();
    }
  }, [seriesId, fetchUserseriesData]);
  useEffect(() => {
    if(!isNaN(Number(id))) {
      setSeriesId(Number(id));
    }
  }, [id]);
  useEffect(() => {
    fetchStatusesData();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div>
      <Confirmation open={openConfirmation} handleClose={closeConfirmation} question="Biztos hogy eltávolítod?" onAccept={remove}/>
      <div className={styles["container"]}>
        <div className={styles["search"]}>
          <SearchBar options={autocompleteOptions} setSearchValue={setSearchValueWrapper} setAutocompleteValue={setAutocompleteValue}/>
        </div>
        {userseries &&
        <div className={styles["form-container"]}>
          <div className={styles["form-header"]}>
            <div className={styles["title"]}>
              <label>Sorozat módosítás</label>
            </div>
            <div className={styles["id"]}>
              <label>ID: {userseries.series.id}</label>
            </div>
          </div>
          <div className={styles["form-details"]}>
            <div className={styles["details-row"]}>
              <div>Cím: {userseries.series.title}</div>
              <div>Kategória: {getCategories()}</div>
            </div>
            <div className={styles["details-row"]}>
              <div>Kiadási év: {userseries.series.prodYear}</div>
              <div>Hossz: {userseries.series.length} perc</div>
            </div>
          </div>
          <div>
            <div className={styles["form-drop-bars"]}>
              <DropdownBar options={getSeasonOptions()} header={userseries.season+'. Évad'} action={true} setSelected={setSeason}/>
              <DropdownBar options={getEpisodeOptions()} header={userseries.episode+'. Epizód'} action={true} setSelected={setEpisode}/>
              <DropdownBar options={getStatusOptions()} header={userseries.status.name} action={true} setSelected={setStatus}/>
            </div>
            <div  className={styles["button-container"]}>
              <Button className={styles["form-button"]} variant="contained" onClick={submit}>Mentés</Button>
              <Button className={styles["form-button"]} variant="contained" onClick={() => setOpenConfirmation(true)} color="error">Törlés</Button>
            </div>
          </div>
        </div>}
      </div>
    </div>
  )
}
