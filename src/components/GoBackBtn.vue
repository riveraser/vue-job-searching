<template>
  <v-btn text depressed small @click="goBack">
    <v-icon>mdi-chevron-left</v-icon>
    {{ $t("navigation.goBack") }}
  </v-btn>
</template>

<script lang="ts">
import { Vue, Component } from "types-vue";
@Component
export default class GoBackBtn extends Vue {
  goBack() {
    this.$router.go(-1);
  }
}
</script>