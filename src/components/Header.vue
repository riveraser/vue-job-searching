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
    <template v-slot:extension class="flex-column">
      <div>
        <v-btn-toggle active-class="selected-menu" borderless dense tile group>
          <v-btn class="ma-0" value="left" to="/jobs">
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
      </div>
      <div class="progress-bar" v-if="getProcessing || getLoading">
        <v-progress-linear
          color="deep-orange accent-4"
          height="4"
          indeterminate
        ></v-progress-linear>
      </div>
    </template>
  </v-app-bar>
</template>

<script lang="ts">
import { Vue, Component, MapGetter } from "types-vue";
import LanguageSelector from "./LanguageSelector.vue";

@Component({
  components: {
    LanguageSelector
  }
})
export default class Header extends Vue {
  @MapGetter()
  getProcessing: string | undefined;

  @MapGetter()
  getLoading: string | undefined;
}
</script>
<style lang="less">
@import "~@/less/_variables.less";
// override the default color
.v-toolbar__extension {
  font-weight: 300;
  background-color: @accent;
  flex-direction: row;
  flex-direction: column;
  align-items: flex-start !important;
  padding: 0 !important;

  .progress-bar {
    width: 100%;
  }
}
</style>
