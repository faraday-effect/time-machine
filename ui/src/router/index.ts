import Vue from "vue";
import VueRouter from "vue-router";
import vuexStore from "@/store";
import Entry from "@/pages/Entries.vue";
import LogIn from "@/pages/LogIn.vue";
import SignUp from "@/pages/SignUp.vue";
import NotFound from "@/pages/NotFound.vue";
import Password from "@/pages/Password.vue";

Vue.use(VueRouter);

const routes = [
  { path: "/", name: "entries", component: Entry },
  { path: "/log-in", name: "login", component: LogIn },
  { path: "/change-password", name: "password", component: Password },
  { path: "/sign-up", name: "signup", component: SignUp },
  { path: "*", component: NotFound }
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes
});

router.beforeEach((to, from, next) => {
  if (vuexStore.getters.isLoggedIn) {
    next(); // Already logged in.
  } else if (to.name === "login") {
    next(); // Avoid infinite loop
  } else {
    next({ name: "login" }); // Force login.
  }
});

export default router;
