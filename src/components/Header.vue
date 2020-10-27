<template>
  <v-app-bar extension-height="36" app color="primary" dark>
    <div class="d-flex align-center">
      <v-img
        alt="Vuetify Logo"
        class="shrink mr-2"
        contain
        :src="require('@/assets/logoSRmedium.png')"
        transition="scale-transition"
        width="170"
      />
    </div>
    <v-spacer></v-spacer>
    {{ $t("template.welcome") }}
    <v-spacer></v-spacer>
    <LanguageSelector></LanguageSelector>
  </v-app-bar>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import LanguageSelector from "./LanguageSelector.vue";

@Component({
  components: {
    LanguageSelector
  }
})
export default class Header extends Vue {}
</script>
