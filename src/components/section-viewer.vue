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

const backgroundColor = computed(() => getBookmarkColor(props.section, null));

const color = computed(() => getBookmarkBackgroundColor(props.section, null));
</script>

<template>
    <div class="section-viewer">
        <h3 :style="{
            backgroundColor: backgroundColor,
            color: color + ' !important',
        }" @click="emit('click', section)">{{ section.name }}</h3>
    </div>
</template>

<style scoped>
.section-viewer {
    width: 11rem;
    border-radius: 0.5rem;
}
</style>
