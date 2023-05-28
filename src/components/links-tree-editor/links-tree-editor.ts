/* eslint-disable @typescript-eslint/no-explicit-any */
// eslint-disable-next-line @typescript-eslint/no-explicit-any

/*
Using vue-tree-list from https://github.com/ParadeTo/vue-tree-list
*/
import { v4 as uuidv4 } from "uuid";
import { Component, Vue } from "vue-property-decorator";

import { Tree } from "vue-tree-list";

import TreeNodeComponent from "./tree-node/tree-node.vue";

import {
  $bookmarksStore,
  Bookmark,
  DefaultLink,
  Link,
  Section,
} from "@/services/bookmarks";

enum DropType {
  before = "Before",
  after = "After",
  on = "On",
}

interface TreeNode extends Bookmark {
  isLeaf: boolean;
  parent: TreeNode;

  remove: () => void;
}

interface DropInfo {
  node: TreeNode;
  src: TreeNode;
  target: TreeNode;
}

interface LinkInfo {
  section: Section;
  link: Link;
}

function getNodeName(node: TreeNode) {
  if (node.isLeaf) {
    return `[🍃 ${node.name}]`;
  }

  return `[ 📂 ${node.name} ]`;
}

@Component({
  name: "links-tree-editor",
  components: {
    "link-node": TreeNodeComponent,
  },
})
export default class LinksTreeEditorComponent extends Vue {
  section: TreeNode = null;
  link: TreeNode = null;

  get sections() {
    return $bookmarksStore.sections;
  }

  get treeData() {
    const sections = this.sections.map((section) =>
      this.prepareTreekSection(section)
    );
    return new Tree(sections);
  }

  created() {
    Debug.setDebugModule("links-tree-editor", this);
  }

  addSection() {
    const link: Link = Object.assign<Link>({}, DefaultLink);
    link.id = uuidv4();
    link.name = "First bookmark";

    const section: Section = {
      children: [link],
      name: "New Section",
      tags: [],
      backgroundColor: "",
      color: "",
      timestamp: undefined,
      id: uuidv4(),
    };
    $bookmarksStore.insertSectionBefore(section, this.sections[0]);
  }

  resetChanges() {
    this.sections.forEach((section) => {
      section.backgroundColor = "";
      section.color = "";
      section.children.forEach((link) => {
        link.backgroundColor = "";
        link.color = "";
        link.clickCount = 0;
      });

      $bookmarksStore.upsertSection(section);
    });
  }

  onChangeName(change: any) {
    if (!change.node) {
      // Completed.
      return;
    }

    const node = change.node;
    Debug.log("onChangeName", getNodeName(node), node.isLeaf, node);

    if (node.isLeaf) {
      $bookmarksStore.updateLink(node.parent, node);
    } else {
      $bookmarksStore.updateSection(node);
    }
  }

  onClick(node: TreeNode) {
    Debug.log("onClick", getNodeName(node), node.id, node.isLeaf);

    const [sectionObj, linkObj] = this.getSectionLinkNodes(node);
    this.section = sectionObj;
    this.link = linkObj;

    const section = $bookmarksStore.findSection(sectionObj);
    const link = linkObj ? $bookmarksStore.findLink(section, linkObj) : null;

    this.$emit("selected", section, link);
  }

  onAddNode(node: TreeNode) {
    Debug.log("onAddNode", getNodeName(node), getNodeName(node.parent));
    node.remove();

    const [sectionObj] = this.getSectionLinkNodes(node);
    const section = $bookmarksStore.findSection(sectionObj);

    let link: Link = Object.assign<Link>({}, DefaultLink);
    link.id = uuidv4();
    link.backgroundColor = section.backgroundColor;
    link.color = section.color;

    link = Vue.observable<Link>(link);

    this.$emit("add-link", section, link);
  }

  onDeleteNode(node: TreeNode) {
    Debug.log(
      "onDeleteNode",
      getNodeName(node),
      getNodeName(node),
      node.isLeaf
    );

    const [section, link] = this.getSectionLink(node);

    if (this.section?.id == section.id && this.link?.id == link?.id) {
      this.section = null;
      this.link = null;
      this.$emit("selected", null, null);
    }

    if (node.isLeaf) {
      $bookmarksStore.removeLink(section, link);
    } else {
      $bookmarksStore.removeSection(section);
    }
  }

