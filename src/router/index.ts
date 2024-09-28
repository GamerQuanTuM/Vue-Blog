import { createRouter, createWebHistory } from "vue-router";
import HomeView from "@/views/HomeView.vue";
import TechnologyView from "@/views/TechnologyView.vue";
import SportsView from "@/views/SportsView.vue";
import GamingView from "@/views/GamingView.vue";
import EntertainmentView from "@/views/EntertainmentView.vue";
import SinglePostView from "@/views/SinglePostView.vue";
import AdminView from "@/views/AdminView.vue";

const createMyRouter = () => {
  return createRouter({
    history: createWebHistory("/"),
    routes: [
      {
        path: "/",
        name: "home",
        component: HomeView,
      },
      {
        path: "/tech",
        name: "technology",
        component: TechnologyView,
      },
      {
        path: "/sports",
        name: "sports",
        component: SportsView,
      },
      {
        path: "/gaming",
        name: "gaming",
        component: GamingView,
      },
      {
        path: "/entertainment",
        name: "entertainment",
        component: EntertainmentView,
      },
      {
        path: "/:id",
        name: "single-post",
        component: SinglePostView,
      },
      {
        path: "/admin",
        name: "admin",
        component: AdminView,
      },
    ],
    scrollBehavior(to, from, savedPosition) {
      return { top: 0 };
    }
  });


};

export default createMyRouter;
