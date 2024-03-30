<script setup lang="ts">
import { computed, ref } from 'vue';
import { v4 as uuidv4 } from "uuid";

import { $bookmarksStore, DefaultLink, DefaultSection, Link, Section } from '@/services/bookmarks';
import SectionNode from './components/section-node.vue';
import LinkNode from './components/link-node.vue';
import Modal from '@/components/modal.vue';
import AddSection from './components/add-section.vue'
import Instructions from './components/instructions.vue'

export interface TreeViewItem {
    name: string;
    id?: string | number;
    children?: TreeViewItem[];
    checked?: boolean;
    selected?: boolean;
    expanded?: boolean;
    disabled?: boolean;
    meta?: any;
}

const section = ref<Section>({ ...DefaultSection });
const addModal = ref(<any>null);
const instructionsModal = ref(<any>null);

const sections = computed<TreeViewItem[]>(() => $bookmarksStore.sections.map(section => <TreeViewItem>{
    name: section.name,
    expanded: true,
    meta: {
        data: section,
        type: 'section',
        section: null,
    },
    children: section.children.map(link => <TreeViewItem>{
        name: link.name,
        expanded: true,
        meta: {
            data: link,
            type: 'link',
            section: section,
        }
    }),
}));

const onLinkAdded = (section: Section, link: Link) => {
    $bookmarksStore.insertAfter(link, section, section.children[section.children.length - 1]);
}

const onSectionAdded = (newSection: Section) => {
    const link = { ...DefaultLink, name: "New Bookmark" }
    newSection.children.push(link);
    $bookmarksStore.insertSectionAfter(newSection, $bookmarksStore.sections[$bookmarksStore.sections.length - 1]);
    section.value = { ...DefaultSection };
}

const onSectionChanged = (section: Section) => {
    $bookmarksStore.updateSection(section);
}

const onSectionDeleted = (section: Section) => {
    $bookmarksStore.removeSection(section);
}

const onLinkChanged = (section: Section, link: Link) => {
    $bookmarksStore.updateLink(section, link);
}

const onLinkDeleted = (section: Section, link: Link) => {
    $bookmarksStore.removeLink(section, link);
}

const onDragDrop = (droppedItem: TreeViewItem, dropHost?: TreeViewItem) => {
    if (!dropHost) return false;

    if (droppedItem.meta.type == "link") {
        onLinkDragged(droppedItem, dropHost);
    } else {
        onSectionDragged(droppedItem, dropHost);
    }
}

const onLinkDragged = (droppedItem: TreeViewItem, dropHost: TreeViewItem) => {
    const link = <Link>droppedItem.meta.data;
    const sourceSection = <Section>(droppedItem.meta.section);
    const targetSection = <Section>(dropHost.meta.type == "section" ? dropHost.meta.data : dropHost.meta.section);

    if (dropHost?.meta.type == 'section') {
        $bookmarksStore.removeLink(sourceSection, link, false);
        const lastChild = targetSection.children[targetSection.children.length - 1];
        $bookmarksStore.insertAfter(link, targetSection, lastChild);
    }
    else {
        $bookmarksStore.removeLink(sourceSection, link, false);
        const insertAfterLink = <Link>dropHost.meta.data;
        $bookmarksStore.insertBefore(link, targetSection, insertAfterLink);
    }

    if (sourceSection.children.length == 1) {
        const placeholderLink: Link = Object.assign<Link>({}, DefaultLink);
        placeholderLink.id = uuidv4();
        placeholderLink.backgroundColor = sourceSection.backgroundColor;
        placeholderLink.color = sourceSection.color;
        placeholderLink.name = "New Bookmark";
        $bookmarksStore.append(placeholderLink, sourceSection);
    }
}

const onSectionDragged = (droppedItem: TreeViewItem, dropHost: TreeViewItem) => {
    const section = <Section>droppedItem.meta.data;
    const targetSection = <Section>(dropHost.meta.type == "section" ? dropHost.meta.data : dropHost.meta.section);

    $bookmarksStore.removeSection(section);
    $bookmarksStore.insertSectionBefore(section, targetSection);
}
</script>

<template>
    <Modal title="Add Section" ref="addModal">
        <template v-slot="{ onClose }">
            <AddSection :section="section" :edit-mode="false" @close="onClose" @changed="onSectionAdded" />
        </template>
    </Modal>

    <Modal title="Help" ref="instructionsModal">
        <template v-slot="{ onClose }">
            <Instructions @close="onClose" />
        </template>
    </Modal>

    <Teleport to=".app-container > .header > .search-filter">
        <h1>Manage Bookmarks</h1>
    </Teleport>

    <div class="header">
        <button class="btn btn-link" @click="instructionsModal.show">Instructions</button>

        <button class="btn btn-link" @click="addModal.show" title="Add Section">
            Add Section
        </button>

        <span />
    </div>

    <vue3-tree-vue :items="sections" :isCheckable="false" :hideGuideLines="true" :onDropValidator="onDragDrop">
        <template v-slot:item-name="treeViewItem">
            <div v-if="treeViewItem.meta.type == 'link'">
                <LinkNode :link="treeViewItem.meta.data" :section="treeViewItem.meta.section" @changed="onLinkChanged"
                    @delete="onLinkDeleted" />
            </div>
            <div v-else>
                <SectionNode :section="treeViewItem.meta.data" @changed="onSectionChanged" @delete="onSectionDeleted"
                    @added-link="onLinkAdded" />
            </div>
        </template>

    </vue3-tree-vue>
</template>

<style>
/* vue3-tree-vue style overrides */
.selected-tree-item {
    background-color: transparent !important;
    border-radius: 0.5rem;
}

.tiny_horizontal_margin {
    margin: 0 !important;
    padding-left: 2px;
}
</style>

<style scoped>
.header {
    display: grid;
    grid-template-columns: auto auto 1fr;
    grid-column-gap: 1rem;
    margin-bottom: 0.5rem;

    .btn {
        font-size: 1.5rem;
    }
}
</style>./components/instructions.vue