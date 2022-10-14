export interface Series {
  id?: number;
  title: string;
  prodYear: number;
  ageLimit: number;
  length: number;
  seasons: Season[];
  categories: Category[];
};

export type Season = {
  id?: number;
  season: number;
  episode: number;
};

export type Category = {
  id?: number;
  name: string;
}
