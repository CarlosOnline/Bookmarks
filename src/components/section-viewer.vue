<script setup lang="ts">
import { Section } from '@/services/bookmarks';

defineProps<{
    section: Section,
}>()

const emit = defineEmits<{
    click: [section: Section],
}>();

</script>

<template>
    <div class="section-viewer">
        <h3 @click="emit('click', section)">{{ section.name }}</h3>
    </div>
</template>

<style scoped>
.section-viewer {
    width: 11rem;
    border-radius: 0.5rem;

    h3 {
        min-width: 8rem;
    }
}
</style>
