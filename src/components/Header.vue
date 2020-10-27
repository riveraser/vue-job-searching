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
    {{ $t("template.welcome") }} |
    <LanguageSelector></LanguageSelector>
    <template v-slot:extension>
      <v-btn-toggle active-class="selected-menu" borderless dense tile group>
        <v-btn class="ma-0" value="left" to="/">
          <span class="font-weight-light">{{
            $t("navigation.jobSearch")
          }}</span>
        </v-btn>

        <v-btn class="ma-0" value="center" to="/people">
          <span class="font-weight-light">{{
            $t("navigation.peopleSearch")
          }}</span>
        </v-btn>
      </v-btn-toggle>
      <v-spacer></v-spacer>
    </template>
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
<style lang="less">
@import "~@/less/_variables.less";
// override the default color
.v-toolbar__extension {
  font-weight: 300;
  background-color: @accent;
}
</style>
