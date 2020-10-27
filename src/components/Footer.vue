<template>
  <div>
    <v-footer color="black" dark app>
      <v-row align="center" justify="center" fluid>
        <v-col class="text-left caption" cols="4">
          <strong>©SRivera</strong>
          - {{ $t("template.copyright") }} {{ new Date().getFullYear() }}.
        </v-col>
        <v-col class="text-right caption" cols="8">
          <a class="white--text">{{ $t("template.termsUse") }}</a>
          <v-divider class="mx-2" light inset vertical></v-divider>
          <a class="white--text">{{ $t("template.privacyPolicy") }}</a>
        </v-col>
      </v-row>
    </v-footer>
  </div>
</template>

<script>
export default {
  data() {
    return {
      showTerms: false
    };
  }
};
</script>
