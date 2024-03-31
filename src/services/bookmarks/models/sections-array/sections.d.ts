/* eslint-disable @typescript-eslint/no-explicit-any */

import { Link, Section, Bookmark, LinkInfo } from "../..";

declare global {
  interface Array<T> {
    sanitizeSections(): void;
    sanitizeLinks(): void;

    ensureSectionMembers(): void;
    ensureLinkMembers(): void;

    removeMembers(removable: string[]): Section[];

    findSection(section: Bookmark): Section;
    findSectionByName(name: string): Section;

    links(): Link[];
    linkInfos(): LinkInfo[];
    getLinkInfos(): LinkInfo[];

    recentBookmarks(): Link[];

    addToSection(newLink: Link, parent: Section): void;
    append(newLink: Link, parent: Section): void;
    insertAfter(newLink: Link, parent: Section, child: Link): void;
    insertBefore(newLink: Link, parent: Section, child: Link): void;
    insertSectionAfter(newSection: Section, parent: Section): void;
    insertSectionBefore(newSection: Section, parent: Section): void;
    removeLink(parent: Section, child: Link): void;
    removeSection(section: Section): void;
    updateLink(parent: Section, child: Link): void;
    updateSection(section: Section): void;

    findLink(section: Section, link: Bookmark): Link;
    findLinkInfoById(id: string): LinkInfo;

    updateAllLinkInstances(link: Link): void;
    replaceDuplicatesForLinkWithLinkInfos(
      link: Link,
      linkInfos: LinkInfo[]
    ): void;
  }
}
