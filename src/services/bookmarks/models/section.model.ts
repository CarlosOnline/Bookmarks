import { Bookmark, DefaultBookmark, Link } from ".";

export interface Section extends Bookmark {
  children: Link[];
}

export const DefaultSection: Section = {
  ...DefaultBookmark,
  children: [],
};
