<template>
  <v-col cols="12" md="4" lg="3">
    <v-sheet rounded="lg" class="px-5 py-4">
      <v-form ref="form" v-model="valid" lazy-validation>
        <v-text-field
          v-model="searchWord"
          :counter="30"
          :rules="searchRules"
          :label="label"
          required
          clearable
        ></v-text-field>
        <v-btn
          :disabled="!valid"
          color="success"
          class="mr-4 my-4"
          @click="validate"
        >
          {{ $t("forms.search") }}
        </v-btn>
      </v-form>
    </v-sheet>
  </v-col>
</template>

<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";

@Component
export default class SearchForm extends Vue {
  $refs!: {
    form: HTMLFormElement;
  };

  private valid?: boolean = false;

  @Prop()
  search?: string;
  @Prop()
  label?: string;

  private searchRules: unknown[] = [
    (v: string) => !!v || this.$t("forms.searchError.enterText"),
    (v: string) => (v && v.length <= 30) || this.$t("forms.searchError.maxText")
  ];

  validate() {
    this.$refs.form.validate();

    if (this.valid) {
      this.$emit("do-search");
    }
  }

  mounted() {
    this.valid = false;
  }

  get searchWord() {
    return this.search || "";
  }
  set searchWord(val: string) {
    this.$emit("update:search", val);
  }
}
</script>
