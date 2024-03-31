/* eslint-disable @typescript-eslint/no-explicit-any */
import { v4 as uuidv4 } from "uuid";
import { orderBy, uniqBy } from "lodash";

import { Link, Section, Bookmark, LinkInfo, DefaultLink } from ".";
import { LocalData } from "../../support/local-storage";
import { DefaultColor } from "../colors";

export const MinDate = new Date(-8640000000000000);
export const MinTimeStamp = MinDate.getTime();
const RecentCount: number = LocalData.get("recent-count", 5);

function normalizeSection(section: Bookmark) {
  if (!section.id) {
    section.id = uuidv4();
  }

  if (section.backgroundColor == DefaultColor.backgroundColor) {
    section.backgroundColor = "";
  }

  if (section.color == DefaultColor.color) {
    section.color = "";
  }
}

function normalizeLink(link: Link, section: Bookmark) {
  if (!link.id) {
    link.id = uuidv4();
  }

  if (link.backgroundColor == section.backgroundColor) {
    link.backgroundColor = "";
  }

  if (link.color == section.color) {
    link.color = "";
  }

  if (link.clickCount && !link.timestamp) {
    link.timestamp = MinTimeStamp;
  }

  link.name = link.name?.trim();
  link.href = link.href?.trim();
}

export function normalizeData(sections: Section[]) {
  sections.forEach((section) => {
    normalizeSection(section);
    section.children.forEach((link) => {
      normalizeLink(link, section);
    });
  });
}

export function replaceDuplicatesForLink(link: Link, linkInfos: LinkInfo[]) {
  const matchingLinks = linkInfos.filter(
    (item) =>
      item.link !== link &&
      item.link.name == link.name &&
      item.link.href == link.href
  );

  matchingLinks.forEach((duplicate) => {
    const idx = duplicate.section.children.indexOf(duplicate.link);
    if (idx != -1) {
      const oldLink = duplicate.section.children[idx];
      duplicate.section.children.splice(idx, 1, link);

      const found = linkInfos.find((item) => item.link == oldLink);
      if (!found) return;

      const foundIdx = linkInfos.indexOf(found);
      if (foundIdx != -1) {
        linkInfos.splice(foundIdx, 1);
      }
    }
  });
}

export function cleanDataSections(sections: Section[], removable: string[]) {
  sections = <Section[]>JSON.parse(JSON.stringify(sections));
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
}

export class SectionsHolder {
  private sections: Section[];

  constructor(sections: Section[]) {
    this.sections = sections;
  }

  get links() {
    const links: Link[] = [];

    this.sections.forEach((section) => {
      links.push(...section.children);
    });

    return uniqBy(links, (link) => link.id);
  }

  get linkInfos() {
    return this.getLinkInfos(this.sections);
  }

  get recentBookmarks() {
    const links = this.links.filter((item) => item.clickCount);
    return orderBy(
      links,
      ["clickCount", "timestamp", "name"],
      ["desc", "desc", "asc"]
    ).slice(0, RecentCount);
  }

  public findSection(section: Bookmark) {
    const found = this.sections.find((item) => {
      if (section.id && item.id) {
        return item.id === section.id;
      }
      return false;
    });

    if (!found) {
      Debug.error("Missing section", section.name, section.id);
      throw `Missing section ${section.name} ${section.id}`;
    }

    return found;
  }

  public findSectionByName(name: string) {
    return this.sections.find((item) => item.name == name);
  }

  public addToSection(newLink: Link, parent: Section) {
    Debug.log("addToSection", newLink.name, parent.name);

    const section = this.findSection(parent);
    section.children.splice(0, 0, newLink);

    this.replaceDuplicateLink(newLink, this.sections);

    return this.findLink(section, newLink);
  }

  public append(newLink: Link, parent: Section) {
    Debug.log("append", newLink.name, parent.name);

    parent = this.findSection(parent);
    parent.children.push(newLink);

    this.replaceDuplicateLink(newLink, this.sections);

    return this.findLink(parent, newLink);
  }

