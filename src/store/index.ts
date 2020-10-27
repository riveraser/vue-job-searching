import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
     language:"en"
  },
  getters: {
    getLanguage (state): string {
      if (localStorage.language) {
        return localStorage.language;
      } else {
        return state.language;
      }
    }
  },
  mutations: {
    setLanguage (state, lang): void {
      state.language = lang;
      localStorage.language = lang;
    }
  },
  actions: {
    changeLanguage (context, lang) {
      context.commit("setLanguage", lang);
    }
  },
  modules: {}
});
