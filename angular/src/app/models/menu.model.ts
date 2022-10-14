
export interface SidebarItem {
  name: string;
  link: string;
}

export interface StoredSidebarItem extends SidebarItem {
  order: number;
  right: string[];
}

export interface DropdownItem {
  value?: number | string;
  shownValue: string;
}

export interface PageOptions {
  page: number;
  size: number;
  order?: string;
  filter?: string;
  direction?: boolean;
}

export type PageOptionsKeys = "page" | "size" | "order" | "filter" | "direction";
