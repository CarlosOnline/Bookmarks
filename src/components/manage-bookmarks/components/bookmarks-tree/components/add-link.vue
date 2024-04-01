<script setup lang="ts">
import { computed, nextTick, onBeforeMount, onMounted, ref, watch } from 'vue';
import { Link, Section, ensureLinkMembers } from '@/services/bookmarks';
import { ColorInfo } from '@/services/colors';
import ColorPicker from "../../color-picker.vue";

const props = defineProps<{
    section: Section,
    link: Link,
    editMode?: boolean
}>();

const emit = defineEmits<{
    close: [],
    changed: [section: Section, link: Link],
}>();

const previousLink = ref<Link>();

const showNameError = ref(false);

const showUrlError = ref(false);

const nameInput = ref(<any>null);

const name = ref<string>(props.link.name || "")
const href = ref<string>(props.link.href || "")
const color = ref<ColorInfo>({
    backgroundColor: props.link.backgroundColor,
    color: props.link.color,
});
const model = ref<Link>(props.link);

const title = ref<string>(props.editMode ? "Edit Bookmark" : "Add Bookmark");

const disabled = computed(() => {
    return !name.value || !href.value;
});

onBeforeMount(() => {
    model.value = Object.assign({}, props.link);
});

onMounted(() => {
    Debug.setDebugModule("add-link-modal", this);

    nameInput.value?.focus();
});

watch(name, () => {
    showNameError.value = !name.value;
});

watch(href, () => {
    showUrlError.value = !href.value;
});

watch(props.link, () => {
    if (previousLink.value !== props.link) {
        // New link has been set.
        previousLink.value = props.link;
        return;
    }

    name.value = "";
    href.value = "";
    nextTick(() => {
        showNameError.value = false;
        showUrlError.value = false;
    });
});

const onColorChanged = (newColor: ColorInfo) => {
    console.warn("onColorChanged", newColor);
    color.value = newColor;
}

const save = () => {
    const link: Link = Object.assign({}, props.link);
    link.name = name.value;
    link.href = href.value;
    link.backgroundColor = color.value.backgroundColor;
    link.color = color.value.color;

    ensureLinkMembers(link);

    emit("changed", props.section, link);
    emit("close");
}
</script>

<template>
    <div class="add-link-modal">
        <h1>{{ title }}</h1>
        <form class="input-form" action="javascript:void(0);">
            <label for="name">Name</label>
            <input name="name" v-model="name" placeholder="Bookmark name" class="form-control" autocomplete="on"
                type="text" ref="nameInput" />

            <span title="Invalid Name">
                <font-awesome-icon v-show="showNameError" icon="exclamation-triangle" />
            </span>

            <label for="name">Url</label>
            <input name="url" v-model="href" placeholder="Url" class="form-control" autocomplete="on" type="text" />

            <span title="Invalid Url">
                <font-awesome-icon v-show="showUrlError" icon="exclamation-triangle" />
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

<style scoped>
.add-link-modal {
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