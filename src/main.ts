import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";

//----> Plugins configurations imports
import vuetify from './plugins/vuetify';
import i18n from './plugins/vue-I18n';

Vue.config.productionTip = false; 

new Vue({
  router,
  store,
  vuetify,
  i18n,
  render: h => h(App)
}).$mount("#app");
