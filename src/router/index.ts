import Vue from "vue";
import VueRouter, { RouteConfig } from "vue-router";
import JobsHome from "@/views/jobs/Home.vue";
import JobsDetail from "@/views/jobs/Details.vue";
import PeopleHome from "@/views/people/Home.vue";
import PeopleDetail from "@/views/people/Details.vue";
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
    component: JobsHome,
    meta: { pageTitle: "Jobs" }
  },
  {
    path: "/jobs/:id",
    name: "JobsDetail",
    component: JobsDetail,
    meta: { pageTitle: "Job details - " }
  },
  {
    path: "/people",
    name: "People",
    component: PeopleHome,
    meta: { pageTitle: "People" }
  },
  {
    path: "/people/:id",
    name: "PeopleDetail",
    component: PeopleDetail,
    meta: { pageTitle: "People details - " }
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
      setTimeout(()=>{return goTo(scrollTo); },750); //  Give time to Vue to render the content
    } else if (savedPosition) {
      scrollTo = savedPosition.y;
      setTimeout(()=>{return goTo(scrollTo); },750); //  Give time to Vue to render the content
    } else {
      return goTo(scrollTo);
    }
  },
  
});

// To change the route
router.beforeEach((to, from, next) => {
  store.commit("setStartLoading");
  
  // Will set the document Title based on the meta for each route
  if (to.meta.pageTitle){
    document.title = to.meta.pageTitle;
    
    // Will set the title extra information 
    if (to.params && to.params.pageTitle){
      document.title += " " + to.params.pageTitle;
    }
  }
  next();
});

export default router;
