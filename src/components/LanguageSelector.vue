<template>
  <v-menu offset-y transition="slide-y-transition">
    <template v-slot:activator="{ on }">
      <v-btn text color="light-gray" v-on="on">
        <span class="font-weight-light caption">{{ selectedLanguage }}</span>
        <v-icon dark right>mdi-earth</v-icon>
      </v-btn>
    </template>
    <v-list>
      <v-list-item
        v-for="language in languages"
        :key="language.value"
        @click.prevent="updateLanguage(language.value)"
      >
        <v-list-item-title class="caption"
          >{{ language.label }} - {{ language.value.toUpperCase() }}
        </v-list-item-title>
      </v-list-item>
    </v-list>
  </v-menu>
</template>
<script lang="ts">
//import { Component, Vue } from "vue-property-decorator";
import { Vue, Component, MapAction, MapGetter } from "types-vue";

@Component
export default class LanguageSelector extends Vue {
  private selectedLanguage: string | undefined;
  private languages: unknown[] = [
    { value: "en", label: "English" },
    { value: "es", label: "Español" },
    { value: "fr", label: "Français" }
  ];
  @MapGetter()
  getLanguage: string | undefined;

  @MapAction()
  changeLanguage:any;

  updateLanguage(language: string): void {
    this.selectedLanguage = language;
    this.changeLanguage(this.selectedLanguage);
    this.$i18n.locale = this.selectedLanguage;
    this.$vuetify.lang.current = this.selectedLanguage;
  }

  created() {
    this.selectedLanguage = this.getLanguage;
  }
}
</script>
