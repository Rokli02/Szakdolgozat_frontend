export interface Series {
  id?: number;
  title: string;
  prodYear: number;
  ageLimit: number;
  length: number;
  seasons: Season[];
  categories: Category[];
};

export interface UserSeries {
  id?: number;
  season: number;
  episode: number;
  series: Series;
  status: Status;
}

export type SeriesPageModel = {
  serieses: Series[];
  count: number;
}

export type UserSeriesPageModel = {
  serieses: UserSeries[];
  count: number;
}

export type Season = {
  id?: number;
  season: number;
  episode: number;
};

export type Category = {
  id?: number;
  name: string;
}

export type Status = {
  id?: number;
  name: string;
}
