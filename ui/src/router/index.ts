import Vue from "vue";
import VueRouter from "vue-router";
import Entry from "@/pages/Entries.vue";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "entry",
    component: Entry
  }
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes
});

export default router;
