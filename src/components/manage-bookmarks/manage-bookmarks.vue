<script setup lang="ts">
import { $bookmarksStore } from '@/services/bookmarks';
import BookmarksTree from './components/bookmarks-tree/bookmarks-tree.vue';

const resetRecentLinks = () => {
    $bookmarksStore.resetRecentLinks();
};

const resetLinks = () => {
    $bookmarksStore.resetLinks();
};

</script>
<template>
    <div class="manage-bookmarks">
        <div class="editor-column">
            <BookmarksTree />
        </div>


        <div class="footer">
            <span />
            <button class="btn btn-default" type="submit" @click="resetRecentLinks">Reset Recent Links</button>
            <button class="btn btn-default" type="submit" @click="resetLinks">Reset Colors</button>
            <router-link to="/">
                <button class="btn btn-primary" type="submit">Done</button>
            </router-link>
            <span />
        </div>
    </div>
</template>
<style scoped>
.manage-bookmarks {
    margin-top: 1rem;
    display: flex;
    flex-direction: column;
    gap: 2rem;

    .footer {
        display: grid;
        grid-template-columns: 20rem auto auto auto 1fr;
        grid-column-gap: 1rem;
    }
}
</style>
