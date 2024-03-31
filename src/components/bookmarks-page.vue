<script setup lang="ts">
import { computed, ref } from 'vue'
import Fuse from "fuse.js";

import { $bookmarksStore, Link, Section } from '@/services/bookmarks';
import SectionViewer from './section-viewer.vue';
import LinkViewer from './link-viewer.vue';

const filter = ref<string>("");

const recentLinks = computed<Link[]>(() => {
    return $bookmarksStore.recentBookmarks;
});

const showRecentLinks = computed(() => {
    return recentLinks.value.length > 0;
});

const bookmarks = computed<Section[]>(() => {
    const filterValue = filter.value?.trim();
    if (!filterValue || filterValue.length < 3) {
        return $bookmarksStore.sections;
    }

    return $bookmarksStore.sections
        .filter((section) => {
            const links = filterLinks(section.children, filterValue);
            return links.length > 0;
        })
        .map((originalSection) => {
            const section = Object.assign({}, originalSection) as Section;

            const links = filterLinks(originalSection.children, filterValue).map(
                (link) => {
                    return Object.assign({}, link);
                }
            );
            section.children = links;
            return section;
        });
});

const filterLinks = (links: Link[], search: string) => {
    const fuse = new Fuse(links, {
        keys: ["name"],
        shouldSort: true,
        minMatchCharLength: 1,
        useExtendedSearch: true,
        threshold: 0.3,
    });
    return search.length ? fuse.search(search).map(({ item }) => item) : links;
}

</script>

<template>
    <Teleport to=".app-container > .header > .search-filter">
        <input name="filter" v-model="filter" placeholder="Search bookmarks" class="form-control" autocomplete="on"
            type="text" autofocus />
    </Teleport>

    <div class="bookmarks-page">
        <div v-if="showRecentLinks" class="recent-bookmarks-page">
            <h3>Recent Links</h3>
            <div class="link-wrapper">
                <template v-for="link in recentLinks" :key="'recent-links-link-' + link.id">
                    <div class="link-container">
                        <LinkViewer :link="link" />
                    </div>
                </template>
            </div>
        </div>

        <template v-for="section in bookmarks" :key="'section-fragment' + section.id">
            <SectionViewer :section="section" />
            <div class="link-wrapper">
                <template v-for="link in section.children" :key="'section-' + section.id + '-link-' + link.id">
                    <div class="link-container">
                        <LinkViewer :link="link" :section="section" />
                    </div>
                </template>
            </div>
        </template>
    </div>
</template>

<style scoped>
.bookmarks-page {
    .link-wrapper {
        display: flex;
        flex-wrap: wrap;
        align-content: space-around;
        width: 95%;

        .link-container {
            padding: 1em;
        }
    }
}
</style>
