import { v4 as uuidv4 } from "uuid";

export const MinDate = new Date(-8640000000000000);
export const MinTimeStamp = MinDate.getTime();

export interface Bookmark {
  name: string;
  backgroundColor: string;
  color: string;
  timestamp: number;
  id: string;
}

export const DefaultBookmark: Bookmark = {
  name: "",
  id: "",
  backgroundColor: "",
  color: "",
  timestamp: MinTimeStamp,
};

export function ensureBookmarkMembers(bookmark: Bookmark) {
  if (!bookmark.id) {
    bookmark.id = uuidv4();
  }

  if (!bookmark.timestamp) {
    bookmark.timestamp = MinTimeStamp;
  }
}
