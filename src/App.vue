<template>
  <v-app>
    <Header></Header>
    <v-main class="grey lighten-3">
      <v-container fluid>
        <v-fade-transition mode="out-in">
          <router-view></router-view>
        </v-fade-transition>
      </v-container>
    </v-main>
    <Footer></Footer>
  </v-app>
</template>

<script lang="ts">
import Vue from "vue";
import Header from "./components/Header.vue";
import Footer from "./components/Footer.vue";

export default Vue.extend({
  name: "App",

  components: {
    Header,
    Footer
  },

  data: () => ({
    //
  })
});
</script>
