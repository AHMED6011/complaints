import "./assets/scss/style.css";

import { createApp } from "vue";
import { createPinia } from "pinia";

import App from "./App.vue";
import router from "./router";
import { useCookies } from "vue3-cookies";

const cookies = useCookies().cookies;

const isAllowed = cookies.get("myCookie");

const app = createApp(App);

app.config.globalProperties.isAllow = isAllowed;

app.config.globalProperties.isAdmin = null;

app.config.globalProperties.API = "https://complaintapi.kodunya.com";

app.use(createPinia());

app.use(useCookies);

app.use(router);

app.mount("#app");

AOS.init({
  startEvent: "DOMContentLoaded",
  once: true,
});
export { isAllowed };
