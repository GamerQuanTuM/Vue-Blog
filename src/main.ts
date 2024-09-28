import "./style.css";

import { createApp } from "vue";
import { createPinia } from "pinia";

import App from "./App.vue";
import createMyRouter from "./router";
import { createConvexVue } from "@convex-vue/core";
{/* @ts-ignore */}
import { Cloudinary } from 'cloudinary-vue';


const app = createApp(App);

const router = createMyRouter();
const convexVue = createConvexVue({
  convexUrl: import.meta.env.VITE_CONVEX_URL,
});
app.use(convexVue);
app.use(router);
app.use(Cloudinary, {
  configuration: {
    cloudName: import.meta.env.VITE_CLOUDINARY_CLOUD_NAME,
    apiKey: import.meta.env.VITE_CLOUDINARY_API_KEY,
    apiSecret: import.meta.env.VITE_CLOUDINARY_API_SECRET
  }
});
app.use(createPinia());

app.mount("#app");


