
export interface SidebarItem {
  name: string;
  link: string;
}

export interface StoredSidebarItem extends SidebarItem {
  order: number;
  right: string[];
}
