<script setup lang="ts">
import { ref } from 'vue';
import { ModalsContainer } from 'vue-final-modal'
import { useRouter } from 'vue-router';
import { $bookmarksStore } from '@/services/bookmarks';
import { useToast } from 'vue-toast-notification';
const router = useRouter();

const exportLink = ref<string>("");
const helpLink = ref(`mailto:carlos.bear@gmail.com?subject=Bookmarks Help`);
const file = ref(<any>null);

const toggleHomePage = () => {
  router.push(document.location.pathname == "/manage" ? '/' : '/manage');
};

const exportToJson = () => {
  const sections = $bookmarksStore.export();
  if (sections.length == 0) return;

  const json = encodeURIComponent(
    JSON.stringify(
      sections,
      (_key, value) => {
        if (!value) {
          return undefined;
        }

        return value;
      },
      3
    )
  );
  const exportContent = "data:text/json;charset=utf-8," + json;
  exportLink.value = exportContent;
}

const importBookmarks = () => {
  if (file?.value.files?.length == 0) return;

  const fileData = file.value.files[0];
  const reader = new FileReader();
  reader.onload = (response) => {
    if (!response?.target) return;

    const contents = response.target.result;
    const [result, message] = $bookmarksStore.importFromJson(
      contents as string
    );

    const toaster = useToast();
    if (result) {
      toaster.success("Imported bookmarks");
    } else {
      toaster.error(message);
    }
  };
  reader.readAsText(fileData);
}

</script>

<template>
  <div id="app-container" class="app-container">
    <div class="header">
      <div class="logo">
        <button class="btn btn-link" @click="toggleHomePage" title="Home">
          <font-awesome-icon icon="bars" size="2x" />
        </button>
      </div>

      <div id="filter" class="search-filter"></div>

      <div class="header-buttons">
        <router-link to="/manage" class="btn btn-link">
          <font-awesome-icon icon="edit" size="2x" />
        </router-link>

        <a v-on:mousedown="exportToJson()" :href="exportLink" class="btn btn-default" download="bookmarks.json"
          id="export-to-json" title="Export bookmarks" ref="export">
          <font-awesome-icon icon="file-export" size="2x" />
        </a>

        <div>
          <input type="file" ref="file" style="display: none" @change="importBookmarks" />
          <button class="btn btn-link" @click="file.click()" title="Import bookmarks">
            <font-awesome-icon icon="file-import" size="2x" />
          </button>
        </div>

        <a type="button" class="btn btn-link" :href="helpLink" title="Contact Support" target="_blank">
          <font-awesome-icon icon="question" size="2x" />
        </a>
      </div>

      <span></span>
    </div>
    <div class="router-content">
      <router-view></router-view>
    </div>
  </div>
  <ModalsContainer />
</template>

<style scoped>
@import "@/colors.css";

.app-container {
  .header {
    width: 100%;
    display: grid;
    grid-template-columns: 5rem 30rem auto auto;
    grid-column-gap: 0.5rem;
    align-items: center;
    margin-bottom: 0rem;

    color: var(--primary) !important;

    .logo {
      button {
        padding: 0;
      }
    }

    .header-buttons {
      display: flex;
    }

    .token-error {
      color: red;
      font-weight: bold;
    }

    .search-filter {
      display: flex;
      flex-direction: row;
    }
  }

  .router-content {
    display: grid;
    grid-template-rows: auto;
    grid-row-gap: 1rem;
  }
}
</style>
