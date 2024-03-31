import { createRouter, createWebHistory } from "vue-router";

import BookmarksPage from "./components/bookmarks-page.vue";
import ManageBookmarks from "./components/manage-bookmarks/manage-bookmarks.vue";
import ColorsPage from "./components/colors.vue";

const routes = [
  {
    name: "home",
    path: "/",
    component: BookmarksPage,
  },
  {
    name: "manage-bookmarks",
    path: "/manage",
    component: ManageBookmarks,
  },
  {
    name: "colors",
    path: "/colors",
    component: ColorsPage,
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
