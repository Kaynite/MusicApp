import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import VeeValidate from "./includes/validation";
import { auth } from "./includes/firebase";
import Icon from "@/directives/icon";
import "./assets/tailwind.css";
import "./assets/main.css";
import "nprogress/nprogress.css";
import i18n from "./includes/i18n";
import "./registerServiceWorker";
import ProgressBar from "@/includes/progress-bar";

ProgressBar(router);

let app;
auth.onAuthStateChanged(() => {
  if (!app) {
    app = createApp(App);
    app.use(store);
    app.use(router);
    app.use(VeeValidate);
    app.use(i18n);
    app.directive("icon", Icon);
    app.mount("#app");
  }
});
