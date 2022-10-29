import { Switch } from '@mui/material';
import { AxiosError } from 'axios';
import { useCallback, useContext, useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { DropdownBar } from '../../components/items/drop-down-bar/DropdownBar';
import { NewsfeedItem } from '../../components/items/newsfeed-item/NewsfeedItem';
import { SearchBar } from '../../components/items/search-bar/SearcBar';
import { AuthContext } from '../../contexts/authContext';
import { DetectBottomContext } from '../../contexts/detectBottomContext';
import { SnackbarContext } from '../../contexts/snackbarContext';
import { DropdownItem } from '../../models/menu.model';
import { NewsfeedPageModel } from '../../models/newsfeed.model';
import { hasRight } from '../../utils/auth-utils';
import { getNewsfeedsRequest, getOrders, getPersonalNewsfeedsRequest } from '../../utils/newsfeed-utils';
import styles from './Newsfeed.module.css';

type NewsfeedState = {
  page: number;
  size: number;
  filter?: string;
  order?: string;
  direction?: boolean;
}

export const Newsfeed = () => {
  const [orders] = useState<DropdownItem[]>(getOrders());
  const [state, setState] = useState<NewsfeedState>({ page: 1, size: 12, direction: false });
  const [newsfeed, setNewsfeed] = useState<NewsfeedPageModel>({ newsfeeds: [], count: -1 });
  const { setMessage } = useContext(SnackbarContext);
  const { logout, user } = useContext(AuthContext);
  const { reachedBottom } = useContext(DetectBottomContext);
  const currentPath = useLocation().pathname;
  
  const increasePageSize = useCallback(() => {
    if(newsfeed.newsfeeds.length < newsfeed.count && state.page*state.size < newsfeed.count) {
      setState((pre) => ({
        ...pre,
        page: pre.page + 1,
      }));
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  },[newsfeed]);

  const fetchData = useCallback(async () => {
    if(state.page > 1) {
      await pushNewsfeeds();
    } else {
      if(currentPath === "/user/newsfeed") {
        if(hasRight(["user"], user)) {
          await getPersonalNewsfeeds();
        } else {
          setMessage("Nem sikerült az újdonságok betöltése, próbáld újra!");
        }
      } else {
        await getNewsfeeds();
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state]);
  const getNewsfeeds = async () => {
    try {
      const response = await getNewsfeedsRequest(1, state.size, state.filter, state.order, state.direction);
      setNewsfeed({ count: response.count, newsfeeds: response.newsfeeds });
    } catch(err) {
      if((err as AxiosError).response?.status === 401) {
        logout();
      }
      setMessage((err as AxiosError<any>).response?.data?.message);
    }
  }

  const getPersonalNewsfeeds = async () => {
    try {
      const response = await getPersonalNewsfeedsRequest(1, state.size, state.filter, state.order, state.direction);
      setNewsfeed({ count: response.count, newsfeeds: response.newsfeeds });
    } catch(err) {
      if((err as AxiosError).response?.status === 401) {
        logout();
      }
      setMessage((err as AxiosError<any>).response?.data?.message);
    }
  }

  const pushNewsfeeds = async () => {
    try {
      const response = await getNewsfeedsRequest(state.page, state.size, state.filter, state.order, state.direction);
      setNewsfeed((pre) => ({
        count: response.count,
        newsfeeds: [...pre.newsfeeds, ...response.newsfeeds]
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
          <DropdownBar action={true} header="Rendezés" options={orders} setSelected={handleSelectedOrder}/>
        </div>
      </header>
      {
        newsfeed.newsfeeds.length > 0
        ? <div className={styles["items"]}> 
            <div >
              {newsfeed.newsfeeds.map((newsfeed) => (
                <NewsfeedItem key={newsfeed.id} newsfeed={newsfeed} user={user} />
                ))}
            </div>
          </div>
        : <div className={styles["items"]} style={{ textAlign: "center"}}>
            <h1>Nincsennek megjeleníthető újdonság</h1>
          </div>
      }
    </main>
  )
}