<script setup lang="ts">
import { computed, ref } from 'vue'
import { Link, Section } from '@/services/bookmarks';
import { getBookmarkBackgroundColor, getBookmarkColor } from '@/services/colors';
import Modal from '@/components/modal.vue';
import AddLink from './add-link.vue'

const props = defineProps<{
    section: Section,
    link: Link,
}>()

const emit = defineEmits<{
    changed: [section: Section, link: Link],
    delete: [section: Section, link: Link],
}>();

const modal = ref<typeof Modal>(<any>null);

const backgroundColor = computed(() => getBookmarkBackgroundColor(props.section, props.link));

const color = computed(() => getBookmarkColor(props.section, props.link));
</script>

<template>
    <Modal title="Edit Bookmark" ref="modal">
        <template v-slot="{ onClose }">
            <AddLink :section="props.section" :link="props.link" :edit-mode="true" @close="onClose"
                @changed="(section, link) => emit('changed', section, link)" />
        </template>
    </Modal>

    <div class="link-form">
        <a target="_self" :id="link.id" :key="link.id" href="javascript:void(0)" :title="link.href" class="btn link-url"
            role="button" @click="modal.show" :style="{
            backgroundColor: backgroundColor,
            color: color + ' !important',
        }">{{ link.name }}
        </a>

        <div class="edit-link-btn">
            <button class="btn btn-link" @click="modal.show" title="Edit bookmark">
                <font-awesome-icon icon="edit" size="2x" />
            </button>

            <button class="btn btn-link" @click="emit('delete', section, link)" title="Delete bookmark">
                <font-awesome-icon icon="trash" size="2x" />
            </button>
        </div>
    </div>
</template>

<style scoped>
.link-form {
    display: flex;
    flex-direction: row;

    .link-url {
        min-width: 10rem;
        /* max-width: 18rem; Used if have description */
        margin-bottom: 0;
        padding-left: 1rem;
        padding-right: 1rem;
        margin-left: 0;
        font-size: var(--link-font-size) !important;
    }
}

.link-form .edit-link-btn {
    visibility: hidden;
    padding-left: 1rem;
    display: grid;
    grid-template-columns: auto auto;
    grid-column-gap: 2rem;

    .btn {
        width: 1rem;
        height: 1rem;
        margin: 0;
        padding: 0;
        color: gray;
    }
}

.link-form:hover .edit-link-btn {
    visibility: visible;
}
</style>
