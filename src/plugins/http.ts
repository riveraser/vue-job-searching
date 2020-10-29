import Vue from "vue";

//---> Resource settings
import VueResource from "vue-resource";
Vue.use(VueResource);

Vue.http.interceptors.push((request:any, next: any) => {
  // add custom headers if needed here
  next();
});
//. Resource settings