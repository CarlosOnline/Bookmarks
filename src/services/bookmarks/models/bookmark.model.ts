import { MinTimeStamp } from "../sections-holder";

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
