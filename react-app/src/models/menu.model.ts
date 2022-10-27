
export interface SidebarItem {
  name: string;
  link: string;
}

export interface StoredSidebarItem extends SidebarItem {
  order: number;
  right: string[];
}

export interface DropdownItem {
  shownValue: string;
  highlight?: boolean;
  value?: any;
}

export interface PageOptions {
  page: number;
  size: number;
  order?: string;
  filter?: string;
  direction?: boolean;
}

export type PageOptionsKeys = "page" | "size" | "order" | "filter" | "direction";

export interface UserSeriesPageOptions extends PageOptions {
  status?: number;
}

export type UserSeriesPageOptionsKeys = PageOptionsKeys | "status";

export type ErrorMessage = {
  error: {
    message: string;
  };
}

export type ConfirmationDialogData = {
  question: string;
}

export type BackendLocations = {
  [name: string]: string;
};

export type BackendLocationNames = "fastify" | "express";
