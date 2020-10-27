import Vue from "vue";
import Vuex from "vuex";
import jobs from "./jobs";
import people from "./people";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    language: "en",
    processing: false,
  },
  getters: {
    getLanguage(state): string {
      if (localStorage.language) {
        return localStorage.language;
      } else {
        return state.language;
      }
    },
    getProcessing: (state) => state.processing,
  },
  mutations: {
    setLanguage(state, lang): void {
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
    changeLanguage(context, lang) {
      context.commit("setLanguage", lang);
    },
  },
  modules: { jobs, people }
});
