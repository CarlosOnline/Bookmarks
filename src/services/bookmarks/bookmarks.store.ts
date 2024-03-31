/* eslint-disable @typescript-eslint/no-explicit-any */
import { v4 as uuidv4 } from "uuid";
import { ref, toValue } from "vue";

import { Link, MinTimeStamp, Section } from ".";
import { LocalData } from "../../support/local-storage";
import { DefaultBookmarks } from "./default-bookmarks";

interface BookmarksState {
  refreshCount: number;
  sections: Section[];
}

const BookmarksKey = "bookmarks";

class BookmarksStore {
  private state = ref<BookmarksState>({
    refreshCount: 0,
    sections: [],
  });

  get sections(): Section[] {
    if (this.state.value.refreshCount) {
      // trigger refresh on save;
    }

    return this.state.value.sections;
  }

  get links() {
    return this.sections.links();
  }

  get linkInfos() {
    return this.sections.getLinkInfos();
  }

  get recentBookmarks() {
    return this.sections.recentBookmarks();
  }

  constructor() {
    this.load();
  }

  public addToSection(newLink: Link, parent: Section) {
    const result = this.sections.addToSection(newLink, parent);
    this.saveSections();
    return result;
  }

  public append(newLink: Link, parent: Section) {
    const result = this.sections.append(newLink, parent);
    this.saveSections();
    return result;
  }

  public findLinkById(id: string) {
    return this.sections.findLinkInfoById(id);
  }

  public insertAfter(newLink: Link, parent: Section, child: Link) {
    this.sections.insertAfter(newLink, parent, child);
    this.saveSections();
  }

  public insertBefore(newLink: Link, parent: Section, child: Link) {
    this.sections.insertBefore(newLink, parent, child);
    this.saveSections();
  }

  public insertSectionAfter(newSection: Section, parent: Section) {
    this.sections.insertSectionAfter(newSection, parent);
    this.saveSections();
  }

  public insertSectionBefore(newSection: Section, parent: Section) {
    this.sections.insertSectionBefore(newSection, parent);
    this.saveSections();
  }

  public removeLink(parent: Section, child: Link, save = true) {
    this.sections.removeLink(parent, child);

    if (save) {
      this.saveSections();
    }
  }

  public removeSection(section: Section, save = true) {
    this.sections.removeSection(section);

    if (save) {
      this.saveSections();
    }
  }

  public updateLink(parent: Section, child: Link) {
    this.sections.updateLink(parent, child);
    this.saveSections();
  }

  public updateSection(section: Section) {
    this.sections.updateSection(section);
    this.saveSections();
  }

  public upsertSection(section: Section) {
    const response = this.commitSection(section);

    this.saveSections();
    return response;
  }

  public export() {
    this.sections.sanitizeSections();
    const sections = this.sections.removeMembers(["id", "tags"]);
    return sections;
  }

  public diagnostic(type?: string) {
    switch (type || "") {
      case "load": {
        const sections = LocalData.get<any[]>(BookmarksKey, <any>null);
        console.log(JSON.stringify(sections, null, 3));
        break;
      }

      case "recent": {
        console.log(JSON.stringify(this.recentBookmarks, null, 3));
        break;
      }

      default: {
        console.log(JSON.stringify(this.sections, null, 3));
        break;
      }
    }
  }

  private load() {
    let sections = LocalData.get<Section[]>(BookmarksKey, <any>null);
    if (sections === null) {
      sections = DefaultBookmarks;
    }

    this.loadBookmarks(sections);
  }

  public importFromJson(json: string): [boolean, string] {
    try {
      const sections = JSON.parse(json);
      if (!sections.length) {
        return [false, "No bookmarks found"];
      }

      this.loadBookmarks(sections);
      this.saveSections();

      return [true, "Loaded bookmarks"];
    } catch (err) {
      return [false, "Failed to parse bookmarks " + err];
    }
  }

  public resetRecentLinks() {
    this.sections.forEach((section) => {
      section.children.forEach((link) => {
        link.timestamp = MinTimeStamp;
        link.clickCount = 0;
      });
    });

    this.saveSections();
  }

  public resetLinks() {
    this.sections.forEach((section) => {
      section.backgroundColor = "";
      section.color = "";

      section.children.forEach((link) => {
        link.backgroundColor = "";
        link.color = "";
      });
    });

    this.saveSections();
  }

  private loadBookmarks(sections: Section[]) {
    sections.ensureSectionMembers();

    this.replaceDuplicateLinks(sections);

    this.state.value.sections.splice(
      0,
      this.state.value.sections.length,
      ...sections
    );
  }

  private commitSection(section: Section) {
    if (!section.id) {
      section.id = uuidv4();
    }

    const found = this.state.value.sections.find(
      (item) => item.name == section.name
    );

    if (found) {
      const idx = this.state.value.sections.indexOf(found);
      this.state.value.sections.splice(idx, 1, section);
      return found;
    } else {
      this.state.value.sections.push(section);
      return section;
    }
  }

  private replaceDuplicateLinks(sections: Section[]) {
    const linkInfos = sections.getLinkInfos();
    while (linkInfos.length > 0) {
      const info = linkInfos[0];
      linkInfos.splice(0, 1);

      const link = info.link;
      sections.replaceDuplicatesForLinkWithLinkInfos(link, linkInfos);
    }
  }

  private saveSections() {
    let sections = this.sections.map((item) => {
      const section: Section = { ...item };
      section.children = section.children.map((child) => {
        return { ...child } as Link;
      });
      return section;
    });

    sections.sanitizeSections();
    sections = sections.removeMembers(["id", "tags"]);

    LocalData.save(BookmarksKey, JSON.stringify(sections));
    this.state.value.refreshCount++;
  }
}

export const $bookmarksStore = new BookmarksStore();
Debug.setDebugModule("bookmarksStore", $bookmarksStore);
