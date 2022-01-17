import { createRouter, createWebHistory } from "vue-router";
import auth from "./middleware/auth";
import store from "@/store";

const Home = () => import("@/views/Home.vue");
const Manage = () => import("@/views/Manage.vue");
const NotFound = () => import("@/views/NotFound.vue");
const Login = () => import("@/views/Login.vue");
const Song = () => import(/* webpackChunkName: "Song" */ "@/views/Song.vue");

const routes = [
  {
    path: "/",
    name: "home",
    component: Home,
  },
  {
    path: "/manage",
    alias: "/manage-music",
    name: "manage",
    component: Manage,
    meta: {
      middleware: auth,
      requiresAuth: true,
    },
  },
  {
    path: "/songs/:id",
    name: "songs.show",
    component: Song,
  },
  {
    path: "/404",
    name: "404",
    component: NotFound,
  },
  {
    path: "/login",
    name: "login",
    component: Login,
  },
  {
    path: "/:catchAll(.*)*",
    redirect: { name: "404" },
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
  linkExactActiveClass: "text-yellow-500",
});

router.beforeEach(function (to, from, next) {
  if (!to.meta.middleware) {
    return next();
  }

  const context = {
    to,
    from,
    next,
    store,
  };

  return to.meta.middleware({
    ...context,
  });
});

export default router;
