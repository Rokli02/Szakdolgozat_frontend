import { DropdownItem } from '../models/menu.model';
import { Series, SeriesPageModel } from '../models/series.model';
import http from './axiosConfig';

export const getSeriesesRequest = async (page: number, size: number, filter?: string, order?: string, direction?: boolean): Promise<SeriesPageModel> => {
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

  return await http.get<SeriesPageModel>(`serieses/page/${page}`, {
      params
    })
    .then((res) => res.data)
    .catch((err) => {
      throw err;
    });
}

export const getSeriesRequest = async (id: number): Promise<Series> => {
  return await http.get<{ series: Series}>(`serieses/${id}`)
    .then((res) => res.data.series)
    .catch((err) => {
      throw err;
    });
}

export const saveSeriesRequest = async (newSeries: Series) => {
  return await http.post<{ series: Series}>("serieses", {
    ...newSeries
  })
    .then((res) => res.data.series)
    .catch((err) => {
      throw err;
    });
}

export const updateSeriesRequest = async (id: number, updatedSeries: Series) => {
  return await http.put<{ message: string}>(`serieses/${id}`, {
      ...updatedSeries
    })
    .then((res) => res.data.message)
    .catch((err) => {
      throw err;
    });
}

export const deleteImageRequest = async (seriesId: number) => {
  return await http.delete<{ message: string}>(`serieses/image/${seriesId}`)
    .then((res) => res.data.message)
    .catch((err) => {
      throw err;
    });
}

export const getOrders = (): DropdownItem[] => {
  return [
    { shownValue: "Nincs", value: "" },
    { shownValue: "Cím", value: "title" },
    { shownValue: "Korhatár", value: "ageLimit"},
    { shownValue: "Hossz", value: "length"},
    { shownValue: "Kiadási év", value: "prodYear"}
  ]
}

export const getLimitColor = (age: number) => {
  if(age >= 18) {
    return 'var(--red)';
  }

  if(age >= 16) {
    return '#F19F24'
  }

  if(age >= 12) {
    return '#FCFF5A'
  }

  return '#51D911'
}

export const getSeasonOptions = (series: Series) => {
  const options: DropdownItem[] = [];
  if(!series || !series.seasons) {
    return options;
  }

  for(const season of series.seasons.sort((a, b) => a.season - b.season)) {
    options.push({
      shownValue: `${season.season}.évad, ${season.episode} rész`,
      value: season.id
    });
  }
  return options;
}

export const getCategories = (series: Series): string => {
  return series.categories.map((category) => category.name).join(', ');
}