import Vue from "vue";
import VueRouter from "vue-router";
import store from "@/store";
import SignUp from "@/views/Account/SignUp.vue";
import Login from "@/views/Account/Login.vue";
import Home from "@/views/Home.vue";
import FindPass from "@/views/Account/FindPass.vue";

Vue.use(VueRouter);

// login required
const requireAuth = () => (to, from, next) => {
  if (store.state.accessToken !== null) {
    return next();
  }
  return next("/Login");
};
const routes = [
  {
    path: "/",
    name: "Home",
    component: Home,
    beforeEnter: requireAuth()
  },
  {
    path: "/SignUp",
    name: "SignUp",
    component: SignUp
  },
  {
    path: "/Login",
    name: "Login",
    component: Login
  },
  {
    path: "/FindPass",
    name: "FindPass",
    component: FindPass
  }
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes
});

export default router;