  public findLink(section: Section, link: Bookmark) {
    const found = section.children.find((item) => {
      if (link.id && item.id) {
        return item.id === link.id;
      }
      return false;
    });

    if (!found) {
      Debug.error("Missing link", link.name, link.id);
      throw `Missing link ${link.name} ${link.id}`;
    }

    return found;
  }

  public findLinkById(id: string) {
    const found: LinkInfo[] = [];

    this.sections.forEach((section) => {
      const links = section.children.filter((link) => link.id === id);
      if (links.length) {
        const linkInfos = links.map(
          (item) =>
            <LinkInfo>{
              section: section,
              link: item,
            }
        );
        found.push(...linkInfos);
      }
    });

    if (!found.length) {
      Debug.error("Missing link with id", id);
      throw `Missing link with id ${id}`;
    }

    return found[0];
  }

  public insertAfter(newLink: Link, parent: Section, child: Link) {
    Debug.log("insertAfter", newLink.name, parent.name, child.name);

    parent = this.findSection(parent);
    child = this.findLink(parent, child);

    const idx = parent.children.indexOf(child);
    if (idx == parent.children.length) {
      parent.children.push(newLink);
    } else {
      parent.children.splice(idx + 1, 0, newLink);
    }
  }

  public insertBefore(newLink: Link, parent: Section, child: Link) {
    Debug.log("insertBefore", newLink.name, parent.name, child.name);

    parent = this.findSection(parent);
    child = this.findLink(parent, child);

    const idx = Math.max(0, parent.children.indexOf(child));
    parent.children.splice(idx, 0, newLink);
  }

  public insertSectionAfter(newSection: Section, parent: Section) {
    Debug.log("insertSectionAfter", newSection.name, parent.name);

    parent = this.findSection(parent);
    const idx = this.sections.indexOf(parent);
    if (idx == this.sections.length - 1) {
      this.sections.push(newSection);
    } else {
      this.sections.splice(idx, 0, newSection);
    }
  }

  public insertSectionBefore(newSection: Section, parent: Section) {
    Debug.log("insertSectionBefore", newSection.name, parent.name);

    parent = this.findSection(parent);

    const idx = Math.max(0, this.sections.indexOf(parent));
    this.sections.splice(idx, 0, newSection);
  }

  public removeLink(parent: Section, child: Link) {
    Debug.log("removeLink", child.name, child.id);

    parent = this.findSection(parent);
    child = this.findLink(parent, child);

    const idx = parent.children.indexOf(child);
    parent.children.splice(idx, 1);

    if (parent.children.length == 0) {
      const placeholder = { ...DefaultLink, name: "New Bookmark" };
      parent.children.push(placeholder);
    }
  }

  public removeSection(section: Section) {
    Debug.log("removeSection", section.name, section.id);

    section = this.findSection(section);

    const idx = this.sections.indexOf(section);
    this.sections.splice(idx, 1);
  }

  public updateLink(parent: Section, child: Link) {
    const section = this.findSection(parent);
    const link = this.findLink(section, child);

    Debug.log(
      "updateLink",
      link.name,
      link.id,
      link.clickCount,
      link.timestamp?.toLocaleString()
    );

    link.backgroundColor = child.backgroundColor?.trim();
    link.color = child.color?.trim();
    link.href = child.href?.trim();
    link.name = child.name?.trim();
    link.timestamp = child.timestamp;

    if (link.clickCount && !link.timestamp) {
      link.timestamp = MinTimeStamp;
      console.error("reset timestamp for", link, child);
    }

    this.replaceDuplicateLink(link, this.sections);
  }

  public updateSection(section: Section) {
    Debug.log("updateSection", section.name, section.id);

    const found = this.findSection(section);

    found.backgroundColor = section.backgroundColor?.trim();
    found.color = section.color?.trim();
    found.name = section.name?.trim();
    found.timestamp = section.timestamp;
  }

  public getLinkInfos(sections: Section[]) {
    const results: LinkInfo[] = [];

    sections.forEach((section) => {
      section.children.forEach((link) => {
        results.push({
          section: section,
          link: link,
        });
      });
    });

    return results;
  }

  private replaceDuplicateLink(link: Link, sections: Section[]) {
    const linkInfos = this.getLinkInfos(sections);
    replaceDuplicatesForLink(link, linkInfos);
  }
}
