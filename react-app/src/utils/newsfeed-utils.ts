import { DropdownItem } from '../models/menu.model'
import { Newsfeed, NewsfeedPageModel } from '../models/newsfeed.model';
import http from './axiosConfig';

export const getNewsfeedsRequest = async (page: number, size: number, filter?: string, order?: string, direction?: boolean): Promise<NewsfeedPageModel> => {
  let params: any = { size };

  if(order && order !== '') {
    params.ordr = order;
  }
  if(direction === true) {
    params.dir = direction
  }

  if(filter && filter !== '') {
    params.filt = filter
  }

  return await http.get<NewsfeedPageModel>(`newsfeeds/page/${page}`, {
      params
    })
    .then((res) => res.data)
    .catch((err) => {
      throw err;
    });
}

export const getPersonalNewsfeedsRequest = async (page: number, size: number, filter?: string, order?: string, direction?: boolean): Promise<NewsfeedPageModel> => {
  let params: any = { size };

  if(order && order !== '') {
    params.ordr = order;
  }
  if(direction === true) {
    params.dir = direction
  }

  if(filter && filter !== '') {
    params.filt = filter
  }

  return await http.get<NewsfeedPageModel>(`newsfeeds/personal/page/${page}`, {
      params
    })
    .then((res) => res.data)
    .catch((err) => {
      throw err;
    });
}

export const getNewsfeedRequest = async (id: number): Promise<Newsfeed> => {
  return await http.get<{ newsfeed: Newsfeed}>(`newsfeeds/${id}`)
    .then((res) => res.data.newsfeed)
    .catch((err) => {
      throw err;
    });
}

export const saveNewsfeedRequest = async (newNewsfeed: Newsfeed): Promise<Newsfeed> => {
  return await http.post<{ newsfeed: Newsfeed}>("newsfeeds/edit", {
    ...newNewsfeed
  })
    .then((res) => res.data.newsfeed)
    .catch((err) => {
      throw err;
    });
}

export const updateNewsfeedRequest = async (id: number, updatedNewsfeed: Newsfeed): Promise<string> => {
  return await http.put<{ message: string}>(`newsfeeds/edit/${id}`, {
    ...updatedNewsfeed
  })
    .then((res) => res.data.message)
    .catch((err) => {
      throw err;
    });
}

export const deleteNewsfeedRequest = async (id: number): Promise<string> => {
  return await http.delete<{ message: string}>(`newsfeeds/edit/${id}`)
    .then((res) => res.data.message)
    .catch((err) => {
      throw err;
    });
}

export const getOrders = (): DropdownItem[] => {
  return [
    { shownValue: "Nincs", value: "" },
    { shownValue: "Cím", value: "title" },
    { shownValue: "Sorozat", value: "series"},
    { shownValue: "Utolsó módosítás", value: "modification"}
  ]
}