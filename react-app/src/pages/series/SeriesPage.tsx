import { Switch } from '@mui/material';
import { AxiosError } from 'axios';
import { useCallback, useContext, useEffect, useState } from 'react';
import { DropdownBar } from '../../components/items/drop-down-bar/DropdownBar';
import { SearchBar } from '../../components/items/search-bar/SearchBar';
import { SeriesItem } from '../../components/items/series-item/SeriesItem';
import { AuthContext } from '../../contexts/authContext';
import { DetectBottomContext } from '../../contexts/detectBottomContext';
import { SnackbarContext } from '../../contexts/snackbarContext';
import { DropdownItem } from '../../models/menu.model';
import { SeriesPageModel } from '../../models/series.model';
import { getOrders, getSeriesesRequest } from '../../utils/series-utils';
import styles from './Series.module.css';

type SeriesState = {
  page: number;
  size: number;
  filter?: string;
  order?: string;
  direction?: boolean;
}

export const SeriesPage = () => {
  const [orders] = useState<DropdownItem[]>(getOrders());
  const [state, setState] = useState<SeriesState>({ page: 1, size: 12, direction: false });
  const [series, setSeries] = useState<SeriesPageModel>({ serieses: [], count: -1 });
  const { setMessage } = useContext(SnackbarContext);
  const { logout, user } = useContext(AuthContext);
  const { reachedBottom } = useContext(DetectBottomContext);
  
  const increasePageSize = useCallback(() => {
    if(series.serieses.length < series.count && state.page*state.size < series.count) {
      setState((pre) => ({
        ...pre,
        page: pre.page + 1,
      }));
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  },[series]);
  
  const fetchData = useCallback(async () => {
    if(state.page > 1) { 
      await pushSerieses();
    } else {
      await getSerieses();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state]);
  const getSerieses = async () => {
    try {
      const response = await getSeriesesRequest(1, state.size, state.filter, state.order, state.direction);
      setSeries({ count: response.count, serieses: response.serieses });
    } catch(err) {
      if((err as AxiosError).response?.status === 401) {
        logout();
      }
      setMessage((err as AxiosError<any>).response?.data?.message);
    }
  }

  const pushSerieses = async () => {
    try {
      const response = await getSeriesesRequest(state.page, state.size, state.filter, state.order, state.direction);
      setSeries((pre) => ({
        count: response.count,
        serieses: [...pre.serieses, ...response.serieses]
      }));
    } catch(err) {
      if((err as AxiosError).response?.status === 401) {
        logout();
      }
      setMessage((err as AxiosError<any>).response?.data?.message);
    }
  }

  const handleSelectedOrder = (value: string) => {
    setState((pre) => ({
      ...pre,
      order: value,
      page: 1,
    }))
  }

  const handleSearchValue = (searchValue: string) => {
    setState((pre) => ({
      ...pre,
      filter: searchValue,
      page: 1,
    }))
  }

  const handleDirection = () => {
    setState((pre) => ({
      ...pre,
      direction: !pre.direction,
      page: 1,
    }))
  }

  useEffect(() => {
    if(reachedBottom) {
      increasePageSize();
    }
  }, [reachedBottom, increasePageSize]);

  useEffect(() => {
    fetchData();
  }, [fetchData, state])

  return (
    <main className={styles["container"]}>
      <header className={styles["search"]}>
        <div className={styles["search-item"]}>
        </div>
        <div className={styles["search-item"]}>
          <SearchBar setSearchValue={handleSearchValue} />
          <div className={styles["direction"]}>
            <Switch size='medium' checked={state.direction} onClick={handleDirection}/>
            <span>{state.direction ? "Növekvő sorrend" : "Csökkenő sorrend"}</span>
          </div>
        </div>
        <div className={styles["search-item"]}>
          <DropdownBar action={true} header='Rendezés' options={orders} setSelected={handleSelectedOrder}/>
        </div>
      </header>
      {
        series.serieses.length > 0
        ? <div className={styles["items"]}>
            { series.serieses.map((series) => (
              <SeriesItem key={series.id} series={series} user={user}/>
            ))}
          </div>
        : <div className={styles["items"]}>
            <h1>Nincsennek megjeleníthető sorozatok</h1>
          </div>
      }
    </main>
  )
}