<template>
  <v-col cols="12" md="4" lg="3">
    <v-sheet rounded="lg" class="px-5 py-4">
      <v-form
        ref="form"
        v-model="valid"
        lazy-validation
        @submit.enter.prevent="validate()"
      >
        <v-text-field
          v-model="searchWord"
          :counter="30"
          :rules="[
            v => !!v || $t('forms.searchError.enterText'),
            v => (v && v.length <= 30) || $t('forms.searchError.maxText')
          ]"
          :label="label"
          required
          clearable
          v-on:keydown.enter.prevent="validate"
          autocomplete="off"
        ></v-text-field>
        <v-btn
          :disabled="!valid || isProcessing"
          color="success"
          class="mr-4 my-4"
          @click="validate"
          :loading="isProcessing"
          small
        >
          {{ $t("forms.search") }}
        </v-btn>
        <v-btn
          :disabled="!showReset"
          color="primary"
          class="mr-4 my-4"
          @click="resetForm"
          outlined
          small
        >
          {{ $t("forms.resetResults") }}
        </v-btn>

        <div class="caption">
          {{ resultText }}
        </div>
      </v-form>
    </v-sheet>
  </v-col>
</template>

<script lang="ts">
import { Vue, Component, MapGetter, Prop } from "types-vue";


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
  @Prop()
  resultText?: string;
  @Prop()
  showReset?: boolean;

  @MapGetter()
  getProcessing?: boolean;

  mounted() {
    this.valid = false;
  }

  validate() {
    this.$refs.form.validate();
    if (this.valid) {
      this.$emit("do-search");
    }
  }

  resetForm() {
    this.$emit("reset-form");
    this.$refs.form.reset();
    this.searchWord = "";
    this.$emit("update:search", "");
  }

  get searchWord() {
    return this.search || "";
  }
  set searchWord(val: string) {
    this.$emit("update:search", val);
  }
  get isProcessing(): boolean {
    return this.getProcessing || false;
  }
}
</script>
