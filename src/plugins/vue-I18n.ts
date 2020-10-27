import Vue from "vue";
//---> vue translatations
import VueI18n from "vue-i18n";
Vue.use(VueI18n);
import messages from "@/translations/index.ts";
import store from "@/store/index";
export default new VueI18n({
  locale: store.getters.getLanguage,
  messages
});
//.vue translations
