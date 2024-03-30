<script setup lang="ts">
import { computed, nextTick, onBeforeMount, onMounted, ref, watch } from 'vue';
import { Section } from '@/services//bookmarks';
import { ColorInfo, DefaultColor } from '@/services/colors';
import ColorPicker from "../../color-picker.vue";

const props = defineProps<{
    section: Section,
    editMode?: boolean
}>();

const emit = defineEmits<{
    close: [],
    changed: [section: Section],
}>();

const previousSection = ref<Section>();

const showNameError = ref(false);

const name = ref<string>(props.section.name || "")
const color = ref<ColorInfo>(DefaultColor);
const model = ref<Section>(props.section);

const title = ref<string>(props.editMode ? "Edit Section" : "Add Section");

const disabled = computed(() => {
    return !name.value;
});

onBeforeMount(() => {
    model.value = Object.assign({}, props.section);
});

onMounted(() => {
    Debug.setDebugModule("add-section-modal", this);
});

watch(name, () => {
    showNameError.value = !name.value;
});

watch(props.section, () => {
    if (previousSection.value !== props.section) {
        // New section has been set.
        previousSection.value = props.section;
        return;
    }

    name.value = "";
    nextTick(() => {
        showNameError.value = false;
    });
});

const onColorChanged = (newColor: ColorInfo) => {
    console.warn("onColorChanged", newColor);
    color.value = newColor;
}

const save = () => {
    const section: Section = Object.assign({}, props.section);
    section.name = name.value;
    section.backgroundColor = color.value.backgroundColor;
    section.color = color.value.color;

    emit("changed", section);
    emit("close");
}
</script>

<template>
    <div class="add-section-modal">
        <h1>{{ title }}</h1>
        <form class="input-form" action="javascript:void(0);">
            <label for="name">Name</label>
            <input name="name" v-model="name" placeholder="Section name" class="form-control" autocomplete="on"
                type="text" />

            <span title="Invalid Name">
                <font-awesome-icon v-show="showNameError" icon="exclamation-triangle" />
            </span>

            <label for="name">Color</label>
            <ColorPicker :section="section" :link="model" @changed="onColorChanged" />
            <span></span>
        </form>

        <div class="footer">
            <span />
            <button class="btn btn-default" type="submit" @click="emit('close')">
                Cancel
            </button>

            <button class="btn btn-primary" type="submit" :disabled="disabled" @click="save">
                Save
            </button>
        </div>
    </div>
</template>

<style>
.add-section-modal {
    margin: 2rem;

    form {
        margin-top: 2rem;
        margin-right: 2rem;
        padding-right: 2rem;
        width: 100%;

        display: grid;
        grid-auto-rows: auto;
        grid-template-columns: 5rem auto auto;
        grid-column-gap: 1rem;
        grid-row-gap: 1rem;
        align-items: center;

        label {
            color: var(--darkGray);
            font-weight: normal;
            justify-self: left;
        }

        input {
            max-width: 30rem;
        }

        .fa-exclamation-triangle {
            color: red;
        }

        button {
            width: 10rem;
            justify-self: right;
        }
    }

    .footer {
        margin-top: 2rem;
        margin-right: 1rem;
        width: 100%;
        display: grid;
        grid-template-columns: 1fr auto auto;
        grid-column-gap: 1rem;
        grid-row-gap: 1rem;
        align-items: center;
    }
}
</style>