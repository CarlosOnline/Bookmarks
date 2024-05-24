import { initializeDebugModule } from "./support/debug";
initializeDebugModule();

import { createApp, nextTick } from "vue";

import "bootstrap/dist/css/bootstrap.css";
import "./style.css";

import App from "./app.vue";
const app = createApp(App);

// Font awesome
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import unUsed from "./font-awesome.ts";
unUsed;
app.component("font-awesome-icon", FontAwesomeIcon);

// Setup eventBus using mitt
import mitt from "mitt";
const eventBus = mitt();
app.provide("eventBus", eventBus);

// Setup vue-select
import VueSelect from "vue-select";
import "vue-select/dist/vue-select.css";
app.component("v-select", VueSelect);

// Setup Tree View
import "vue3-tree-vue/dist/style.css";
import Vue3TreeVue from "vue3-tree-vue";
app.component("vue3-tree-vue", Vue3TreeVue);

// Setup router
import router from "./router";
app.use(router);

// Setup modal
import { createVfm } from "vue-final-modal";
import "vue-final-modal/style.css";
const vfm = createVfm();
app.use(vfm);

// Setup toast
import ToastPlugin from "vue-toast-notification";
import "vue-toast-notification/dist/theme-bootstrap.css";
app.use(ToastPlugin);

app.mount("#app");

nextTick(() => {
  postMessage({ payload: "removeLoading" }, "*");
});

console.log(
  "main loaded",
  import.meta.env.MODE,
  import.meta.env.BASE_URL,
  import.meta.env.VITE_APP_URL
);
