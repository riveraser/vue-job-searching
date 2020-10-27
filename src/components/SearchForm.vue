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
          :rules="[(v) => !!v || $t('forms.searchError.enterText') , (v) => (v && v.length <= 30) || $t('forms.searchError.maxText')]"
          :label="label"
          required
          clearable
        ></v-text-field>
        <v-btn
          :disabled="!valid || isProcessing"
          color="success"
          class="mr-4 my-4"
          @click="validate"
          :loading="isProcessing"
          v-on:keydown.enter.prevent="validate"
        >
          {{ $t("forms.search") }}
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

//import { Component, Vue, Prop } from "vue-property-decorator";

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

  @MapGetter()
  getProcessing?: boolean;

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
  get isProcessing(): boolean {
    return this.getProcessing || false;
  }
}
</script>
