/* eslint-disable @typescript-eslint/no-explicit-any */
import { v4 as uuidv4 } from "uuid";
import { orderBy, uniqBy } from "lodash";

import { Link, MinTimeStamp, Section } from "../..";
import { LocalData } from "../../../../support/local-storage";
import { DefaultColor } from "../../../colors";

const RecentCount: number = LocalData.get("recent-count", 5);

if (!Array.prototype.sanitizeSections) {
  Array.prototype.sanitizeSections = function (this: Section[]) {
    this.forEach((section) => {
      section.id = "";

      if (section.backgroundColor == DefaultColor.backgroundColor) {
        section.backgroundColor = "";
      }

      if (section.color == DefaultColor.color) {
        section.color = "";
      }

      section.children.sanitizeLinks();
    });
  };
}

if (!Array.prototype.sanitizeLinks) {
  Array.prototype.sanitizeLinks = function (this: Link[]) {
    this.forEach((link) => {
      link.id = undefined;

      if (link.backgroundColor == DefaultColor.backgroundColor) {
        link.backgroundColor = undefined;
      }

      if (link.color == DefaultColor.color) {
        link.color = undefined;
      }

      if (link.timestamp == MinTimeStamp) {
        link.timestamp = undefined;
      }

      if (!link.clickCount) {
        link.clickCount = undefined;
      }
    });
  };
}

if (!Array.prototype.ensureSectionMembers) {
  Array.prototype.ensureSectionMembers = function (this: Section[]) {
    this.forEach((section) => {
      if (!section.id) {
        section.id = uuidv4();
      }

      if (section.backgroundColor == DefaultColor.backgroundColor) {
        section.backgroundColor = "";
      }

      if (section.color == DefaultColor.color) {
        section.color = "";
      }

      section.children.ensureLinkMembers();
    });
  };
}

if (!Array.prototype.ensureLinkMembers) {
  Array.prototype.ensureLinkMembers = function (this: Link[]) {
    this.forEach((link) => {
      if (!link.id) {
        link.id = uuidv4();
      }

      if (link.backgroundColor == DefaultColor.backgroundColor) {
        link.backgroundColor = "";
      }

      if (link.color == DefaultColor.color) {
        link.color = "";
      }

      if (!link.timestamp) {
        link.timestamp = MinTimeStamp;
      }

      link.name = link.name?.trim();
      link.href = link.href?.trim();
    });
  };
}

if (!Array.prototype.removeMembers) {
  Array.prototype.removeMembers = function (
    this: Section[],
    removable: string[]
  ) {
    const sections = <Section[]>JSON.parse(JSON.stringify(this));
    if (sections.length == 0) sections;

    return JSON.parse(
      JSON.stringify(
        sections,
        (key, value) => {
          if (removable.indexOf(key) != -1) {
            return undefined;
          }

          if (!value) {
            return undefined;
          }

          return value;
        },
        3
      )
    ) as Section[];
  };
}

if (!Array.prototype.links) {
  Array.prototype.links = function (this: Section[]) {
    const links: Link[] = [];

    this.forEach((section) => {
      links.push(...section.children);
    });

    return uniqBy(links, (link) => link.id);
  };
}

if (!Array.prototype.recentBookmarks) {
  Array.prototype.recentBookmarks = function (this: Section[]) {
    const links = this.links().filter((item) => item.clickCount);
    return orderBy(
      links,
      ["clickCount", "timestamp", "name"],
      ["desc", "desc", "asc"]
    ).slice(0, RecentCount);
  };
}
