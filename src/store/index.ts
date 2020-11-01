import Vue from "vue";
import Vuex from "vuex";
import jobs from "./jobs";
import people from "./people";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    language: "en",
    processing: false,
    loading: false,
    windowSize: {
      height: 0,
      width:0
    }
  },
  getters: {
    getLanguage(state): string {
      if (localStorage.language) {
        return localStorage.language;
      } else {
        return state.language;
      }
    },
    getProcessing: (state): boolean => state.processing,
    getLoading: (state): boolean => state.loading,
    getWindowSize: (state): any => state.windowSize
  },
  mutations: {
    setLanguage(state, lang): void {
      state.language = lang;
      localStorage.language = lang;
    },
    setWindowSize(state, newSize): void {
      state.windowSize = newSize;
    },
    setStartProcessing(state): void {
      state.processing = true;
    },
    setStopProcessing(state): void {
      state.processing = false;
    },
    setStartLoading(state): void{
      state.loading = true;
    },
    setStopLoading(state): void{
      state.loading = false;
    }
  },
  actions: {
    changeLanguage(context, lang): void {
      context.commit("setLanguage", lang);
    },
    changeWindowSize(context, newSize): void {
      context.commit("setWindowSize", newSize);
    },
    stopProcessing(context): void{
      context.commit("setStopProcessing");
    },
    stopLoading(context): void{
      context.commit("setStopLoading");
    }
  },
  modules: { jobs, people }
});
