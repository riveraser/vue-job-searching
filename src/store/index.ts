import Vue from "vue";
import Vuex from "vuex";
import jobs from './jobs';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
     language:"en",
     processing: false
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
    },
    setStartProcessing(state) {
      state.processing = true;
    },
    setStopProcessing(state) {
      state.processing = false;
    },
  },
  actions: {
    changeLanguage (context, lang) {
      context.commit("setLanguage", lang);
    },
  
  },
  modules: {jobs}
});
