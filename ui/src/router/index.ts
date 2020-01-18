import Vue from "vue";
import VueRouter from "vue-router";
import Entry from "@/pages/Entries.vue";
import LogIn from "@/pages/LogIn.vue";
import SignUp from "@/pages/SignUp.vue";

Vue.use(VueRouter);

const routes = [
  { path: "/", name: "entry", component: Entry },
  { path: "/log-in", name: "log-in", component: LogIn },
  { path: "/sign-up", name: "sign-up", component: SignUp }
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes
});

export default router;
