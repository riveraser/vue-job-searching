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
import { Vue, Component, MapAction, MapGetter } from "types-vue";
import Header from "./components/Header.vue";
import Footer from "./components/Footer.vue";

@Component({
  components: {
    Header,
    Footer
  }
})
export default class App extends Vue {
  
  @MapAction()
  changeWindowSize?: any;

  mounted() {
    // Initial Size
    this.changeWindowSize({
      height: window.innerHeight,
      width: window.innerWidth
    });

    // general listener to check when the document size changes
    window.addEventListener("resize", this.onWindowResize, true);
  }
  onWindowResize(): void {
    this.changeWindowSize({
      height: window.innerHeight,
      width: window.innerWidth
    });
  }
}
</script>
