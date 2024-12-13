import "./style.css";

import { ViteSSG } from "vite-ssg/single-page";
import { createPinia } from "pinia"; 
import { createHead } from "@vueuse/head";
import App from "./App.vue";
import createMyRouter from "./router";
import { createConvexVue } from "@convex-vue/core";
/* @ts-ignore */
import { Cloudinary } from "cloudinary-vue";

export const createApp = ViteSSG(
  App,
  ({ app, isClient }) => {
    const router = createMyRouter();

    const convexVue = createConvexVue({
      convexUrl: import.meta.env.VITE_CONVEX_URL,
    });
    app.use(convexVue);
    app.use(router);
    app.use(createPinia());

    const head = createHead();
    app.use(head);
    app.use(Cloudinary, {
      configuration: {
        cloudName: import.meta.env.VITE_CLOUDINARY_CLOUD_NAME,
        apiKey: import.meta.env.VITE_CLOUDINARY_API_KEY,
        apiSecret: import.meta.env.VITE_CLOUDINARY_API_SECRET,
      },
    });

  }
);
