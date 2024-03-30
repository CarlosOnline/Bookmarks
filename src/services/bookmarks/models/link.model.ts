import { Bookmark, DefaultBookmark } from ".";

export interface Link extends Bookmark {
  href: string;
  clickCount: number;
}

export const DefaultLink: Link = {
  ...DefaultBookmark,
  href: "",
  clickCount: 0,
};
