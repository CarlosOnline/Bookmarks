/* eslint-disable @typescript-eslint/no-explicit-any */

import { Link, Section, Bookmark, DefaultLink, MinTimeStamp } from "../..";

if (!Array.prototype.findSection) {
  Array.prototype.findSection = function (this: Section[], section: Bookmark) {
    const found = this.find((item) => {
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
  };
}

if (!Array.prototype.findSectionByName) {
  Array.prototype.findSectionByName = function (this: Section[], name: string) {
    return this.find((item) => item.name == name);
  };
}

if (!Array.prototype.addToSection) {
  Array.prototype.addToSection = function (
    this: Section[],
    newLink: Link,
    parent: Section
  ) {
    Debug.log("addToSection", newLink.name, parent.name);

    const section = this.findSection(parent);
    section.children.splice(0, 0, newLink);

    this.updateAllLinkInstances(newLink);

    return this.findLink(section, newLink);
  };
}

if (!Array.prototype.append) {
  Array.prototype.append = function (
    this: Section[],
    newLink: Link,
    parent: Section
  ) {
    Debug.log("append", newLink.name, parent.name);

    parent = this.findSection(parent);
    parent.children.push(newLink);

    this.updateAllLinkInstances(newLink);

    return this.findLink(parent, newLink);
  };
}

if (!Array.prototype.findLink) {
  Array.prototype.findLink = function (
    this: Section[],
    section: Section,
    link: Bookmark
  ) {
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
  };
}

if (!Array.prototype.insertAfter) {
  Array.prototype.insertAfter = function (
    this: Section[],
    newLink: Link,
    parent: Section,
    child: Link
  ) {
    Debug.log("insertAfter", newLink.name, parent.name, child.name);

    parent = this.findSection(parent);
    child = this.findLink(parent, child);

    const idx = parent.children.indexOf(child);
    if (idx == parent.children.length) {
      parent.children.push(newLink);
    } else {
      parent.children.splice(idx + 1, 0, newLink);
    }
  };
}

if (!Array.prototype.insertBefore) {
  Array.prototype.insertBefore = function (
    this: Section[],
    newLink: Link,
    parent: Section,
    child: Link
  ) {
    Debug.log("insertBefore", newLink.name, parent.name, child.name);

    parent = this.findSection(parent);
    child = this.findLink(parent, child);

    const idx = Math.max(0, parent.children.indexOf(child));
    parent.children.splice(idx, 0, newLink);
  };
}

if (!Array.prototype.insertSectionAfter) {
  Array.prototype.insertSectionAfter = function (
    this: Section[],
    newSection: Section,
    parent: Section
  ) {
    Debug.log("insertSectionAfter", newSection.name, parent.name);

    parent = this.findSection(parent);
    const idx = this.indexOf(parent);
    if (idx == this.length - 1) {
      this.push(newSection);
    } else {
      this.splice(idx, 0, newSection);
    }
  };
}

if (!Array.prototype.insertSectionBefore) {
  Array.prototype.insertSectionBefore = function (
    this: Section[],
    newSection: Section,
    parent: Section
  ) {
    Debug.log("insertSectionBefore", newSection.name, parent.name);

    parent = this.findSection(parent);

    const idx = Math.max(0, this.indexOf(parent));
    this.splice(idx, 0, newSection);
  };
}

if (!Array.prototype.removeLink) {
  Array.prototype.removeLink = function (
    this: Section[],
    parent: Section,
    child: Link
  ) {
    Debug.log("removeLink", child.name, child.id);

    parent = this.findSection(parent);
    child = this.findLink(parent, child);

    const idx = parent.children.indexOf(child);
    parent.children.splice(idx, 1);

    if (parent.children.length == 0) {
      const placeholder = { ...DefaultLink, name: "New Bookmark" };
      parent.children.push(placeholder);
    }
  };
}

if (!Array.prototype.removeSection) {
  Array.prototype.removeSection = function (this: Section[], section: Section) {
    Debug.log("removeSection", section.name, section.id);

    section = this.findSection(section);

    const idx = this.indexOf(section);
    this.splice(idx, 1);
  };
}

if (!Array.prototype.updateLink) {
  Array.prototype.updateLink = function (
    this: Section[],
    parent: Section,
    child: Link
  ) {
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

    if (!link.timestamp) {
      link.timestamp = MinTimeStamp;
      console.error("reset timestamp for", link, child);
    }

    this.updateAllLinkInstances(link);
  };
}

if (!Array.prototype.updateSection) {
  Array.prototype.updateSection = function (this: Section[], section: Section) {
    Debug.log("updateSection", section.name, section.id);

    const found = this.findSection(section);

    found.backgroundColor = section.backgroundColor?.trim();
    found.color = section.color?.trim();
    found.name = section.name?.trim();
    found.timestamp = section.timestamp;
  };
}
