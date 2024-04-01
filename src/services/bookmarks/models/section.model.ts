import { Bookmark, DefaultBookmark, Link, ensureBookmarkMembers } from ".";

export interface Section extends Bookmark {
  children: Link[];
}

export const DefaultSection: Section = {
  ...DefaultBookmark,
  children: [],
};

export function ensureSectionMembers(section: Section) {
  ensureBookmarkMembers(section);
  section.children = [];
}
