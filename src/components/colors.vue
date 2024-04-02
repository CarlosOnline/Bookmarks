<script setup lang="ts">
import { computed, ref } from "vue";
import { BookmarkColorInfoArray } from "@/services/colors";

const colors = ref(BookmarkColorInfoArray);

const colorsJson = computed(() => {
    const results: Record<string, any> = {};
    BookmarkColorInfoArray.forEach(item => {
        results[item.name] = { backgroundColor: item.backgroundColor, color: item.color };
    });
    return JSON.stringify(results).replace(/},/g, "},\r\n");
});
</script>

<template>
    <div class="colors-container">
        <h2>Colors</h2>
        <template v-for="color in colors" :key="color.name">
            <div class="color-option" :style="{
            backgroundColor: color.backgroundColor,
            color: color.color + ' !important',
        }">
                <span>{{ color.name }}</span>
                <span>{{ color.backgroundColor }}</span>
                <span>{{ color.rgba.r }}</span>
                <span>{{ color.rgba.g }}</span>
                <span>{{ color.rgba.g }}</span>
                <span>{{ color.rgba.a }}</span>
            </div>
        </template>

        <h2>Colors Json</h2>
        <div class="colors-json">
            <span>
                <pre>{{ colorsJson }}</pre>
            </span>
        </div>
    </div>
</template>

<style scoped>
.colors-container {
    h2 {
        padding-top: 1rem;
    }

    .color-option {
        margin: 0;
        padding: 0.25rem;
        width: 60rem;
        display: grid;
        grid-template-columns: 10rem 5rem 2rem 2rem 2rem 2rem;
    }

    .colors-json {
        background-color: gainsboro;
        padding: 1rem;
    }
}
</style>