import Vue from "vue";
import VueRouter from "vue-router";
import Entry from "@/pages/Entries.vue";
import Login from "@/pages/Login.vue";

Vue.use(VueRouter);

const routes = [
  { path: "/", name: "entry", component: Entry },
  { path: "/login", name: "login", component: Login }
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes
});

export default router;
