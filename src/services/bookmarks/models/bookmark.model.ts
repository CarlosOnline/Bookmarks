export interface Bookmark {
  name: string;
  backgroundColor: string;
  color: string;
  timestamp: Date;
  id: string;
}

export const DefaultBookmark: Bookmark = {
  name: "",
  id: "",
  backgroundColor: "",
  color: "",
  timestamp: new Date(),
};
