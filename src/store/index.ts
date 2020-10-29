import Vue from "vue";
import Vuex from "vuex";
import jobs from "./jobs";
import people from "./people";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    language: "en",
    processing: false,
    loading: false
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
    getLoading: (state) => state.loading,
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
    setStartLoading(state){
      state.loading = true;
    },
    setStopLoading(state){
      state.loading = false;
    }
  },
  actions: {
    changeLanguage(context, lang) {
      context.commit("setLanguage", lang);
    },
    stopProcessing(context){
      context.commit("setStopProcessing");
    },
    stopLoading(context){
      context.commit("setStopLoading");
    }
  },
  modules: { jobs, people }
});
