import { orderBy } from "lodash";
import colorutil from "color-util";

import { Link, Section } from "./bookmarks";

export interface ColorInfo {
  name?: string;
  backgroundColor: string;
  color: string;
}

export const BookmarkColors: Record<string, ColorInfo> = {
  ultramarineGreen: { backgroundColor: "#006B54", color: "white" },
  frenchBlue: { backgroundColor: "#0072b5", color: "white" },
  mosaicBlue: { backgroundColor: "#00758F", color: "white" },
  blue: { backgroundColor: "#007bff", color: "white" },
  mint: { backgroundColor: "#00a170", color: "white" },
  green: { backgroundColor: "#28a745", color: "white" },
  darkGray: { backgroundColor: "#2c3e50", color: "white" },
  blackGray: { backgroundColor: "#343a40", color: "white" },
  classicBlue: { backgroundColor: "#34568B", color: "white" },
  primary: { backgroundColor: "#428bca", color: "white" },
  turquoise: { backgroundColor: "#45B8AC", color: "white" },
  blueIzis: { backgroundColor: "#5B5EA6", color: "white" },
  indigo: { backgroundColor: "#6610f2", color: "white" },
  firedBrick: { backgroundColor: "#6A2E2A", color: "white" },
  magentaPurple: { backgroundColor: "#6C244C", color: "white" },
  secondary: { backgroundColor: "#6c757d", color: "white" },
  chiliPepper: { backgroundColor: "#9B2335", color: "white" },
  trueRed: { backgroundColor: "#BC243C", color: "white" },
  tangerineTango: { backgroundColor: "#DD4124", color: "white" },
  pink: { backgroundColor: "#e83e8c", color: "white" },
  orangePeel: { backgroundColor: "#FA7A35", color: "white" },
  livingCoral: { backgroundColor: "#FF6F61", color: "white" },
  saffron: { backgroundColor: "#FFA500", color: "black" },
};

type Rgba = {
  r: number;
  g: number;
  b: number;
  a: number;
};

export type ColorInfoElement = {
  name: string;
  rgba: Rgba;
  backgroundColor: string;
  color: string;
};

const BookmarkColorInfoArray = Object.keys(BookmarkColors).map((key) => {
  return {
    name: key,
    backgroundColor: BookmarkColors[key].backgroundColor,
    color: BookmarkColors[key].color,
    rgba: colorutil.hex.to.rgb(BookmarkColors[key].backgroundColor),
  };
});

function sortColors(colors: ColorInfoElement[]): ColorInfoElement[] {
  return orderBy(colors, [
    "rgba.a",
    "rgba.r",
    "rgba.g",
    "rgba.b",
    "backgroundColor",
    "color",
    "name",
  ]);
}

export const SortedBookmarkColors = sortColors(BookmarkColorInfoArray);

export const DefaultColorName = "primary";
export const DefaultColor = BookmarkColors[DefaultColorName];

export function getBookmarkColor(section?: Section | null, link?: Link | null) {
  return link?.color || section?.color || DefaultColor.color;
}

export function getBookmarkBackgroundColor(
  section?: Section | null,
  link?: Link | null
) {
  return (
    link?.backgroundColor ||
    section?.backgroundColor ||
    DefaultColor.backgroundColor
  );
}

Debug.setDebugModule("bookmarkColors", BookmarkColors);
