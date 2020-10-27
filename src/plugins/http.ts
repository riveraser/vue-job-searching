import Vue from "vue";

//---> Resource settings
import VueResource from "vue-resource";
Vue.use(VueResource);

Vue.http.interceptors.push((request:any, next: any) => {
  request.headers.set(
    "Authorization",
    `Bearer ${window.localStorage.getItem("_token")}`
  );
  request.headers.set( "accept", "application/json, text/plain, */*");
  request.headers.set( "Access-Control-Allow-Origin", "*");
  next();
});
//. Resource settings