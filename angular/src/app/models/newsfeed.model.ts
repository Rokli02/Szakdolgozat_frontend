
export interface Newsfeed {
  id?: number;
  title: string;
  description: string;
  modification: string;
  series: {
    id?: number;
    title: string;
  }
}
