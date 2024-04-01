import { Bookmark, DefaultBookmark, ensureBookmarkMembers } from ".";

export interface Link extends Bookmark {
  href: string;
  clickCount: number;
}

export const DefaultLink: Link = {
  ...DefaultBookmark,
  href: "",
  clickCount: 0,
};

export function ensureLinkMembers(link: Link) {
  ensureBookmarkMembers(link);

  if (link.clickCount == undefined) {
    link.clickCount = 0;
  }
}
