<script setup lang="ts">
import BookmarksTree from './components/bookmarks-tree/bookmarks-tree.vue'

const close = () => {
    document.location.href = "/";
};
</script>
<template>
    <div class="bookmarks-editor">
        <div class="editor-column">
            <BookmarksTree />
        </div>


        <div class="footer">
            <button class="btn btn-primary" type="submit" @click="close">Done</button>
        </div>
    </div>
</template>
<style scoped>
.bookmarks-editor {
    margin-top: 1rem;
    display: flex;
    flex-direction: column;
    gap: 2rem;
}
</style>
