import { DropdownItem } from '../models/menu.model';
import { Series, Status, UserSeries, UserSeriesPageModel } from '../models/series.model';
import http from './axiosConfig';

export const getUserSeriesesRequest = async (page: number, size: number, status?: number, filter?: string, order?: string, direction?: boolean): Promise<UserSeriesPageModel> => {
  let params: any = { size };

  if(order && order !== '') {
    params.ordr = order;
  }
  if(direction === true) {
    params.dir = direction;
  }

  if(filter && filter !== '') {
    params.filt = filter;
  }

  if(status && status > 0) {
    params.stat = status;
  }

  return await http.get<UserSeriesPageModel>(`user/series/page/${page}`, {
      params
    })
    .then((res) => res.data)
    .catch((err) => {
      throw err;
    });
}

export const getUserSeriesRequest = async (id: number) => {
  return await http.get<{ series: UserSeries}>(`user/series/${id}`)
  .then((res) => res.data.series)
  .catch((err) => {
    throw err;
  });
}

export const saveUserSeriesRequest = async (newUserseries: UserSeries) => {
  return await http.post<{ series: UserSeries}>(`user/series`, {
    ...newUserseries
  })
  .then((res) => res.data.series)
  .catch((err) => {
    throw err;
  });
}

export const defaultSaveUserSeriesRequest = async (seriesId: number) => {
  const newUserseries: UserSeries = {
    series: { id: seriesId } as Series,
    season: 1,
    episode: 1,
    status: { id: 1 } as Status
 }
  return await http.post<{ series: UserSeries}>(`user/series`, {
    ...newUserseries
  })
  .then((res) => res.data.series)
  .catch((err) => {
    throw err;
  });
}

export const updateUserSeriesRequest = async (id: number, updateUserseries: UserSeries) => {
  return await http.put<{ message: string}>(`user/series/${id}`, {
    ...updateUserseries
  })
  .then((res) => res.data.message)
  .catch((err) => {
    throw err;
  });
}

export const deleteUserSeriesRequest = async (id: number) => {
  return await http.delete<{ message: string}>(`user/series/${id}`)
  .then((res) => res.data.message)
  .catch((err) => {
    throw err;
  });
}

export const getOrders = (): DropdownItem[] => {
  return [
    { shownValue: "Nincs", value: "" },
    { shownValue: "Cím", value: "title" },
    { shownValue: "Korhatár", value: "age_limit"},
    { shownValue: "Hossz", value: "length"},
    { shownValue: "Utolsó módosítás", value: "modification"},
    { shownValue: "Kiadási év", value: "prod_year"}
  ]
}