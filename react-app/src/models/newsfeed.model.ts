
export interface Newsfeed {
  id?: number;
  title: string;
  description: string;
  modification: string;
  series: {
    id: number;
    title: string;
    prodYear: number;
  }
}

export type NewsfeedPageModel = {
  newsfeeds: Newsfeed[];
  count: number;
}
