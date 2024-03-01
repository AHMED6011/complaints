import "./assets/scss/style.css";

import { createApp } from "vue";
import { createPinia } from "pinia";

import App from "./App.vue";
import router from "./router";
import { useCookies } from "vue3-cookies";

import PrimeVue from "primevue/config";
import "primevue/resources/themes/aura-light-green/theme.css";

import Toast from "primevue/toast";
import Button from "primevue/button";
import ToastService from "primevue/toastservice";
import ProgressSpinner from "primevue/progressspinner";
import Paginator from "primevue/paginator";

import "primeicons/primeicons.css";

import "vue-awesome-paginate/dist/style.css";
import VueAwesomePaginate from "vue-awesome-paginate";

const cookies = useCookies().cookies;

const isAllowed = cookies.get("myCookie");

const app = createApp(App);

app.config.globalProperties.isAllow = isAllowed;

app.config.globalProperties.isAdmin = null;

app.config.globalProperties.API = "https://complaintapi.kodunya.com";

app.use(createPinia());

app.use(PrimeVue);

app.use(ToastService);

app.component("Toast", Toast);
app.component("Button", Button);
app.component("ProgressSpinner", ProgressSpinner);
app.component("Paginator", Paginator);

app.use(useCookies);

app.use(VueAwesomePaginate);

app.use(router);

app.mount("#app");

AOS.init({
  startEvent: "DOMContentLoaded",
  once: true,
});
export { isAllowed };
