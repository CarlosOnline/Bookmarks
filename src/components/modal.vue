<script setup lang="ts">
import { ref } from 'vue';
import { VueFinalModal } from 'vue-final-modal'

defineProps<{
    title?: string,
}>();

const show = ref(false);

const onClose = () => {
    show.value = false;
};

defineExpose({
    show: () => {
        show.value = true;
    }
});
</script>

<template>
    <VueFinalModal v-model="show" class="modal-container" content-class="modal-container-content">
        <slot :onClose="onClose" />
        <div id="modalFooter" class="modal-footer"></div>
    </VueFinalModal>
</template>

<style>
.modal-container {
    display: flex;
    justify-content: center;
    align-items: center;
}

.modal-container-content {
    display: flex;
    flex-direction: column;
    padding: 1rem;
    background: #fff;
    border-radius: 0.5rem;
}

.modal-container-content>*+* {
    margin: 0.5rem 0;
}

.modal-container-content h1 {
    font-size: 1.375rem;
}

.dark .modal-container-content {
    background: #000;
}
</style>