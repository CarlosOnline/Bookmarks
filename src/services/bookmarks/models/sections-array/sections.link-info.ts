/* eslint-disable @typescript-eslint/no-explicit-any */

import { Link, Section, LinkInfo } from "../..";

if (!Array.prototype.linkInfos) {
  Array.prototype.linkInfos = function (this: Section[]) {
    return this.getLinkInfos();
  };
}

if (!Array.prototype.linkInfos) {
  Array.prototype.linkInfos = function (this: Section[]) {
    return this.getLinkInfos();
  };
}

if (!Array.prototype.findLinkInfoById) {
  Array.prototype.findLinkInfoById = function (this: Section[], id: string) {
    const found: LinkInfo[] = [];

    this.forEach((section) => {
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
  };
}

if (!Array.prototype.getLinkInfos) {
  Array.prototype.getLinkInfos = function (this: Section[]) {
    const results: LinkInfo[] = [];

    this.forEach((section) => {
      section.children.forEach((link) => {
        results.push({
          section: section,
          link: link,
        });
      });
    });

    return results;
  };
}

if (!Array.prototype.updateAllLinkInstances) {
  Array.prototype.updateAllLinkInstances = function (
    this: Section[],
    link: Link
  ) {
    const linkInfos = this.getLinkInfos();
    this.replaceDuplicatesForLinkWithLinkInfos(link, linkInfos);
  };
}

if (!Array.prototype.replaceDuplicatesForLinkWithLinkInfos) {
  Array.prototype.replaceDuplicatesForLinkWithLinkInfos = function (
    this: Section[],
    link: Link,
    linkInfos: LinkInfo[]
  ) {
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
  };
}
