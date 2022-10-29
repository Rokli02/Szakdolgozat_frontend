import { Switch } from '@mui/material';
import { AxiosError } from 'axios';
import { useCallback, useContext, useEffect, useState } from 'react';
import { DropdownBar } from '../../components/items/drop-down-bar/DropdownBar';
import { SearchBar } from '../../components/items/search-bar/SearcBar';
import { UserseriesItem } from '../../components/items/userseries-item/UserseriesItem';
import { AuthContext } from '../../contexts/authContext';
import { DetectBottomContext } from '../../contexts/detectBottomContext';
import { SnackbarContext } from '../../contexts/snackbarContext';
import { DropdownItem } from '../../models/menu.model';
import { UserSeriesPageModel } from '../../models/series.model';
import { getStatusesRequest } from '../../utils/status-utils';
import { getOrders, getUserSeriesesRequest } from '../../utils/userseries-utils';
import styles from './UserSeries.module.css';

type UserSeriesState = {
  page: number;
  size: number;
  status?: number;
  filter?: string;
  order?: string;
  direction?: boolean;
}

export const UserSeriesPage = () => {
  const [orders] = useState<DropdownItem[]>(getOrders());
  const [statuses, setStatuses] = useState<DropdownItem[]>([]);
  const [state, setState] = useState<UserSeriesState>({ page: 1, size: 12, direction: false });
  const [series, setSeries] = useState<UserSeriesPageModel>({ serieses: [], count: -1 });
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
      const response = await getUserSeriesesRequest(1, state.size, state.status, state.filter, state.order, state.direction);
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
      const response = await getUserSeriesesRequest(state.page, state.size, state.status, state.filter, state.order, state.direction);
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

  const handleSelectedStatus = (value: number) => {
    setState((pre) => ({
      ...pre,
      status: value,
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
    getStatusesRequest().then((statuses) => {
      setStatuses([{ value: "", shownValue: "Nincs" } ,...statuses.map((status) => ({ value: status.id, shownValue: status.name }) as DropdownItem)]);
    }).catch((err) => {
      setMessage((err as AxiosError<any>).response?.data.message);
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

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
          <DropdownBar action={true} header="Állapot" options={statuses} setSelected={handleSelectedStatus}/>
        </div>
        <div className={styles["search-item"]}>
          <SearchBar setSearchValue={handleSearchValue} />
          <div className={styles["direction"]}>
            <Switch size='medium' checked={state.direction} onClick={handleDirection}/>
            <span>{state.direction ? "Növekvő sorrend" : "Csökkenő sorrend"}</span>
          </div>
        </div>
        <div className={styles["search-item"]}>
          <DropdownBar action={true} header="Rendezés" options={orders} setSelected={handleSelectedOrder}/>
        </div>
      </header>
      {
        series.serieses.length > 0
        ?
        <div className={styles["items"]}>
          {
            series.serieses.map((series) => (
              <div key={series.id}>
                <UserseriesItem userseries={series} user={user} />
              </div>
            ))
          }
        </div>
        :
        <div className={styles["items"]}>
          <h1>Nincsennek megjeleníthető sorozatok</h1>
        </div>
      }
    </main>

  )
}