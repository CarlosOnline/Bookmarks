<script setup lang="ts">
import { computed } from 'vue'
import { Section } from '@/services/bookmarks';
import { getBookmarkBackgroundColor, getBookmarkColor } from '@/services/colors';

const props = defineProps<{
    section: Section,
}>()

const emit = defineEmits<{
    click: [section: Section],
}>();

function calculateBackgroundColor(section: Section) {
    const color = getBookmarkColor(section, null);
    if (color == "white") {
        return getBookmarkBackgroundColor(section, null);
    }

    return color;
}

const backgroundColor = computed(() => calculateBackgroundColor(props.section));
const color = computed(() => getBookmarkBackgroundColor(props.section, null));
</script>

<template>
    <div class="section-viewer">
        <h3 class="btn btn-outline-info" :style="{
            color: color + ' !important',
            borderColor: backgroundColor + ' !important'
        }" @click="emit('click', section)">{{ section.name }}</h3>
    </div>
</template>

<style scoped>
.section-viewer {
    width: 11rem;
    border-radius: 0.5rem;

    h3 {
        font-size: var(--section-font-size) !important;
        min-width: 8rem;
    }
}
</style>
