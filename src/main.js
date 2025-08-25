import "@/assets/css/bootstrap-icons/bootstrap-icons.min.css";
import "@/assets/css/fonts.css";
import "@/assets/css/root.css";
import "@/assets/css/style.css";
import "@/assets/css/icon.css";
import "@/assets/css/slider.css";
import "@/assets/css/modal.css";

import { createApp } from "vue";
import store from "@/store";
import App from "@/App.vue";
import router from "@/router.js";

import {appMixin} from "@/mixins/app";
import i18n from "@/global/lang.js";
import {modal} from "@/global/Modal.js";
import {post} from "@/global/post.js";
import dateTime from "@/global/dateTime.js";
import {num} from "@/global/num.js";

import {GlobalMethods} from "@/global/main";

import Sidebar from "@/components/app/Sidebar.vue";
import Modal from "@/components/app/Modal.vue";
import Dropdown from "@/components/app/Dropdown.vue";
import Navbar from "@/components/app/Navbar.vue";
import Toast from 'vue-toastification';
import 'vue-toastification/dist/index.css';

const app = createApp(App);
app.mixin(appMixin);

app.config.globalProperties.$modal = modal;
app.config.globalProperties.$post = post;
app.config.globalProperties.$num = num;
app.config.globalProperties.$dateTime = dateTime();
GlobalMethods.$modal = modal;

const toastOptions = {
  position: "top-right",
  timeout: 3000,
  closeOnClick: true,
  pauseOnFocusLoss: true,
  pauseOnHover: true,
  draggable: true,
  draggablePercent: 0.6,
  showCloseButtonOnHover: false,
  hideProgressBar: false,
  closeButton: true,
  icon: true,
  rtl: false,
  transition: "Vue-Toastification__bounce",
  maxToasts: 5,
  newestOnTop: true
};

app.use(store);
app.use(router);
app.use(i18n);
app.use(Toast, toastOptions);

app.component("Modal", Modal);
app.component("Dropdown", Dropdown);
app.component("Sidebar", Sidebar);
app.component("Navbar", Navbar);

app.mount("#app");