  onDropNode(dropInfo: DropInfo) {
    this.handleDrop(DropType.on, dropInfo);
  }

  onDropBefore(dropInfo: DropInfo) {
    this.handleDrop(DropType.before, dropInfo);
  }

  onDropAfter(dropInfo: DropInfo) {
    this.handleDrop(DropType.after, dropInfo);
  }

  private handleDrop(dropType: DropType, dropInfo: DropInfo) {
    const node = dropInfo.node;
    const source = dropInfo.src;
    const target = dropInfo.target;

    Debug.log(
      dropType,
      getNodeName(node),
      getNodeName(source),
      getNodeName(target)
    );

    // When dragged to different section, the parent is already updated.
    node.parent = source;

    const [section, link] = this.getSectionLink(node);
    const destination = this.getSectionLinkInfo(target);

    if (node.isLeaf) {
      if (!section || !link) {
        Debug.error("Missing section/link for", getNodeName(node), node.id);
        return;
      }

      $bookmarksStore.removeLink(section, link, false);
      this.handleLinkDropped(dropType, link, destination, target);
    } else {
      if (!section) {
        Debug.error("Missing section for", getNodeName(node), node.id);
        return;
      }

      $bookmarksStore.removeSection(section, false);
      this.handleSectionDropped(dropType, section, destination.section);
    }
  }

  private handleLinkDropped(
    dropType: DropType,
    link: Link,
    destination: LinkInfo,
    target: TreeNode
  ) {
    switch (dropType) {
      case DropType.before:
        $bookmarksStore.insertBefore(
          link,
          destination.section,
          destination.link
        );
        return;

      case DropType.after:
        $bookmarksStore.insertBefore(
          link,
          destination.section,
          destination.link
        );
        return;

      case DropType.on:
        if (target.isLeaf) {
          $bookmarksStore.insertBefore(
            link,
            destination.section,
            destination.link
          );
        } else {
          $bookmarksStore.addToSection(link, destination.section);
        }
        return;

      default:
        Debug.error("Unhandled", dropType, link);
        return;
    }
  }

  private handleSectionDropped(
    dropType: DropType,
    section: Section,
    target: Section
  ) {
    switch (dropType) {
      case DropType.after:
        $bookmarksStore.insertSectionAfter(section, target);
        return;

      case DropType.before:
        $bookmarksStore.insertSectionBefore(section, target);
        return;

      case DropType.on:
        $bookmarksStore.insertSectionBefore(section, target);
        return;

      default:
        Debug.error("Unhandled", dropType, section);
        return;
    }
  }

  private getSectionLinkNodes(node: TreeNode): [TreeNode, TreeNode] {
    if (node.isLeaf) {
      return [node.parent, node];
    } else {
      return [node, null];
    }
  }

  private getSectionLink(node: TreeNode): [Section, Link] {
    const [sectionObj, linkObj] = this.getSectionLinkNodes(node);

    const section = $bookmarksStore.findSection(sectionObj);
    const link = linkObj ? $bookmarksStore.findLink(section, linkObj) : null;

    return [section, link];
  }

  private getSectionLinkInfo(node: TreeNode) {
    const [section, link] = this.getSectionLink(node);

    return {
      section: section,
      link: link,
    };
  }

  private prepareTreeLink(link: Link) {
    link = Object.assign({}, link);

    if (!link.id) {
      link.id = uuidv4();
    }

    const linkObj = <any>link;
    linkObj.isLeaf = true;
    linkObj.editNodeDisabled = true;
    linkObj.addTreeNodeDisabled = true;
    linkObj.addLeafNodeDisabled = true;
    return linkObj;
  }

  private prepareTreekSection(section: Section) {
    section = Object.assign({}, section);

    if (!section.id) {
      section.id = uuidv4();
    }

    const sectionObj = <any>section;
    sectionObj.addTreeNodeDisabled = true;

    section.children = section.children.map((link) => {
      return this.prepareTreeLink(link);
    });

    return section;
  }
}
