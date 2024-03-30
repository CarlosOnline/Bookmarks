<script setup lang="ts">
import { computed } from 'vue'
import { $bookmarksStore, Link, Section } from '@/services/bookmarks';
import { getBookmarkBackgroundColor, getBookmarkColor } from '@/services/colors';

const props = defineProps<{
    section?: Section,
    link: Link,
}>()

const backgroundColor = computed(() => getBookmarkBackgroundColor(props.section, props.link));

const color = computed(() => getBookmarkColor(props.section, props.link));

const onClick = () => {
    const linkInfo = $bookmarksStore.findLinkById(props.link.id);

    linkInfo.link.timestamp = new Date();

    if (!linkInfo.link.clickCount) {
        linkInfo.link.clickCount = 0;
    }

    linkInfo.link.clickCount++;
    $bookmarksStore.updateLink(linkInfo.section, linkInfo.link);
};

</script>

<template>
    <div class="link-viewer">
        <a target="_self" :id="link.id" :key="link.id" :href="link.href" :title="link.href" class="btn link-url"
            role="button" @click="onClick" :style="{
            backgroundColor: backgroundColor,
            color: color + ' !important',
        }">{{ link.name }}
        </a>
    </div>
</template>

<style scoped>
.link-viewer {
    display: flex;
    flex-direction: row;

    .link-url {
        min-width: 10rem;
        /* max-width: 18rem; Used if have description */
        margin-bottom: 0;
        padding-left: 1rem;
        padding-right: 1rem;
        margin-left: 0;
    }
}

.link-viewer .edit-link-btn {
    visibility: hidden;
    padding-left: 0.25rem;
    display: flex;
    flex-direction: column;
    width: 2rem;

    .btn {
        width: 1rem;
        height: 1rem;
        margin: 0;
        padding: 0;
    }
}

.link-viewer:hover .edit-link-btn {
    visibility: visible;
}
</style>
