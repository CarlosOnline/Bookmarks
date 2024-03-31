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
