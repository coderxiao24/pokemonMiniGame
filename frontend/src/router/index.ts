import { createRouter, createWebHistory } from "vue-router";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "home",
      component: () => import("../views/HomeView.vue"),
    },
    {
      path: "/Register",
      name: "register",
      component: () => import("../views/Register.vue"),
    },
    {
      path: "/Login",
      name: "login",
      component: () => import("../views/Login.vue"),
    },
  ],
});

export default router;
