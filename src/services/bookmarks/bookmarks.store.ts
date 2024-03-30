/* eslint-disable @typescript-eslint/no-explicit-any */
import { v4 as uuidv4 } from "uuid";
import { ref } from "vue";

import { Link, Section } from ".";
import { LocalData } from "../../support/local-storage";
import { DefaultBookmarks } from "./default-bookmarks";
import {
  SectionsHolder,
  cleanDataSections,
  normalizeData,
  replaceDuplicatesForLink,
} from "./sections-holder";

interface BookmarksState {
  refreshCount: number;
  sections: Section[];
}

const BookmarksKey = "bookmarks";

class BookmarksStore {
  private sectionsHolder: SectionsHolder;

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
    return this.sectionsHolder.links;
  }

  get linkInfos() {
    return this.sectionsHolder.getLinkInfos(this.sections);
  }

  get recentBookmarks() {
    return this.sectionsHolder.recentBookmarks;
  }

  constructor() {
    this.sectionsHolder = new SectionsHolder(this.state.value.sections);
    this.load();
  }

  public addToSection(newLink: Link, parent: Section) {
    const result = this.sectionsHolder.addToSection(newLink, parent);
    this.saveSections();
    return result;
  }

  public append(newLink: Link, parent: Section) {
    const result = this.sectionsHolder.append(newLink, parent);
    this.saveSections();
    return result;
  }

  public findLinkById(id: string) {
    return this.sectionsHolder.findLinkById(id);
  }

  public insertAfter(newLink: Link, parent: Section, child: Link) {
    this.sectionsHolder.insertAfter(newLink, parent, child);
    this.saveSections();
  }

  public insertBefore(newLink: Link, parent: Section, child: Link) {
    this.sectionsHolder.insertBefore(newLink, parent, child);
    this.saveSections();
  }

  public insertSectionAfter(newSection: Section, parent: Section) {
    this.sectionsHolder.insertSectionAfter(newSection, parent);
    this.saveSections();
  }

  public insertSectionBefore(newSection: Section, parent: Section) {
    this.sectionsHolder.insertSectionBefore(newSection, parent);
    this.saveSections();
  }

  public removeLink(parent: Section, child: Link, save = true) {
    this.sectionsHolder.removeLink(parent, child);

    if (save) {
      this.saveSections();
    }
  }

  public removeSection(section: Section, save = true) {
    this.sectionsHolder.removeSection(section);

    if (save) {
      this.saveSections();
    }
  }

  public updateLink(parent: Section, child: Link) {
    this.sectionsHolder.updateLink(parent, child);
    this.saveSections();
  }

  public updateSection(section: Section) {
    this.sectionsHolder.updateSection(section);
    this.saveSections();
  }

  public upsertSection(section: Section) {
    const response = this.commitSection(section);

    this.saveSections();
    return response;
  }

  public export() {
    normalizeData(this.sections);
    const sections = cleanDataSections(
      cleanDataSections(this.sections, ["id", "timestamp"])
    );
    return sections;
  }

  public diagnostic() {
    console.log(JSON.stringify(this.sections, null, 3));
  }

  public loadDiagnostic() {
    const sections = LocalData.get<Section[]>(BookmarksKey, <any>null);
    console.log(JSON.stringify(sections, null, 3));
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
      console.log(json);
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

  private loadBookmarks(sections: Section[]) {
    normalizeData(sections);

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
    const linkInfos = this.sectionsHolder.getLinkInfos(sections);
    while (linkInfos.length > 0) {
      const info = linkInfos[0];
      linkInfos.splice(0, 1);

      const link = info.link;
      replaceDuplicatesForLink(link, linkInfos);
    }
  }

  private saveSections() {
    normalizeData(this.sections);
    const sections = cleanDataSections(
      cleanDataSections(this.sections, ["tags"])
    );

    LocalData.save(BookmarksKey, JSON.stringify(sections));
    this.state.value.refreshCount++;
  }
}

export const $bookmarksStore = new BookmarksStore();
Debug.setDebugModule("bookmarksStore", $bookmarksStore);
