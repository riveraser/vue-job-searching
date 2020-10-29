import Vue from "vue";
import VueRouter, { RouteConfig } from "vue-router";
import Home from "@/views/Home.vue";
import PeopleSearch from "@/views/PeopleSearch.vue";

Vue.use(VueRouter);

const routes: RouteConfig[] = [
  {
    path: "/",
    name: "Home",
    component: Home
  },
  {
    path: "/people",
    name: "People",
    component: PeopleSearch
  }
];

const router = new VueRouter({
  mode: "history",
  base: process.env.NODE_ENV === 'development' ? '/' : '/vue-search-jobs/', // To upload to my personal website real DIST path should be set here
  routes
});
export default router;
