<script setup lang="ts">
import { onMounted, ref, watch } from 'vue';
import { Bookmark } from '@/services/bookmarks';
import { BookmarkColors, ColorInfo, DefaultColor, DefaultColorName } from '@/services/colors';

const props = defineProps<{
    section: Bookmark,
    link: Bookmark,
}>();

const emit = defineEmits<{
    changed: [color: ColorInfo]
}>();

const colors = Object.keys(BookmarkColors).map((key) => {
    return {
        name: key,
        backgroundColor: BookmarkColors[key].backgroundColor,
        color: BookmarkColors[key].color,
    };
});

const defaultColor = <ColorInfo>colors.find(
    (item) => item.name == DefaultColorName
);

const findColor = (color: string, backgroundColor: string) => {
    color = color || DefaultColor.color;
    backgroundColor = backgroundColor || DefaultColor.backgroundColor;

    if (!color || !backgroundColor) {
        return null;
    }

    return colors.find(
        (item) =>
            color &&
            backgroundColor &&
            item.color == color &&
            item.backgroundColor == backgroundColor
    );
}

const colorValue = ref<ColorInfo>(defaultColor);

watch(props.link, () => {
    if (props.link.color || props.link.backgroundColor) {
        const found = findColor(props.link.color, props.link.backgroundColor);
        if (found) {
            colorValue.value = found;
            return;
        }
    }

    if (props.section) {
        const found = findColor(
            props.section.color,
            props.section.backgroundColor
        );
        if (found) {
            colorValue.value = found;
            return;
        }
    }

    colorValue.value = defaultColor;
}, { immediate: true, deep: true });

watch(colorValue, () => {
    onColorChanged();
});

const onColorChanged = () => {
    if (props.link) {
        props.link.color = colorValue.value.color;
        props.link.backgroundColor = colorValue.value.backgroundColor;
    }

    emit("changed", colorValue.value);
}

onMounted(() => {
    Debug.setDebugModule("color-picker", this);
})

</script>

<template>
    <div class="color-picker" :style="{
        backgroundColor: colorValue.backgroundColor,
        color: colorValue.color + ' !important',
    }">
        <div>
            <v-select name="colorPicker" :options="colors" :clearable="false" :taggable="false" :pushTags="false"
                @input="onColorChanged" placeholder="Select color" :showDropDown="true" v-model="colorValue"
                class="colors-select" label="name">
                <template v-slot:selected-option="color">
                    <span class="selected-color" :style="{
        backgroundColor: color.backgroundColor,
        color: color.color + ' !important',
    }">
                        {{ color.name }}
                    </span>
                </template>

                <template v-slot:option="color">
                    <span class="btn link-url color-option" :style="{
        backgroundColor: color.backgroundColor,
        color: color.color + ' !important',
    }">
                        {{ color.name }}
                    </span>
                </template>
            </v-select>
        </div>
    </div>
</template>

<style>
.color-picker {
    display: flex;
    flex-direction: row;
    width: 10rem;
    margin: 0;
    padding: 0;

    .vs__dropdown-menu,
    .vs__dropdown-toggle {
        width: 10rem !important;
        max-height: 15rem !important;
    }

    .vs__search {
        width: 10rem;
        height: 1px;
        margin: 0;
        padding: 0;
    }

    li {
        margin: 0;
        padding: 0;
    }

    .btn {
        border-radius: 0 !important;
    }

    .color-option {
        width: 100%;
    }
}

.color-option:focus {
    border: 2px solid gainsboro;
}

span:focus,
li:focus {
    border: 2px solid red;
}
</style>