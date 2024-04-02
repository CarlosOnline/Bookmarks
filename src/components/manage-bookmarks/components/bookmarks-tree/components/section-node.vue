<script setup lang="ts">
import { computed, ref } from 'vue'
import { DefaultLink, Link, Section } from '@/services/bookmarks';
import Modal from '@/components/modal.vue';
import AddLink from './add-link.vue'
import AddSection from './add-section.vue'
import { getBookmarkBackgroundColor, getBookmarkColor } from '@/services/colors';

const props = defineProps<{
    section: Section,
}>()

const emit = defineEmits<{
    addedLink: [section: Section, link: Link],
    changed: [section: Section],
    delete: [section: Section],
}>();

const link = ref<Link>({ ...DefaultLink });

const addModal = ref<typeof Modal>(<any>null);
const editModal = ref<typeof Modal>(<any>null);

const backgroundColor = computed(() => getBookmarkColor(props.section, null));

const color = computed(() => getBookmarkBackgroundColor(props.section, null));

</script>

<template>
    <Modal title="Add Bookmark" ref="addModal">
        <template v-slot="{ onClose }">
            <AddLink :section="props.section" :link="link" :edit-mode="false" @close="onClose"
                @changed="(section, link) => emit('addedLink', section, link)" />
        </template>
    </Modal>

    <Modal title="Edit Section" ref="editModal">
        <template v-slot="{ onClose }">
            <AddSection :section="props.section" :edit-mode="true" @close="onClose"
                @changed="(section) => emit('changed', section)" />
        </template>
    </Modal>

    <div class="section-form">
        <div class="section-btn btn btn-outline-info" :style="{
            backgroundColor: color,
            borderColor: color,
        }">
            <div class="section-viewer">
                <h3 :style="{
            color: backgroundColor + ' !important',
        }" @click="editModal?.show">{{ section.name }}</h3>
            </div>

        </div>

        <div class="edit-section-btn">
            <button class="btn btn-link" @click="addModal.show" title="Add bookmark">
                <font-awesome-icon icon="plus" size="2x" />
            </button>

            <button class="btn btn-link" @click="editModal.show" title="Edit section">
                <font-awesome-icon icon="edit" size="2x" />
            </button>

            <button class="btn btn-link" @click="emit('delete', section)" title="Delete section">
                <font-awesome-icon icon="trash" size="2x" />
            </button>
        </div>
    </div>
</template>

<style scoped>
.section-form {
    display: flex;
    flex-direction: row;

    .section-btn {
        margin-top: 1rem;
        margin-bottom: 0.5rem;
        padding-left: 2rem !important;
        padding-right: 2rem !important;

        .section-viewer {
            h3 {
                font-size: var(--section-font-size) !important;
            }
        }
    }
}

.section-form .edit-section-btn {
    visibility: hidden;
    padding-left: 1rem;
    display: grid;
    grid-template-columns: auto auto auto;
    grid-column-gap: 2rem;

    .btn {
        width: 1rem;
        height: 1rem;
        margin: 0;
        padding: 0;
        color: gray;
    }
}

.section-form:hover .edit-section-btn {
    visibility: visible;
}
</style>

<style></style>
