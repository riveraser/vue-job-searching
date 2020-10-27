import Vue from "vue";
import Vuetify from "vuetify";

// Translation provided by Vuetify (javascript)
import es from "vuetify/es5/locale/es";
import en from "vuetify/es5/locale/en";
import fr from "vuetify/es5/locale/fr";

Vue.use(Vuetify);

export default new Vuetify({
  lang: {
    locales: { es, en, fr },
    current: localStorage.language || "en", //Set the default locale
  },
  icons: {
    iconfont: "mdi",
  },
  theme: {
    themes: {
      light: {
        primary: "#022865",
        secondary: "#24479A",
        accent: "#1685C5",
        "light-blue": "#92C9E2",
        "pale-blue": "#B2E2F8",
        error: "#BA0000",
        warning: "#F3BF38",
        info: "#00bcd4",
        success: "#1A9D05",
        black: "#000000",
        "dark-gray": "#666666",
        gray: "#B3B3B3",
        "light-gray": "#E9E9E9",
        white: "#FFF",
        "light-gray-opacity": "#E9E9E922",
      },
    },
  },
});
