import Vue from "vue";
import VueRouter, { RouteConfig } from "vue-router";
import JobsHome from "@/views/jobs/Home.vue";
import JobsDetail from "@/views/jobs/Details.vue";
import PeopleHome from "@/views/people/Home.vue";
import goTo from 'vuetify/es5/services/goto';

//Global store
import store from "@/store/index";

Vue.use(VueRouter);

const routes: RouteConfig[] = [
  {
    path: "/",
    redirect: '/jobs'
  },
  {
    path: "/jobs",
    name: "Jobs",
    component: JobsHome
  },
  {
    path: "/jobs/:id",
    name: "JobsDetail",
    component: JobsDetail
  },
  {
    path: "/people",
    name: "People",
    component: PeopleHome
  },
  {
    path: '*', redirect: '/jobs'
  }
];

const router = new VueRouter({
  mode: "history",
  base: process.env.NODE_ENV === 'development' ? '/' : '/vue-search-jobs/', // To upload to my personal website real DIST path should be set here
  routes,
  scrollBehavior: (to, from, savedPosition) => {
    let scrollTo:any = 0;
    if (to.hash) {
      scrollTo = to.hash;
    } else if (savedPosition) {
      scrollTo = savedPosition.y;
    }
    return goTo(scrollTo);
  },
  
});

// To change the route
router.beforeEach((to, from, next) => {
  store.commit("setStartLoading");
  next();
});

export default router;
